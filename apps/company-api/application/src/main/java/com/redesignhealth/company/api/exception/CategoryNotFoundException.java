package com.redesignhealth.company.api.exception;

import com.redesignhealth.company.api.exception.status.NotFoundException;

public class CategoryNotFoundException extends NotFoundException {
  public CategoryNotFoundException() {
    super("Category");
  }
}
