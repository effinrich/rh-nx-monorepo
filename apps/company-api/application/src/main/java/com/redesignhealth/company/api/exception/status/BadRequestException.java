package com.redesignhealth.company.api.exception.status;

import org.springframework.http.HttpStatus;

public abstract class BadRequestException extends BaseHttpException {
  public BadRequestException(String message) {
    super(HttpStatus.BAD_REQUEST, message);
  }
}
