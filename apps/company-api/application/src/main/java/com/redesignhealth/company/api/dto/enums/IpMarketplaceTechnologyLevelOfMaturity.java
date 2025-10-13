package com.redesignhealth.company.api.dto.enums;

import com.redesignhealth.company.api.dto.SerializableEnum;

public enum IpMarketplaceTechnologyLevelOfMaturity implements SerializableEnum {
  ANIMAL_STUDY("Animal study"),
  BENCH_TESTING("Bench testing"),
  FIRST_IN_HUMAN("First in human"),
  CLINICAL_DATA("Clinical data"),
  PROTOTYPE("Prototype"),
  TRIAL_VALIDATION_COMPLETED("Trial/Validation Completed"),
  N_A("N/A");

  private final String displayName;

  IpMarketplaceTechnologyLevelOfMaturity(String displayName) {
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
