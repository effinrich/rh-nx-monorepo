package com.redesignhealth.company.api.exception.status;

import org.springframework.http.HttpStatus;

public class ForbiddenException extends BaseHttpException {
  public ForbiddenException(String message) {
    super(HttpStatus.FORBIDDEN, message);
  }
}
