package com.redesignhealth.company.api.entity.ref;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.redesignhealth.company.api.entity.TaskHistory;
import io.swagger.v3.oas.annotations.media.Schema;

/** Natural key for a {@link TaskHistory} */
@Schema(type = "string", example = "com.redesignhealth.company.api.task.UpdateInfraStatusTask")
public class TaskRef extends Ref {
  private final String name;

  private TaskRef(String name) {
    this.name = name;
  }

  public static TaskRef of(String name) {
    return new TaskRef(name);
  }

  @JsonIgnore
  @Override
  public String getColumnName() {
    return "name";
  }

  @Override
  public String value() {
    return name;
  }
}
