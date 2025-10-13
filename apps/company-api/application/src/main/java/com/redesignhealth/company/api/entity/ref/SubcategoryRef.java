package com.redesignhealth.company.api.entity.ref;

import com.redesignhealth.company.api.controller.util.Paths;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.enums.ParameterIn;
import lombok.Getter;

public class SubcategoryRef extends Ref {
  @Getter
  @Parameter(in = ParameterIn.PATH, name = Paths.SUB_CATEGORY_ID_VARIABLE)
  private final String apiId;

  private SubcategoryRef(String subcategoryId) {
    this.apiId = subcategoryId;
  }

  public static SubcategoryRef of(String apiId) {
    return new SubcategoryRef(apiId);
  }

  @Override
  public String getColumnName() {
    return DEFAULT_REF_COLUMN_NAME;
  }

  public String value() {
    return apiId;
  }
}
