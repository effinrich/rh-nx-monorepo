package com.redesignhealth.company.api.task;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.redesignhealth.company.api.client.email.EmailSender;
import com.redesignhealth.company.api.client.file.GoogleDriveClient;
import com.redesignhealth.company.api.dto.enums.CompanyMemberStatus;
import com.redesignhealth.company.api.entity.Company;
import com.redesignhealth.company.api.entity.CompanyMember;
import com.redesignhealth.company.api.entity.Person;
import com.redesignhealth.company.api.entity.TaskHistory;
import com.redesignhealth.company.api.entity.ref.TaskRef;
import com.redesignhealth.company.api.repository.CompanyMemberRepository;
import com.redesignhealth.company.api.repository.TaskRepository;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
public class RevokeGooglePermissionsTaskTest {
  @Mock TaskRepository taskRepository;
  @Mock CompanyMemberRepository companyMemberRepository;
  @Mock GoogleDriveClient googleDriveClient;

  @Mock EmailSender emailSender;

  TaskHistory taskHistory =
      TaskHistory.from(TaskRef.of(RevokeGooglePermissionsTask.class.getName()));

  @Test
  public void Test_When_There_Is_Mismatch_Into_Member_And_GFolderAccess() {
    var someId = "some_id";
    var person = Person.from("testUser@redesignhealth.com");
    var company = Company.from("asghjh");
    company.setOnboardDocsFolderId(someId);
    var member = new CompanyMember(company, person, CompanyMemberStatus.INACTIVE, true);
    when(taskRepository.findByName(taskHistory.getName())).thenReturn(Optional.of(taskHistory));
    when(companyMemberRepository.findAllByStatusAndGoogleDriveFolderAccess(
            CompanyMemberStatus.INACTIVE, true))
        .thenReturn(List.of(member));
    doNothing().when(googleDriveClient).revokeAccess(someId, person.getEmail());
    var task =
        new RevokeGooglePermissionsTask(
            taskRepository, companyMemberRepository, googleDriveClient, List.of(), emailSender);
    task.run();
    assertThat(taskHistory.hasRun()).isTrue();
    verify(googleDriveClient, times(1)).revokeAccess(someId, person.getEmail());
    verify(companyMemberRepository, times(1)).save(member);
    assertFalse(member.isGoogleDriveFolderAccess());
  }

  @Test
  public void Test_When_There_Is_Not_Mismatch_Into_Member_And_GFolderAccess() {
    var someId = "some_id";
    var person = Person.from("testUser@redesignhealth.com");
    var company = Company.from("asghjh");
    company.setOnboardDocsFolderId(someId);
    var member = new CompanyMember(company, person, CompanyMemberStatus.INACTIVE, true);
    when(taskRepository.findByName(taskHistory.getName())).thenReturn(Optional.of(taskHistory));
    when(companyMemberRepository.findAllByStatusAndGoogleDriveFolderAccess(
            CompanyMemberStatus.INACTIVE, true))
        .thenReturn(List.of());
    var task =
        new RevokeGooglePermissionsTask(
            taskRepository, companyMemberRepository, googleDriveClient, List.of(), emailSender);
    task.run();
    assertThat(taskHistory.hasRun()).isTrue();
    verify(googleDriveClient, never()).revokeAccess(someId, person.getEmail());
    verify(companyMemberRepository, never()).save(member);
  }

  @Test
  public void Test_When_There_Is_Mismatch_Into_Member_And_GFolderAccess_But_OnboardIsNull() {
    var someId = "some_id";
    var person = Person.from("testUser@redesignhealth.com");
    var company = Company.from("asghjh");
    var member = new CompanyMember(company, person, CompanyMemberStatus.INACTIVE, true);
    when(taskRepository.findByName(taskHistory.getName())).thenReturn(Optional.of(taskHistory));
    when(companyMemberRepository.findAllByStatusAndGoogleDriveFolderAccess(
            CompanyMemberStatus.INACTIVE, true))
        .thenReturn(List.of(member));
    var task =
        new RevokeGooglePermissionsTask(
            taskRepository, companyMemberRepository, googleDriveClient, List.of(), emailSender);
    task.run();
    assertThat(taskHistory.hasRun()).isTrue();
    verify(googleDriveClient, never()).revokeAccess(someId, person.getEmail());
    verify(companyMemberRepository, never()).save(member);
    assertTrue(member.isGoogleDriveFolderAccess());
  }
}
