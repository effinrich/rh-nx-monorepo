package com.redesignhealth.company.api.dto.enums;

import com.fasterxml.jackson.annotation.JsonValue;
import com.redesignhealth.company.api.dto.SerializableEnum;

public enum CompanyStatus implements SerializableEnum {
  ACTIVE("Active"),
  PAUSED("Paused"),
  ARCHIVED("Archived");

  private final String displayName;

  CompanyStatus(String displayName) {
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
