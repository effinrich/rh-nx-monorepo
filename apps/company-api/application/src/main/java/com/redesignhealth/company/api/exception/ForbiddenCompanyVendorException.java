package com.redesignhealth.company.api.exception;

import com.redesignhealth.company.api.exception.status.ForbiddenException;

public class ForbiddenCompanyVendorException extends ForbiddenException {
  public ForbiddenCompanyVendorException(String message) {
    super(message);
  }
}
