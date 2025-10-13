package com.redesignhealth.company.api.dto.enums;

import com.redesignhealth.company.api.dto.SerializableEnum;

public enum CompanyFundraiseStatus implements SerializableEnum {
  PRE_LAUNCH_PHASE("Pre launch phase"),
  PRE_SERIES_A("Pre Series A"),
  SERIES_A("Series A"),
  SERIES_B("Series B"),
  SERIES_C("Series C");

  private final String displayName;

  CompanyFundraiseStatus(String displayName) {
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
