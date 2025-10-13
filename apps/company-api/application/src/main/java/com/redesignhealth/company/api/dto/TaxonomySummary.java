package com.redesignhealth.company.api.dto;

import com.redesignhealth.company.api.taxonomy.TaxonomyTerm;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
public class TaxonomySummary implements SerializableEnum {

  @Schema(example = "CARE_DELIVERY", requiredMode = Schema.RequiredMode.REQUIRED)
  private final String value;

  @Schema(example = "Care Delivery", requiredMode = Schema.RequiredMode.REQUIRED)
  private final String displayName;

  @Schema(example = "1", requiredMode = Schema.RequiredMode.REQUIRED)
  @Getter
  private final int level;

  public static TaxonomySummary from(TaxonomyTerm taxonomyTerm) {
    return new TaxonomySummary(
        taxonomyTerm.getValue().value(), taxonomyTerm.getDisplayName(), taxonomyTerm.getLevel());
  }

  @Override
  public String getValue() {
    return value;
  }

  @Override
  public String getDisplayName() {
    return displayName;
  }
}
