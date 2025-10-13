package com.redesignhealth.company.api.task;

import com.redesignhealth.company.api.client.search.SearchClient;
import com.redesignhealth.company.api.client.search.command.SearchIndex;
import com.redesignhealth.company.api.repository.TaskRepository;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class CreateOpenSearchIndexTask extends TaskDefinition implements CommandLineRunner {
  private final SearchClient searchClient;
  private final List<SearchIndex> indexesToCreate;

  public CreateOpenSearchIndexTask(TaskRepository taskRepository, SearchClient searchClient) {
    super(taskRepository);
    this.searchClient = searchClient;
    this.indexesToCreate = new ArrayList<>();
  }

  @Override
  public void run(String... args) {
    runTask(shouldRunTask());
  }

  @Override
  public boolean shouldRunTask() {
    indexesToCreate.addAll(
        Arrays.stream(SearchIndex.values()).filter(i -> !searchClient.indexExists(i)).toList());
    return !indexesToCreate.isEmpty();
  }

  @Override
  public void runTaskInternal() throws Exception {
    for (var index : indexesToCreate) {
      String filename = "OS-index-definition/" + index.getValue() + ".json";
      Resource indexMapping = new ClassPathResource(filename);
      searchClient.createIndexWithMappings(index, indexMapping.getInputStream());
    }
  }
}
