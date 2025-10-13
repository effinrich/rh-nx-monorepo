package com.redesignhealth.company.api.exception;

import com.redesignhealth.company.api.exception.status.NotFoundException;

public class SubcategoryNotFoundException extends NotFoundException {
  public SubcategoryNotFoundException() {
    super("Subcategory");
  }
}
