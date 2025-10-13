package com.redesignhealth.company.api.dto.enums;

import com.redesignhealth.company.api.dto.SerializableEnum;

public enum CeoHealthcareSector implements SerializableEnum {
  BIOPHARMA_AND_DEVICE("Biopharma & Device"),
  PEDIATRICS("Pediatrics"),
  WELLNESS_AND_PREVENTION("Wellness & Prevention"),
  BENEFITS_ENHANCEMENT("Benefits Enhancement"),
  SPECIALTY_CARE("Specialty Care"),
  CHRONIC_CARE_MANAGEMENT("Chronic Care Management"),
  ACUTE_CARE("Acute Care"),
  POST_ACUTE_CARE("Post-Acute Care"),
  HEALTHY_AGING("Healthy Aging"),
  CARE_ENABLEMENT("Care Enablement");

  private final String displayName;

  CeoHealthcareSector(String displayName) {
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
