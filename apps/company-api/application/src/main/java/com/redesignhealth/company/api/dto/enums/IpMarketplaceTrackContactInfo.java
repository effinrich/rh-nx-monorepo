package com.redesignhealth.company.api.dto.enums;

import com.redesignhealth.company.api.dto.SerializableEnum;

public enum IpMarketplaceTrackContactInfo implements SerializableEnum {
  REQUESTED_CONTACT_INFO("Requested contact info"),
  RELEASED_CONTACT_INFO("Released contact info");

  private final String displayName;

  IpMarketplaceTrackContactInfo(String displayName) {
    this.displayName = displayName;
  }

  @Override
  public String getValue() {
    return this.name();
  }

  @Override
  public String getDisplayName() {
    return this.displayName;
  }
}
