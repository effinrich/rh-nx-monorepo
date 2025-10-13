package com.redesignhealth.company.api.dto;

import lombok.Getter;

public class VendorPersonReducedInfo extends PersonReducedInfo {
  @Getter private Boolean willingToDiscuss;

  private VendorPersonReducedInfo(
      String email, String givenName, String familyName, Boolean willingToDiscuss) {
    super(email, givenName, familyName);
    this.willingToDiscuss = willingToDiscuss;
  }

  private VendorPersonReducedInfo() {
    super();
    this.willingToDiscuss = null;
  }

  public static VendorPersonReducedInfo of(
      String email, String givenName, String familyName, Boolean willingToDiscuss) {
    return new VendorPersonReducedInfo(email, givenName, familyName, willingToDiscuss);
  }

  public static VendorPersonReducedInfo of() {
    return new VendorPersonReducedInfo();
  }
}
