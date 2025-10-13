package com.redesignhealth.company.api.dto.enums;

import com.redesignhealth.company.api.dto.SerializableEnum;

public enum CompanyIPMarketplaceOrganizationType implements SerializableEnum {
  IDN_HEALTH_SYSTEM("IDN/Health System"),
  ACADEMIC_MEDICAL_CENTER("Academic Medical Center"),
  LIFE_SCIENCE_PHARMA("Life Science/Pharma"),
  STARTUP("Startup"),
  MEDICAL_DEVICE_COMPANY("Medical Device Company");

  private final String displayName;

  CompanyIPMarketplaceOrganizationType(String displayName) {
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
