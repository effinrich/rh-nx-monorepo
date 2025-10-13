package com.redesignhealth.company.api.entity;

import com.redesignhealth.company.api.entity.converter.TaskRefConverter;
import com.redesignhealth.company.api.entity.ref.TaskRef;
import jakarta.persistence.*;
import java.time.Instant;

@Entity
public class TaskHistory {

  @Id @GeneratedValue private Long id;

  @Column(unique = true)
  @Convert(converter = TaskRefConverter.class)
  private TaskRef name;

  private Instant lastRun;

  private Boolean success;

  public static TaskHistory from(String name) {
    return from(TaskRef.of(name));
  }

  public static TaskHistory from(TaskRef name) {
    var task = new TaskHistory();
    task.name = name;
    return task;
  }

  public TaskRef getName() {
    return name;
  }

  public Instant getLastRun() {
    return lastRun;
  }

  public boolean hasRun() {
    return lastRun != null;
  }

  public void updateLastRun() {
    this.lastRun = Instant.now();
  }

  public Boolean getSuccess() {
    return success;
  }

  public void setSuccess(Boolean success) {
    this.success = success;
  }
}
