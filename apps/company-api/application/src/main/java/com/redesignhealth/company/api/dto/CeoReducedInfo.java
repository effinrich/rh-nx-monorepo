package com.redesignhealth.company.api.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;

@Getter
public class CeoReducedInfo {
  @Schema(example = "true")
  private boolean isCeo;

  @Schema(example = "6nuT80li")
  private String id;

  private CeoReducedInfo(boolean isCeo, String id) {
    this.isCeo = isCeo;
    this.id = id;
  }

  public static CeoReducedInfo of(boolean isCeo, String id) {
    return new CeoReducedInfo(isCeo, id);
  }
}
