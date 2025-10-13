package com.redesignhealth.company.api.task;

import com.redesignhealth.company.api.entity.ExpertNote;
import com.redesignhealth.company.api.entity.ref.ExpertNoteRef;
import com.redesignhealth.company.api.repository.ExpertNoteRepository;
import com.redesignhealth.company.api.repository.TaskRepository;
import com.redesignhealth.company.api.service.helper.RefGenerator;
import jakarta.transaction.Transactional;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class UpdateApiIdInExpertNoteTask extends TaskDefinition implements CommandLineRunner {
  private final ExpertNoteRepository expertNoteRepository;

  public UpdateApiIdInExpertNoteTask(
      TaskRepository taskRepository, ExpertNoteRepository expertNoteRepository) {
    super(taskRepository);
    this.expertNoteRepository = expertNoteRepository;
  }

  @Override
  public void run(String... args) {
    runTask(shouldRunTask());
  }

  @Override
  @Transactional
  public void runTaskInternal() {
    var expertNotes = expertNoteRepository.findByApiIdIsNull();
    for (ExpertNote expertNote : expertNotes) {
      expertNote.setApiId(RefGenerator.of(expertNoteRepository, ExpertNoteRef.class));
      expertNoteRepository.save(expertNote);
    }
  }
}
