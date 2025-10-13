package com.redesignhealth.company.api.exception;

import com.redesignhealth.company.api.exception.status.InternalServerErrorException;

public class SearchServerException extends InternalServerErrorException {
  public SearchServerException(Exception e) {
    super(e);
  }
}
