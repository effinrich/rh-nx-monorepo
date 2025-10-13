package com.redesignhealth.company.api.dto.command.ipMarketplace;

import com.redesignhealth.company.api.dto.PersonReducedInfo;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;

@Getter
public class MarketplaceUserInfo extends PersonReducedInfo {
  @Schema(example = "Ever/Body")
  private String companyName;

  private MarketplaceUserInfo(
      String email, String givenName, String familyName, String companyName) {
    super(email, givenName, familyName);
    this.companyName = companyName;
  }

  public static MarketplaceUserInfo of(
      String email, String givenName, String familyName, String companyName) {
    return new MarketplaceUserInfo(email, givenName, familyName, companyName);
  }
}
