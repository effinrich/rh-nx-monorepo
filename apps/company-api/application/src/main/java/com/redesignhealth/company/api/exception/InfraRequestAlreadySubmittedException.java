package com.redesignhealth.company.api.exception;

import com.redesignhealth.company.api.exception.status.BadRequestException;

public class InfraRequestAlreadySubmittedException extends BadRequestException {
  public InfraRequestAlreadySubmittedException() {
    super("Infrastructure request already submitted");
  }
}
