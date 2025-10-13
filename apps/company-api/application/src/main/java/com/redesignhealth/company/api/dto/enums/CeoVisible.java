package com.redesignhealth.company.api.dto.enums;

import com.redesignhealth.company.api.dto.SerializableEnum;

public enum CeoVisible implements SerializableEnum {
  OPT_IN("Opt in"),
  OPT_OUT("Opt out");

  private final String displayName;

  CeoVisible(String displayName) {
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
