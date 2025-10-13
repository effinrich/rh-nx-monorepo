package com.redesignhealth.company.api.exception;

import com.redesignhealth.company.api.exception.status.NotFoundException;

public class IpMarketplaceNotFoundException extends NotFoundException {
  public IpMarketplaceNotFoundException() {
    super("IpMarketplace");
  }
}
