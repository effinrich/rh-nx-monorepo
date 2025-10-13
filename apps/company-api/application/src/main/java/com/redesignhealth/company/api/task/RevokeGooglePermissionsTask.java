package com.redesignhealth.company.api.task;

import com.redesignhealth.company.api.client.email.EmailSender;
import com.redesignhealth.company.api.client.file.GoogleDriveClient;
import com.redesignhealth.company.api.dto.enums.CompanyMemberStatus;
import com.redesignhealth.company.api.entity.CompanyMember;
import com.redesignhealth.company.api.exception.GoogleDriveException;
import com.redesignhealth.company.api.repository.CompanyMemberRepository;
import com.redesignhealth.company.api.repository.TaskRepository;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.TimeUnit;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class RevokeGooglePermissionsTask extends TaskDefinition {
  private final CompanyMemberRepository companyMemberRepository;
  private final GoogleDriveClient googleDriveClient;

  private final List<String> recipients;
  private final EmailSender emailSender;

  public RevokeGooglePermissionsTask(
      TaskRepository taskRepository,
      CompanyMemberRepository companyMemberRepository,
      GoogleDriveClient googleDriveClient,
      @Value("${gdrive-revoke-permission-notification.recipients}") List<String> recipients,
      EmailSender emailSender) {
    super(taskRepository);
    this.companyMemberRepository = companyMemberRepository;
    this.googleDriveClient = googleDriveClient;
    this.recipients = recipients;
    this.emailSender = emailSender;
  }

  @Scheduled(fixedRate = 5, timeUnit = TimeUnit.MINUTES)
  public void run() {
    runTask(true);
  }

  @Override
  public void runTaskInternal() {
    List<String> memberEmailWithIssues = new ArrayList<>();
    var membersDeSync =
        companyMemberRepository.findAllByStatusAndGoogleDriveFolderAccess(
            CompanyMemberStatus.INACTIVE, true);
    for (CompanyMember memberDeSync : membersDeSync) {
      if (memberDeSync.getCompany().getOnboardDocsFolderId() != null) {
        try {
          googleDriveClient.revokeAccess(
              memberDeSync.getCompany().getOnboardDocsFolderId(),
              memberDeSync.getPerson().getEmail());
          memberDeSync.setGoogleDriveFolderAccess(false);
          companyMemberRepository.save(memberDeSync);
        } catch (GoogleDriveException gde) {
          log.error(gde.getMessage());
          memberEmailWithIssues.add(memberDeSync.getPerson().getEmail().getEmail());
        }
      }
    }
    if (!memberEmailWithIssues.isEmpty())
      emailSender.sendRevokeGFolderPermissionError(recipients, memberEmailWithIssues);
  }
}
