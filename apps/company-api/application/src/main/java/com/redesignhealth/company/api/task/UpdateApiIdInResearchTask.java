package com.redesignhealth.company.api.task;

import com.redesignhealth.company.api.entity.ref.ResearchRef;
import com.redesignhealth.company.api.repository.ResearchRepository;
import com.redesignhealth.company.api.repository.TaskRepository;
import com.redesignhealth.company.api.service.helper.RefGenerator;
import jakarta.transaction.Transactional;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class UpdateApiIdInResearchTask extends TaskDefinition implements CommandLineRunner {
  private final ResearchRepository researchRepository;

  public UpdateApiIdInResearchTask(
      TaskRepository taskRepository, ResearchRepository researchRepository) {
    super(taskRepository);
    this.researchRepository = researchRepository;
  }

  @Override
  public void run(String... args) {
    runTask(shouldRunTask());
  }

  @Override
  @Transactional
  public void runTaskInternal() {
    var research = researchRepository.findByApiIdIsNull();
    for (var document : research) {
      document.setApiId(RefGenerator.of(researchRepository, ResearchRef.class));
    }
    researchRepository.saveAll(research);
  }
}
