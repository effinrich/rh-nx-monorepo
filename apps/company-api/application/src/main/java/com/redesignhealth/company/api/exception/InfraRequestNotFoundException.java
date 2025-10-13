package com.redesignhealth.company.api.exception;

import com.redesignhealth.company.api.exception.status.NotFoundException;

public class InfraRequestNotFoundException extends NotFoundException {
  public InfraRequestNotFoundException() {
    super("Infra request");
  }
}
