package com.redesignhealth.company.api.exception.status;

import org.springframework.http.HttpStatus;

public abstract class ConflictException extends BaseHttpException {
  public ConflictException(String conflictField) {
    super(
        HttpStatus.CONFLICT,
        String.format("%s can't be changed from its current value.", conflictField));
  }
}
