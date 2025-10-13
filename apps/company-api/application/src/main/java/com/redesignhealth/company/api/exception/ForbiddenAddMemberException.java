package com.redesignhealth.company.api.exception;

import com.redesignhealth.company.api.exception.status.ForbiddenException;

public class ForbiddenAddMemberException extends ForbiddenException {
  public ForbiddenAddMemberException(String message) {
    super(message);
  }
}
