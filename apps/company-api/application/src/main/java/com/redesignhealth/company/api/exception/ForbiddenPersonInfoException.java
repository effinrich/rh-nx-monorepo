package com.redesignhealth.company.api.exception;

import com.redesignhealth.company.api.exception.status.ForbiddenException;

public class ForbiddenPersonInfoException extends ForbiddenException {
  public ForbiddenPersonInfoException(String message) {
    super(message);
  }
}
