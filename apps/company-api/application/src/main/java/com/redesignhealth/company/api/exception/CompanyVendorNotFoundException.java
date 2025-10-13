package com.redesignhealth.company.api.exception;

import com.redesignhealth.company.api.exception.status.NotFoundException;

public class CompanyVendorNotFoundException extends NotFoundException {
  public CompanyVendorNotFoundException() {
    super("Company Vendor");
  }
}
