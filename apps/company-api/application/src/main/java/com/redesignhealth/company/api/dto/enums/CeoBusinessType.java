package com.redesignhealth.company.api.dto.enums;

import com.redesignhealth.company.api.dto.SerializableEnum;

public enum CeoBusinessType implements SerializableEnum {
  B2B("B2B"),
  B2B2C("B2B2C"),
  D2C("D2C");

  private final String displayName;

  CeoBusinessType(String displayName) {
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
