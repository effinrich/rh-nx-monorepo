package com.redesignhealth.company.api.exception;

import com.redesignhealth.company.api.exception.status.ConflictException;

public class StageConflictException extends ConflictException {
  public StageConflictException() {
    super("stage");
  }
}
