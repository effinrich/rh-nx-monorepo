package com.redesignhealth.company.api.entity.request;

import com.redesignhealth.company.api.entity.Company;
import com.redesignhealth.company.api.entity.FormDefinition;
import com.redesignhealth.company.api.entity.audit.Auditable;
import jakarta.persistence.*;
import java.util.HashSet;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;

@Entity
public class InfrastructureRequest extends Auditable {

  @Id @GeneratedValue private Long id;

  @OneToOne private Company company;

  @OneToMany(mappedBy = "infrastructureRequest")
  private Set<RequestForm> forms;

  @Column(unique = true)
  private String jiraIssueId;

  @Enumerated(EnumType.STRING)
  private RequestStatus status;

  private InfrastructureRequest() {
    this.status = RequestStatus.AWAITING_SUBMISSION;
    this.forms = new HashSet<>();
  }

  public Company getCompany() {
    return company;
  }

  public Set<RequestForm> getForms() {
    return forms;
  }

  public String getJiraIssueId() {
    return jiraIssueId;
  }

  public RequestStatus getStatus() {
    return status;
  }

  public void setJiraIssueId(String jiraIssueId) {
    this.jiraIssueId = jiraIssueId;
  }

  public static Builder builder(Company company) {
    return new Builder(company);
  }

  public void setStatus(RequestStatus status) {
    this.status = status;
  }

  public void setForms(Set<RequestForm> forms) {
    this.forms = forms;
  }

  public Optional<RequestForm> getForm(FormDefinition.Type type) {
    return forms.stream().filter((f) -> f.getType() == type).findFirst();
  }

  public static class Builder {

    private final Company company;
    private RequestStatus status;
    private String jiraIssueId;

    public Builder(Company company) {
      this.company = company;
      this.status = RequestStatus.AWAITING_SUBMISSION;
    }

    public InfrastructureRequest build() {
      var request = new InfrastructureRequest();
      request.company = company;
      request.jiraIssueId = jiraIssueId;
      request.status = status;
      return request;
    }

    public Builder jiraIssueId(String jiraIssueId) {
      this.jiraIssueId = jiraIssueId;
      return this;
    }

    public Builder status(RequestStatus status) {
      this.status = status;
      return this;
    }
  }

  @Override
  public int hashCode() {
    return Objects.hash(jiraIssueId, company);
  }

  @Override
  public boolean equals(Object obj) {
    if (this == obj) return true;
    if (obj == null) return false;
    if (getClass() != obj.getClass()) return false;
    InfrastructureRequest other = (InfrastructureRequest) obj;
    return Objects.equals(jiraIssueId, other.jiraIssueId) && Objects.equals(company, other.company);
  }
}
