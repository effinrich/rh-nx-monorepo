package com.redesignhealth.company.api.dto.enums;

import com.redesignhealth.company.api.dto.SerializableEnum;

public enum IpMarketplacePatentGeographyValidity implements SerializableEnum {
  US("US"),
  EUROPE("Europe"),
  ASIA("Asia"),
  OTHER("Other");

  private final String displayName;

  IpMarketplacePatentGeographyValidity(String displayName) {
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
