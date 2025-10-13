package com.redesignhealth.company.api.exception;

import com.redesignhealth.company.api.exception.status.NotFoundException;

public class PersonNotFoundException extends NotFoundException {
  public PersonNotFoundException() {
    super("Person");
  }
}
