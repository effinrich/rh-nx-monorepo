package com.redesignhealth.company.api.dto.enums;

import com.fasterxml.jackson.annotation.JsonValue;
import com.redesignhealth.company.api.dto.SerializableEnum;

public enum CompanyMemberStatus implements SerializableEnum {
  ACTIVE("Active"),
  INACTIVE("Inactive");

  private final String displayName;

  CompanyMemberStatus(String displayName) {
    this.displayName = displayName;
  }

  @Override
  @JsonValue
  public String getValue() {
    return this.name();
  }

  @Override
  public String getDisplayName() {
    return this.displayName;
  }
}
