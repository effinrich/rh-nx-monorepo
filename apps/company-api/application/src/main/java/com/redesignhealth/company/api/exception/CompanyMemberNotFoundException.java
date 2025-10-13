package com.redesignhealth.company.api.exception;

import com.redesignhealth.company.api.exception.status.NotFoundException;

public class CompanyMemberNotFoundException extends NotFoundException {
  public CompanyMemberNotFoundException() {
    super("Company Member");
  }
}
