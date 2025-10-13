package com.redesignhealth.company.api.dto.enums;

import com.redesignhealth.company.api.dto.SerializableEnum;

public enum CeoCustomerSegment implements SerializableEnum {
  HEALTH_PLAN("Health plans"),
  HEALTH_SYSTEMS("Health systems"),
  PHYSICIAN_OR_PROVIDER_PRACTICES("Physician/Provider practices"),
  CONSUMER("Consumer"),
  EMPLOYER("Employer");

  private final String displayName;

  CeoCustomerSegment(String displayName) {
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
