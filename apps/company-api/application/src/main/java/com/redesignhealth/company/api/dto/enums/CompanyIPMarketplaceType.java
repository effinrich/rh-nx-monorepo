package com.redesignhealth.company.api.dto.enums;

import com.redesignhealth.company.api.dto.SerializableEnum;

public enum CompanyIPMarketplaceType implements SerializableEnum {
  ENTERPRISE_SELLER("Enterprise Seller"),
  ENTERPRISE_BUYER("Enterprise Buyer");

  private final String displayName;

  CompanyIPMarketplaceType(String displayName) {
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
