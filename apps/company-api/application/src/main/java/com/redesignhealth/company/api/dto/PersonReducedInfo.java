package com.redesignhealth.company.api.dto;

import com.redesignhealth.company.api.entity.Person;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;

@Getter
public class PersonReducedInfo {
  @Schema(example = "sazh.katzroy@redesignhealth.com")
  private String email;

  @Schema(example = "Sazh")
  private String givenName;

  @Schema(example = "Katzroy")
  private String familyName;

  public PersonReducedInfo() {}

  protected PersonReducedInfo(String email, String givenName, String familyName) {
    this.email = email;
    this.givenName = givenName;
    this.familyName = familyName;
  }

  public static PersonReducedInfo from(Person person) {
    return of(person.getEmail().value(), person.getGivenName(), person.getFamilyName());
  }

  public static PersonReducedInfo of(String email, String givenName, String familyName) {
    var personReducedInfo = new PersonReducedInfo();
    personReducedInfo.email = email;
    personReducedInfo.givenName = givenName;
    personReducedInfo.familyName = familyName;
    return personReducedInfo;
  }

  public static PersonReducedInfo of() {
    return new PersonReducedInfo();
  }
}
