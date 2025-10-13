package com.redesignhealth.company.api.dto.enums;

import com.redesignhealth.company.api.dto.SerializableEnum;

public enum IpMarketplaceFreedomToOperateCertification implements SerializableEnum {
  YES("Yes"),
  NO("No"),
  PENDING("Pending");

  private final String displayName;

  IpMarketplaceFreedomToOperateCertification(String displayName) {
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
