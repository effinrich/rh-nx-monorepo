package com.redesignhealth.company.api.exception;

import com.redesignhealth.company.api.exception.status.NotFoundException;

public class VendorNotFoundException extends NotFoundException {
  public VendorNotFoundException() {
    super("Vendor");
  }
}
