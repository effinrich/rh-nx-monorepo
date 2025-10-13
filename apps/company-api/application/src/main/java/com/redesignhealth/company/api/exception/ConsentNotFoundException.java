package com.redesignhealth.company.api.exception;

import com.redesignhealth.company.api.exception.status.NotFoundException;

public class ConsentNotFoundException extends NotFoundException {

  public ConsentNotFoundException() {
    super("Consent");
  }
}
