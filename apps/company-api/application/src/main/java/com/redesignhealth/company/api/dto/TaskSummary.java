package com.redesignhealth.company.api.dto;

import com.redesignhealth.company.api.entity.TaskHistory;
import io.swagger.v3.oas.annotations.media.Schema;
import java.time.Instant;
import org.springframework.hateoas.RepresentationModel;

public class TaskSummary extends RepresentationModel<TaskSummary> {

  @Schema(example = "MyTaskName", requiredMode = Schema.RequiredMode.REQUIRED)
  public String name;

  public Instant lastRun;

  public Boolean success;

  public static TaskSummary from(TaskHistory taskHistory) {
    var summary = new TaskSummary();
    summary.name = taskHistory.getName().value();
    summary.lastRun = taskHistory.getLastRun();
    summary.success = taskHistory.getSuccess();
    return summary;
  }

  public String getName() {
    return name;
  }

  public Instant getLastRun() {
    return lastRun;
  }

  public Boolean getSuccess() {
    return success;
  }
}
