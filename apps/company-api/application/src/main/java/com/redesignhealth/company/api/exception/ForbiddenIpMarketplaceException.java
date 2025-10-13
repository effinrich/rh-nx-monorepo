package com.redesignhealth.company.api.exception;

import com.redesignhealth.company.api.exception.status.ForbiddenException;

public class ForbiddenIpMarketplaceException extends ForbiddenException {
  public ForbiddenIpMarketplaceException(String message) {
    super(message);
  }
}
