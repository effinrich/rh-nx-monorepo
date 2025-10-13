package com.redesignhealth.company.api.exception;

import com.redesignhealth.company.api.exception.status.ForbiddenException;

public class ForbiddenEditCeoInfoException extends ForbiddenException {
  public ForbiddenEditCeoInfoException(String message) {
    super(message);
  }
}
