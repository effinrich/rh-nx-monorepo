package com.redesignhealth.company.api.entity.ref;

import com.redesignhealth.company.api.controller.util.Paths;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.enums.ParameterIn;
import lombok.Getter;

public class CategoryRef extends Ref {
  @Getter
  @Parameter(in = ParameterIn.PATH, name = Paths.CATEGORY_ID_VARIABLE)
  private final String apiId;

  // parameter name must be the same as path parameter to hydrate properly
  private CategoryRef(String categoryId) {
    this.apiId = categoryId;
  }

  public static CategoryRef of(String apiId) {
    return new CategoryRef(apiId);
  }

  @Override
  public String getColumnName() {
    return DEFAULT_REF_COLUMN_NAME;
  }

  public String value() {
    return apiId;
  }
}
