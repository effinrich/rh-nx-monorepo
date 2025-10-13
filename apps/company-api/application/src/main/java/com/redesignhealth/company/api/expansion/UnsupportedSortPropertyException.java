package com.redesignhealth.company.api.expansion;

import com.redesignhealth.company.api.exception.status.BadRequestException;

public class UnsupportedSortPropertyException extends BadRequestException {
  public UnsupportedSortPropertyException(String property) {
    super(String.format("Cannot sort by property %s", property));
  }
}
