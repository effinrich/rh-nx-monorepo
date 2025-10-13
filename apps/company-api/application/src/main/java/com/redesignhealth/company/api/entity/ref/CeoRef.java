package com.redesignhealth.company.api.entity.ref;

import com.redesignhealth.company.api.controller.util.Paths;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.enums.ParameterIn;
import lombok.Getter;

public class CeoRef extends Ref {
  @Getter
  @Parameter(in = ParameterIn.PATH, name = Paths.CEO_ID_VARIABLE)
  private final String apiId;

  // parameter name must be the same as path parameter to hydrate properly
  private CeoRef(String ceoId) {
    this.apiId = ceoId;
  }

  public static CeoRef of(String apiId) {
    return new CeoRef(apiId);
  }

  @Override
  public String getColumnName() {
    return DEFAULT_REF_COLUMN_NAME;
  }

  public String value() {
    return apiId;
  }
}
