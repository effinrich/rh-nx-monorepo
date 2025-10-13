package com.redesignhealth.company.api.exception;

import com.redesignhealth.company.api.exception.status.ForbiddenException;

public class ForbiddenAddConflictsException extends ForbiddenException {
  public ForbiddenAddConflictsException(String message) {
    super(message);
  }
}
