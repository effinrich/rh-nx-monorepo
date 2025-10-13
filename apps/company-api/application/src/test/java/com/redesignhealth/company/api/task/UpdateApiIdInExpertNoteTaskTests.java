package com.redesignhealth.company.api.task;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.redesignhealth.company.api.client.search.entity.SearchResult;
import com.redesignhealth.company.api.entity.Company;
import com.redesignhealth.company.api.entity.ExpertNote;
import com.redesignhealth.company.api.entity.TaskHistory;
import com.redesignhealth.company.api.entity.ref.CompanyRef;
import com.redesignhealth.company.api.entity.ref.TaskRef;
import com.redesignhealth.company.api.repository.ExpertNoteRepository;
import com.redesignhealth.company.api.repository.TaskRepository;
import com.redesignhealth.company.api.scaffolding.Fixtures;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
public class UpdateApiIdInExpertNoteTaskTests {
  @Mock private ExpertNoteRepository expertNoteRepository;
  @Mock private TaskRepository taskRepository;
  private UpdateApiIdInExpertNoteTask task;
  TaskHistory taskHistory =
      TaskHistory.from(TaskRef.of(UpdateApiIdInExpertNoteTask.class.getName()));

  @Test
  public void Test_There_Are_ApiId_Nulls() {
    var doc = Fixtures.testExpertCallSearchDoc();
    var company = Fixtures.testCompany();
    var companyRefToAccess = Fixtures.testCompanyRef();
    Map<CompanyRef, Company> allCompanies = new HashMap<>();
    allCompanies.put(companyRefToAccess, company);
    var expertNote =
        ExpertNote.from(SearchResult.of(doc), allCompanies, true, "expert_note_api_id");
    when(expertNoteRepository.findByApiIdIsNull()).thenReturn(List.of(expertNote));
    when(taskRepository.findByName(taskHistory.getName())).thenReturn(Optional.of(taskHistory));
    task = new UpdateApiIdInExpertNoteTask(taskRepository, expertNoteRepository);
    task.run();
    assertThat(taskHistory.hasRun()).isTrue();
    verify(expertNoteRepository, times(1)).save(any(ExpertNote.class));
  }

  @Test
  public void Test_There_Are_Not_ApiId_Nulls() {
    when(expertNoteRepository.findByApiIdIsNull()).thenReturn(List.of());
    when(taskRepository.findByName(taskHistory.getName())).thenReturn(Optional.of(taskHistory));
    task = new UpdateApiIdInExpertNoteTask(taskRepository, expertNoteRepository);
    task.run();
    assertThat(taskHistory.hasRun()).isTrue();
    verify(expertNoteRepository, never()).save(any(ExpertNote.class));
  }
}
