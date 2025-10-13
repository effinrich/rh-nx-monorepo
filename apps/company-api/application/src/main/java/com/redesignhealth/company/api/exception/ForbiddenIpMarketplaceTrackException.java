package com.redesignhealth.company.api.exception;

import com.redesignhealth.company.api.exception.status.ForbiddenException;

public class ForbiddenIpMarketplaceTrackException extends ForbiddenException {
  public ForbiddenIpMarketplaceTrackException(String message) {
    super(message);
  }
}
