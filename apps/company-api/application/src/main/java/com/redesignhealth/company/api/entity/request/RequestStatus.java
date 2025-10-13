package com.redesignhealth.company.api.entity.request;

import com.redesignhealth.company.api.dto.SerializableEnum;

public enum RequestStatus implements SerializableEnum {
  AWAITING_SUBMISSION("Awaiting submission"),
  PENDING("Pending"),
  DONE("Done"),
  IN_PROGRESS("In progress");

  private final String displayName;

  private RequestStatus(String displayName) {
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
