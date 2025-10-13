package com.redesignhealth.company.api.exception;

import com.redesignhealth.company.api.exception.status.NotFoundException;

public class LibraryNotFoundException extends NotFoundException {
  public LibraryNotFoundException() {
    super("Library");
  }
}
