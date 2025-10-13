package com.redesignhealth.company.api.task;

import com.redesignhealth.company.api.entity.TaskHistory;
import com.redesignhealth.company.api.entity.ref.TaskRef;
import com.redesignhealth.company.api.repository.TaskRepository;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/** Helper for running background tasks */
public abstract class TaskDefinition {

  private static final Logger logger = LoggerFactory.getLogger(TaskDefinition.class);
  private final TaskRepository taskRepository;

  public TaskDefinition(TaskRepository taskRepository) {
    this.taskRepository = taskRepository;
  }

  protected TaskRef getTaskName() {
    return TaskRef.of(this.getClass().getName());
  }

  protected abstract void runTaskInternal() throws Exception;

  public void forceRunTask() {
    runTask(true);
  }

  @Transactional
  protected void runTask(boolean shouldRun) {
    if (shouldRun) {
      logger.debug("Starting task {}", getTaskName());
      var task = taskRepository.findByName(getTaskName()).orElse(TaskHistory.from(getTaskName()));
      try {
        runTaskInternal();
        task.setSuccess(true);
        logger.debug("Completed task {}", getTaskName());
      } catch (Exception e) {
        task.setSuccess(false);
        logger.error("Issue running task " + getTaskName(), e);
      } finally {
        task.updateLastRun();
        taskRepository.save(task);
      }
    } else {
      logger.debug("Task {} skipped", getTaskName());
    }
  }

  public boolean shouldRunTask() {
    return !hasTaskRan();
  }

  protected boolean hasTaskRan() {
    var task = taskRepository.findByName(getTaskName()).orElse(TaskHistory.from(getTaskName()));
    return task.hasRun();
  }
}
