package com.redesignhealth.company.api.dto;

import lombok.Getter;

@Getter
public class CeoMemberOfSummary extends PersonReducedInfo {

  private final CompanyReducedInfo company;

  private CeoMemberOfSummary(
      String email, String givenName, String familyName, CompanyReducedInfo company) {
    super(email, givenName, familyName);
    this.company = company;
  }

  public static CeoMemberOfSummary of(
      String email, String givenName, String familyName, CompanyReducedInfo company) {
    return new CeoMemberOfSummary(email, givenName, familyName, company);
  }
}
