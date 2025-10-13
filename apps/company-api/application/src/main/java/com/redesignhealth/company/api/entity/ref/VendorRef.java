package com.redesignhealth.company.api.entity.ref;

import com.redesignhealth.company.api.controller.util.Paths;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.enums.ParameterIn;

public class VendorRef extends Ref {
  @Parameter(in = ParameterIn.PATH, name = Paths.VENDOR_ID_PATH_VARIABLE)
  private final String apiId;

  // parameter name must be the same as path parameter to hydrate properly
  private VendorRef(String vendorId) {
    this.apiId = vendorId;
  }

  public static VendorRef of(String apiId) {
    return new VendorRef(apiId);
  }

  @Override
  public String getColumnName() {
    return DEFAULT_REF_COLUMN_NAME;
  }

  public String value() {
    return apiId;
  }

  // Needed to resolve property for OpenAPI Definition file
  public String getApiId() {
    return apiId;
  }
}
