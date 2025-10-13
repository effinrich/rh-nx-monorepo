package com.redesignhealth.company.api.client.search.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.redesignhealth.company.api.entity.Person;
import com.redesignhealth.company.api.util.EntityUtil;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class MemberDoc {
  public static final String GIVEN_NAME = "given_name";
  public static final String FAMILY_NAME = "family_name";

  public static final String COMPANY = "company";

  private String email;

  @JsonProperty(GIVEN_NAME)
  private String givenName;

  @JsonProperty(FAMILY_NAME)
  private String familyName;

  @JsonProperty(COMPANY) // not necessary , only to provide information to the service
  private CompanyDoc company;

  public static MemberDoc from(Person person) {
    var doc = MemberDoc.builder();
    doc.email(person.getEmail().getEmail());
    doc.givenName(person.getGivenName());
    doc.familyName(person.getFamilyName());
    var company = EntityUtil.getFirstActiveMembership(person);
    doc.company(CompanyDoc.from(company.orElse(null)));
    return doc.build();
  }
}
