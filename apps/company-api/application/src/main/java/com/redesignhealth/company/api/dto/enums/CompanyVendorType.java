package com.redesignhealth.company.api.dto.enums;

import com.redesignhealth.company.api.dto.SerializableEnum;

public enum CompanyVendorType implements SerializableEnum {
  VENDOR("Vendor"),
  AGENCY("Agency"),
  CONTRACTOR("Contractor");

  private final String displayName;

  CompanyVendorType(String displayName) {
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
