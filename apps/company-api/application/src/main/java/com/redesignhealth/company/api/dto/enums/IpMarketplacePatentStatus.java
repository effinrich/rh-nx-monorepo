package com.redesignhealth.company.api.dto.enums;

import com.redesignhealth.company.api.dto.SerializableEnum;

public enum IpMarketplacePatentStatus implements SerializableEnum {
  PATENTED("Patented"),
  NON_PATENTED("Non-Patented"),
  PENDING("Pending"),
  PROVISIONAL("Provisional"),
  OTHER("Other");

  private final String displayName;

  IpMarketplacePatentStatus(String displayName) {
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
