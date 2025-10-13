package com.redesignhealth.company.api.exception;

import com.redesignhealth.company.api.exception.status.NotFoundException;

public class CeoNotFoundException extends NotFoundException {
  public CeoNotFoundException() {
    super("Ceo");
  }
}
