package com.redesignhealth.company.api.exception;

import com.redesignhealth.company.api.exception.status.InternalServerErrorException;

public class RemoteUploadException extends InternalServerErrorException {
  public RemoteUploadException(Exception e) {
    super(e);
  }
}
