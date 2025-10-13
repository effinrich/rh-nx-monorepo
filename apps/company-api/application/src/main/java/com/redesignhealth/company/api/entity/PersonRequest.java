package com.redesignhealth.company.api.entity;

import com.redesignhealth.company.api.entity.audit.Auditable;
import com.redesignhealth.company.api.entity.request.RequestStatus;
import com.redesignhealth.company.api.entity.request.RoleAuthority;
import jakarta.persistence.*;
import java.util.Set;

/** People can request access on behalf of others. */
@Entity
public class PersonRequest extends Auditable {

  @Id @GeneratedValue private Long id;

  private String email;
  private String givenName;
  private String familyName;

  @OneToMany(fetch = FetchType.EAGER)
  @JoinTable(
      name = "person_request_companies",
      joinColumns = @JoinColumn(name = "person_request_id"),
      inverseJoinColumns = @JoinColumn(name = "company_id"))
  private Set<Company> companies;

  @Enumerated(EnumType.STRING)
  private RoleAuthority role;

  private RequestStatus status;

  @Column(unique = true)
  private String jiraIssueId;

  // For hibernate
  @SuppressWarnings("unused")
  private PersonRequest() {}

  private PersonRequest(Builder builder) {
    this.email = builder.email;
    this.givenName = builder.givenName;
    this.familyName = builder.familyName;
    this.companies = builder.companies;
    this.role = builder.role;
    this.status = builder.status;
    this.jiraIssueId = builder.jiraIssueId;
  }

  public String getEmail() {
    return email;
  }

  public String getGivenName() {
    return givenName;
  }

  public String getFamilyName() {
    return familyName;
  }

  public Set<Company> getCompanies() {
    return companies;
  }

  public RoleAuthority getRole() {
    return role;
  }

  public RequestStatus getStatus() {
    return status;
  }

  public String getJiraIssueId() {
    return jiraIssueId;
  }

  public static Builder builder() {
    return new Builder();
  }

  public static class Builder {
    private String email;
    private String givenName;
    private String familyName;
    private Set<Company> companies;
    private RoleAuthority role;
    private String jiraIssueId;
    private RequestStatus status;

    public PersonRequest build() {
      return new PersonRequest(this);
    }

    public Builder setEmail(String email) {
      this.email = email;
      return this;
    }

    public Builder setGivenName(String givenName) {
      this.givenName = givenName;
      return this;
    }

    public Builder setFamilyName(String familyName) {
      this.familyName = familyName;
      return this;
    }

    public Builder setCompanies(Set<Company> companies) {
      this.companies = companies;
      return this;
    }

    public Builder setRole(RoleAuthority role) {
      this.role = role;
      return this;
    }

    public Builder setJiraIssueId(String jiraIssueId) {
      this.jiraIssueId = jiraIssueId;
      return this;
    }

    public Builder setStatus(RequestStatus status) {
      this.status = status;
      return this;
    }
  }
}
