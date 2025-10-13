package com.redesignhealth.company.api.dto.enums;

import com.redesignhealth.company.api.dto.SerializableEnum;

public enum CompanyIPMarketplaceRegion implements SerializableEnum {
  NORTHEAST("Northeast"),
  SOUTHEAST("Southeast"),
  MIDWEST("Midwest"),
  SOUTHWEST("Southwest"),
  WEST("West"),
  INTERNATIONAL("International");

  private final String displayName;

  CompanyIPMarketplaceRegion(String displayName) {
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
