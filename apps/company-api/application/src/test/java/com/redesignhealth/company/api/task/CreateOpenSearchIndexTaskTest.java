package com.redesignhealth.company.api.task;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.redesignhealth.company.api.client.search.SearchClient;
import com.redesignhealth.company.api.client.search.command.SearchIndex;
import com.redesignhealth.company.api.entity.TaskHistory;
import com.redesignhealth.company.api.entity.ref.TaskRef;
import com.redesignhealth.company.api.repository.TaskRepository;
import java.io.InputStream;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
public class CreateOpenSearchIndexTaskTest {
  @Mock TaskRepository taskRepository;
  @Mock SearchClient searchClient;
  CreateOpenSearchIndexTask task;
  TaskHistory taskHistory = TaskHistory.from(TaskRef.of(CreateOpenSearchIndexTask.class.getName()));

  @Test
  void testRun_IndexDoesntExistAndTaskShouldCreateIndex() {
    when(taskRepository.findByName(taskHistory.getName())).thenReturn(Optional.of(taskHistory));
    when(searchClient.indexExists(SearchIndex.CONTENT)).thenReturn(false);

    task = new CreateOpenSearchIndexTask(taskRepository, searchClient);
    task.run();
    assertThat(taskHistory.hasRun()).isTrue();
    verify(searchClient, times(1))
        .createIndexWithMappings(eq(SearchIndex.CONTENT), any(InputStream.class));
  }

  @Test
  void testRun_SomeIndexExistsAndTaskShouldCreateSomeIndices() {
    when(taskRepository.findByName(taskHistory.getName())).thenReturn(Optional.of(taskHistory));
    when(searchClient.indexExists(SearchIndex.CONTENT)).thenReturn(true);
    task = new CreateOpenSearchIndexTask(taskRepository, searchClient);
    task.run();
    assertThat(taskHistory.hasRun()).isTrue();
    assertThat(taskHistory.getSuccess()).isTrue();

    verify(searchClient, never())
        .createIndexWithMappings(eq(SearchIndex.CONTENT), any(InputStream.class));

    verify(searchClient, times(SearchIndex.values().length - 1))
        .createIndexWithMappings(any(), any());
  }

  @Test
  void testRun_allIndexExistsAndTaskShouldNotCreateIndex() {
    when(taskRepository.findByName(taskHistory.getName())).thenReturn(Optional.of(taskHistory));
    when(searchClient.indexExists(any(SearchIndex.class))).thenReturn(true);
    task = new CreateOpenSearchIndexTask(taskRepository, searchClient);
    task.run();
    assertThat(taskHistory.hasRun()).isFalse();

    verify(searchClient, never()).createIndexWithMappings(any(), any(InputStream.class));
  }
}
