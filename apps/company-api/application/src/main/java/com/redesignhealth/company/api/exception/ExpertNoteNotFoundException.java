package com.redesignhealth.company.api.exception;

import com.redesignhealth.company.api.exception.status.NotFoundException;

public class ExpertNoteNotFoundException extends NotFoundException {
  public ExpertNoteNotFoundException() {
    super("Expert Note");
  }
}
