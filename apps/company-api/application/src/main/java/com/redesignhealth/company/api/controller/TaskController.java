package com.redesignhealth.company.api.controller;

import com.redesignhealth.company.api.assembler.TaskAssembler;
import com.redesignhealth.company.api.dto.TaskSummary;
import com.redesignhealth.company.api.dto.command.TaskCommand;
import com.redesignhealth.company.api.entity.TaskHistory;
import com.redesignhealth.company.api.openapi.IncludeSecurityHeaders;
import com.redesignhealth.company.api.service.TaskService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.PagedModel;
import org.springframework.web.bind.annotation.*;

@RestController
@IncludeSecurityHeaders
@Tag(name = "Tasks")
@RequestMapping("/admin/task")
public class TaskController {

  private final TaskService taskService;
  private final PagedResourcesAssembler<TaskHistory> pageAssembler;
  private final TaskAssembler taskAssembler;

  public TaskController(
      TaskService taskService, PagedResourcesAssembler<TaskHistory> pageAssembler) {
    this.taskService = taskService;
    this.pageAssembler = pageAssembler;
    this.taskAssembler = new TaskAssembler();
  }

  @GetMapping
  public PagedModel<TaskSummary> getTasks(@ParameterObject Pageable pageable) {
    return pageAssembler.toModel(taskService.getTaskHistories(pageable), taskAssembler);
  }

  @PostMapping
  public TaskSummary runTask(@RequestBody TaskCommand command) {
    return taskAssembler.toModel(taskService.runTask(command.getName()));
  }
}
