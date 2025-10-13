package com.redesignhealth.company.api.dto;

import com.redesignhealth.company.api.entity.Category;
import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;
import lombok.Builder;
import lombok.Getter;
import org.hibernate.Hibernate;

@Getter
@Builder
public class CategorySummary {
  @Schema(example = "1KlMnh9a", requiredMode = Schema.RequiredMode.REQUIRED)
  String apiId;

  @Schema(example = "Infrastructure", requiredMode = Schema.RequiredMode.REQUIRED)
  String name;

  @Schema(
      example =
          """
  [{
  "category": {
    "apiId": "Lf0ED5AA",
    "name": "Infrastructure"
  },
  "apiId": "Zn17uxiy",
  "name": "Admin Tools"
  }]
  """)
  List<SubcategorySummary> subcategories;

  public static CategorySummary from(Category category) {
    var categorysummary =
        new CategorySummary(category.getApiId().value(), category.getName(), null);
    if (Hibernate.isInitialized(category.getSubcategories())) {
      if (category.getSubcategories() != null)
        categorysummary.subcategories =
            category.getSubcategories().stream()
                .map(x -> SubcategorySummary.from(null, x.getApiId().value(), x.getName()))
                .toList();
    }
    return categorysummary;
  }
}
