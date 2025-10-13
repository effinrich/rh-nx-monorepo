package com.redesignhealth.company.api.client.search.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.redesignhealth.company.api.entity.Company;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class CompanyDoc {
  public static final String FUNDRAISE_STATUS = "fundraise_status";
  public static final String NAME = "name";

  private String id;

  @JsonProperty(NAME) // not necessary , only to provide information to the service
  private String name;

  @JsonProperty(FUNDRAISE_STATUS)
  private String fundraiseStatus;

  public static CompanyDoc from(Company company) {
    var doc = CompanyDoc.builder();
    if (company != null) {
      doc.id(company.getApiId().getApiId());
      doc.name(company.getName());
      doc.fundraiseStatus(company.getFundraiseStatus().getDisplayName());
    }
    return doc.build();
  }
}
