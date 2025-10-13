package com.redesignhealth.company.api.assembler;

import com.redesignhealth.company.api.controller.TaskController;
import com.redesignhealth.company.api.dto.TaskSummary;
import com.redesignhealth.company.api.entity.TaskHistory;
import org.springframework.hateoas.server.mvc.RepresentationModelAssemblerSupport;

public class TaskAssembler extends RepresentationModelAssemblerSupport<TaskHistory, TaskSummary> {

  public TaskAssembler() {
    super(TaskController.class, TaskSummary.class);
  }

  @Override
  public TaskSummary toModel(TaskHistory entity) {
    return TaskSummary.from(entity);
  }
}
