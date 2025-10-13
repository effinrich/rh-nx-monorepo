package com.redesignhealth.company.api.exception;

import com.redesignhealth.company.api.exception.status.ForbiddenException;

public class ForbiddenDeleteCompanyException extends ForbiddenException {
  public ForbiddenDeleteCompanyException(String message) {
    super(message);
  }
}
