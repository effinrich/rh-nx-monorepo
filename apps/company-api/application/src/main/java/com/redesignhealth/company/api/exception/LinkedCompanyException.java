package com.redesignhealth.company.api.exception;

import com.redesignhealth.company.api.exception.status.BadRequestException;

public class LinkedCompanyException extends BadRequestException {
  public LinkedCompanyException(String message) {
    super(message);
  }
}
