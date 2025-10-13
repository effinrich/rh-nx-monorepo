package com.redesignhealth.company.api.exception;

import com.redesignhealth.company.api.exception.status.NotFoundException;

public class CompanyNotFoundException extends NotFoundException {
  public CompanyNotFoundException() {
    super("Company");
  }
}
