package com.redesignhealth.company.api.dto;

import com.redesignhealth.company.api.entity.PersonRequest;
import com.redesignhealth.company.api.entity.request.RequestStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;
import org.springframework.hateoas.RepresentationModel;

public class PersonRequestSummary extends RepresentationModel<PersonRequestSummary> {
  @Schema(example = "Sazh")
  private String givenName;

  @Schema(example = "Katzroy")
  private String familyName;

  @Schema(example = "sazh.katzroy@redesignhealth.com", requiredMode = Schema.RequiredMode.REQUIRED)
  private String email;

  @Schema(example = "TICKET-1")
  private String jiraIssueId;

  private List<CompanySummary> companies;
  private List<RoleSummary> roles;
  private RequestStatus status;

  public static PersonRequestSummary from(PersonRequest personRequest) {
    var summary = new PersonRequestSummary();
    summary.status = personRequest.getStatus();
    summary.jiraIssueId = personRequest.getJiraIssueId();
    summary.email = personRequest.getEmail();
    summary.givenName = personRequest.getGivenName();
    summary.familyName = personRequest.getFamilyName();

    if (null != personRequest.getRole()) {
      summary.roles = List.of(RoleSummary.from(personRequest.getRole()));
    }
    if (null != personRequest.getCompanies()) {
      summary.companies = personRequest.getCompanies().stream().map(CompanySummary::from).toList();
    }
    return summary;
  }

  public String getGivenName() {
    return givenName;
  }

  public String getFamilyName() {
    return familyName;
  }

  public String getEmail() {
    return email;
  }

  public List<CompanySummary> getCompanies() {
    return companies;
  }

  public List<RoleSummary> getRoles() {
    return roles;
  }

  public SerializableEnum getStatus() {
    return status;
  }

  public String getJiraIssueId() {
    return jiraIssueId;
  }
}
