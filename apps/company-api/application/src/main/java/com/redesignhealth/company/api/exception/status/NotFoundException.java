package com.redesignhealth.company.api.exception.status;

import org.springframework.http.HttpStatus;

public abstract class NotFoundException extends BaseHttpException {
  public NotFoundException(String entityName) {
    super(HttpStatus.NOT_FOUND, String.format("%s does not exist.", entityName));
  }
}
