package com.redesignhealth.company.api.entity.request;

import com.redesignhealth.company.api.dto.SerializableEnum;

public enum PublicationStatus implements SerializableEnum {
  NOT_STARTED("Not Started"),
  DRAFT("Draft"),
  COMPLETED("Completed");

  private final String displayName;

  private PublicationStatus(String displayName) {
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
