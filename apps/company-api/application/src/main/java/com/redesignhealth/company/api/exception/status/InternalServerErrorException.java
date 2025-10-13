package com.redesignhealth.company.api.exception.status;

import org.springframework.http.HttpStatus;

public abstract class InternalServerErrorException extends BaseHttpException {
  public InternalServerErrorException(String message) {
    super(HttpStatus.INTERNAL_SERVER_ERROR, message);
  }

  public InternalServerErrorException(Exception e) {
    super(HttpStatus.INTERNAL_SERVER_ERROR, e);
  }
}
