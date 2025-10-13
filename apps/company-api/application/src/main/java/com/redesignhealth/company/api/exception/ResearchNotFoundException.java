package com.redesignhealth.company.api.exception;

import com.redesignhealth.company.api.exception.status.NotFoundException;

public class ResearchNotFoundException extends NotFoundException {

  public ResearchNotFoundException() {
    super("Research");
  }
}
