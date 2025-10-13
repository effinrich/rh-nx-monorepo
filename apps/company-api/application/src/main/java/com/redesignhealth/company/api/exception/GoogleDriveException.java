package com.redesignhealth.company.api.exception;

import com.redesignhealth.company.api.exception.status.InternalServerErrorException;

public class GoogleDriveException extends InternalServerErrorException {

  public GoogleDriveException(String message) {
    super(message);
  }

  public GoogleDriveException(Exception e) {
    super(e);
  }
}
