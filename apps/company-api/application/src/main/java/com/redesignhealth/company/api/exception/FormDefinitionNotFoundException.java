package com.redesignhealth.company.api.exception;

import com.redesignhealth.company.api.exception.status.NotFoundException;

public class FormDefinitionNotFoundException extends NotFoundException {
  public FormDefinitionNotFoundException() {
    super("Form definition");
  }
}
