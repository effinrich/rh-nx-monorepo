package com.redesignhealth.company.api.exception;

import com.redesignhealth.company.api.exception.status.BadRequestException;
import com.redesignhealth.company.api.expansion.Expansion;

public class UnsupportedExpansionException extends BadRequestException {

  public UnsupportedExpansionException(Expansion expansion) {
    super(String.format("?expand=%s is not supported for this entity", expansion.name()));
  }
}
