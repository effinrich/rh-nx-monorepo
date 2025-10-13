package com.redesignhealth.company.api.dto;

import com.redesignhealth.company.api.dto.enums.CompanyMemberStatus;
import com.redesignhealth.company.api.entity.Person;
import io.swagger.v3.oas.annotations.media.Schema;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import lombok.Getter;
import org.hibernate.Hibernate;
import org.springframework.hateoas.RepresentationModel;

@Getter
public class PersonSummary extends RepresentationModel<PersonSummary> {

  @Schema(example = "sazh.katzroy@redesignhealth.com", requiredMode = Schema.RequiredMode.REQUIRED)
  private final String email;

  @Schema(example = "Sazh")
  private final String givenName;

  @Schema(example = "Katzroy")
  private final String familyName;

  private List<RoleSummary> roles;

  private RoleSummary role;

  private List<CompanySummary> memberOf;

  private final Instant created;

  private final Instant lastModified;

  private List<CompanyMemberStatus> statuses;

  private CeoReducedInfo ceoInfo;

  protected PersonSummary(Person person) {
    this.email = person.getEmail().value();
    this.givenName = person.getGivenName();
    this.familyName = person.getFamilyName();
    if (person.getRole() != null) {
      this.role = RoleSummary.from(person.getRole());
    }
    this.roles = this.role != null ? List.of(this.role) : List.of();

    if (Hibernate.isInitialized(person.getMemberOf())) {
      if (person.getMemberOf() != null) {
        this.memberOf = new ArrayList<>();
        this.statuses = new ArrayList<>();
        for (var memberOf : person.getMemberOf()) {
          this.memberOf.add(CompanySummary.from(memberOf.getCompany()));
          this.statuses.add(memberOf.getStatus());
        }
      }
    }
    this.ceoInfo =
        (person.getCeo() != null)
            ? CeoReducedInfo.of(true, person.getCeo().getApiId().value())
            : CeoReducedInfo.of(false, "");

    this.created = person.getCreated();
    this.lastModified = person.getLastModified();
  }

  public static PersonSummary from(Person person) {
    return new PersonSummary(person);
  }
}
