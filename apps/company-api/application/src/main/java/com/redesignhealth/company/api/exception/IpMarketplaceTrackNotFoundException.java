package com.redesignhealth.company.api.exception;

import com.redesignhealth.company.api.exception.status.NotFoundException;

public class IpMarketplaceTrackNotFoundException extends NotFoundException {
  public IpMarketplaceTrackNotFoundException() {
    super("IpMarketplaceTrack");
  }
}
