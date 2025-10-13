package com.redesignhealth.company.api.exception;

import com.redesignhealth.company.api.exception.status.NotFoundException;

public class TaskNotFoundException extends NotFoundException {
  public TaskNotFoundException() {
    super("Task");
  }
}
