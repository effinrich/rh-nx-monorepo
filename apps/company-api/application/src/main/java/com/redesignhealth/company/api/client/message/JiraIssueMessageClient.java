package com.redesignhealth.company.api.client.message;

import static com.redesignhealth.company.api.property.JiraRequestProperties.Issue.GITHUB_FIELD;
import static com.redesignhealth.company.api.property.JiraRequestProperties.Issue.SSO_FIELD;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.redesignhealth.company.api.dto.command.InfraRequestCommand;
import com.redesignhealth.company.api.entity.request.RequestStatus;
import com.redesignhealth.company.api.property.JiraRequestProperties;
import com.redesignhealth.jira.rest.client.model.ChangeDetails;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import software.amazon.awssdk.services.sqs.SqsClient;

public class JiraIssueMessageClient implements MessageClient<InfraRequestCommand> {

  private static final Logger logger = LoggerFactory.getLogger(JiraIssueMessageClient.class);

  private final SqsClient sqsClient;
  private final String queueUrl;
  private final ObjectMapper objectMapper;

  private final JiraRequestProperties.Infrastructure jiraInfraProperties;

  public JiraIssueMessageClient(
      SqsClient sqsClient,
      String queueUrl,
      ObjectMapper objectMapper,
      JiraRequestProperties properties) {
    this.sqsClient = sqsClient;
    this.queueUrl = queueUrl;
    this.objectMapper = objectMapper;
    this.jiraInfraProperties = properties.getInfrastructure();
  }

  @Override
  public List<Message<InfraRequestCommand>> receiveMessages() {
    var response =
        sqsClient.receiveMessage((request) -> request.maxNumberOfMessages(10).queueUrl(queueUrl));

    return response.messages().stream()
        .map(
            (m) -> {
              try {
                var payload = objectMapper.readValue(m.body(), JiraWebhookPayload.class);

                var newStatus = getNewStatus(payload);

                var issueFields = payload.getIssue().getFields();
                var ssoUrl =
                    Objects.toString(
                        issueFields.get(
                            jiraInfraProperties.getParentIssue().getFieldId(SSO_FIELD)));
                var githubOrgUrl =
                    Objects.toString(
                        issueFields.get(
                            jiraInfraProperties.getParentIssue().getFieldId(GITHUB_FIELD)));

                var command =
                    InfraRequestCommand.builder()
                        .status(newStatus.orElse(null))
                        .jiraIssueId(payload.getIssue().getKey())
                        .sso(ssoUrl)
                        .githubOrganization(githubOrgUrl)
                        .build();
                return Message.of(command, m.receiptHandle());

              } catch (JsonProcessingException e) {
                logger.error("Unable to process payload {}.", m.body());
              }
              return Message.of(new InfraRequestCommand(), m.receiptHandle());
            })
        .toList();
  }

  private Optional<RequestStatus> getNewStatus(JiraWebhookPayload payload) {
    var STATUS_FIELD = "status";
    if (null != payload.getChangelog()) {
      return payload.getChangelog().getItems().stream()
          .filter((i) -> STATUS_FIELD.equals(i.getFieldId()))
          .findFirst()
          .flatMap(this::translateStatus);
    }
    return Optional.empty();
  }

  /** Convert from Jira status to {@link RequestStatus} */
  private Optional<RequestStatus> translateStatus(ChangeDetails jiraStatusChange) {
    var newStatus =
        Arrays.stream(RequestStatus.values())
            .filter(
                (status) ->
                    jiraStatusChange.getTo().equals(jiraInfraProperties.getStatusId(status)))
            .findFirst();

    if (newStatus.isEmpty()) {
      logger.warn("Unsupported Jira status id: {}.", jiraStatusChange.getTo());
    }

    return newStatus;
  }

  @Override
  public void deleteMessage(Message<InfraRequestCommand> message) {
    sqsClient.deleteMessage((request) -> request.queueUrl(queueUrl).receiptHandle(message.getId()));
  }
}
