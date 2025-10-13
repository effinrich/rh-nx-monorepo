package com.redesignhealth.company.api.entity.ref;

import com.redesignhealth.company.api.controller.util.Paths;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.enums.ParameterIn;
import lombok.Getter;

public class IpMarketplaceTrackRef extends Ref {
  @Getter
  @Parameter(in = ParameterIn.PATH, name = Paths.IP_MARKETPLACE_TRACK_ID_VARIABLE)
  private final String apiId;

  private IpMarketplaceTrackRef(String ipMarketplaceTrackId) {
    this.apiId = ipMarketplaceTrackId;
  }

  public static IpMarketplaceTrackRef of(String apiId) {
    return new IpMarketplaceTrackRef(apiId);
  }

  @Override
  public String getColumnName() {
    return DEFAULT_REF_COLUMN_NAME;
  }

  public String value() {
    return apiId;
  }
}
