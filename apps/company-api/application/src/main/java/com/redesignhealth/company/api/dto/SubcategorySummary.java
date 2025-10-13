package com.redesignhealth.company.api.dto;

import com.redesignhealth.company.api.entity.Subcategory;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

@Getter
public class SubcategorySummary {
  CategorySummary category;

  @Schema(example = "1KlMnh9a", requiredMode = Schema.RequiredMode.REQUIRED)
  String apiId;

  @Schema(example = "CI/CD", requiredMode = Schema.RequiredMode.REQUIRED)
  @Setter
  String name;

  private SubcategorySummary() {}

  public static SubcategorySummary from(CategorySummary category, String apiId, String name) {
    var subcategorySummary = new SubcategorySummary();
    subcategorySummary.apiId = apiId;
    subcategorySummary.name = name;
    subcategorySummary.category = category;
    return subcategorySummary;
  }

  public static SubcategorySummary from(Subcategory subcategory) {
    return from(
        CategorySummary.from(subcategory.getCategory()),
        subcategory.getApiId().value(),
        subcategory.getName());
  }
}
