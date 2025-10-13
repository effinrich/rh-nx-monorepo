package com.redesignhealth.company.api.task;

import com.redesignhealth.company.api.client.email.EmailSender;
import com.redesignhealth.company.api.client.message.MessageClient;
import com.redesignhealth.company.api.dto.command.InfraRequestCommand;
import com.redesignhealth.company.api.entity.request.InfrastructureRequest;
import com.redesignhealth.company.api.entity.request.RequestStatus;
import com.redesignhealth.company.api.repository.InfraRequestRepository;
import com.redesignhealth.company.api.repository.PersonRepository;
import com.redesignhealth.company.api.repository.TaskRepository;
import java.util.Set;
import java.util.concurrent.TimeUnit;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

/**
 * Responsible for consuming Jira Issue status updates and updating {@link
 * InfrastructureRequest#getStatus()} to reflect those status updates.
 */
@Component
public class UpdateInfraStatusTask extends TaskDefinition {

  private static final Logger logger = LoggerFactory.getLogger(UpdateInfraStatusTask.class);

  private final MessageClient<InfraRequestCommand> messageClient;

  private final InfraRequestRepository infraRequestRepository;

  private final PersonRepository personRepository;

  private final EmailSender emailSender;

  public UpdateInfraStatusTask(
      TaskRepository taskRepository,
      MessageClient<InfraRequestCommand> messageClient,
      InfraRequestRepository infraRequestRepository,
      PersonRepository personRepository,
      EmailSender emailSender) {
    super(taskRepository);
    this.messageClient = messageClient;
    this.infraRequestRepository = infraRequestRepository;
    this.personRepository = personRepository;
    this.emailSender = emailSender;
  }

  @Scheduled(fixedRate = 15, timeUnit = TimeUnit.SECONDS)
  public void run() {
    runTask(true);
  }

  @Override
  public void runTaskInternal() {
    var messages = messageClient.receiveMessages();

    for (var m : messages) {
      var command = m.getContent();
      try {
        if (null == command.getStatus() || null == command.getJiraIssueId()) {
          logger.info("Ignoring status update for id: {}", m.getId());
          messageClient.deleteMessage(m);
          continue;
        }
        var infraRequest =
            infraRequestRepository.findByJiraIssueId(command.getJiraIssueId()).orElse(null);
        if (infraRequest != null) {
          infraRequest.setStatus(command.getStatus());
          infraRequestRepository.save(infraRequest);

          if (command.getStatus() == RequestStatus.DONE) {
            var members = personRepository.findAllByMemberOf(infraRequest.getCompany().getApiId());
            emailSender.sendInfrastructureReady(
                Set.copyOf(members), command.getGithubOrganization(), command.getSso());
          }
        }
      } finally {
        messageClient.deleteMessage(m);
      }
    }
  }
}
