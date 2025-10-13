package com.redesignhealth.company.api.dto.enums;

import com.redesignhealth.company.api.dto.SerializableEnum;

public enum IpMarketplaceTechnologyType implements SerializableEnum {
  MEDICAL_DEVICES("Medical Devices"),
  DIAGNOSTIC_TOOLS("Diagnostic Tools"),
  SOFTWARE_APPLICATIONS("Software Applications"),
  ALGORITHMS_AND_ANALYTICS("Algorithms and Analytics"),
  CLINICAL_CARE_MODELS("Clinical Care Models"),
  WEARABLE_AND_REMOTE_MONITORING_DEVICES("Wearable and Remote Monitoring Devices"),
  HEALTH_INFORMATION_SYSTEMS("Health Information Systems"),
  OTHER("Other");

  private final String displayName;

  IpMarketplaceTechnologyType(String displayName) {
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
