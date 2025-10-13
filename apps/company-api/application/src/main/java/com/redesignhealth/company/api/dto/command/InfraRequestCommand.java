package com.redesignhealth.company.api.dto.command;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.redesignhealth.company.api.entity.request.RequestStatus;
import java.net.URI;

public class InfraRequestCommand {
  private RequestStatus status;
  private String jiraIssueId;
  private URI githubOrganization;
  private URI sso;

  public static Builder builder() {
    return new Builder();
  }

  public RequestStatus getStatus() {
    return status;
  }

  @JsonIgnore
  public String getJiraIssueId() {
    return jiraIssueId;
  }

  @JsonIgnore
  public URI getGithubOrganization() {
    return githubOrganization;
  }

  @JsonIgnore
  public URI getSso() {
    return sso;
  }

  public static class Builder {
    RequestStatus status;
    String jiraIssueId;
    URI githubOrganization;
    URI sso;

    public InfraRequestCommand build() {
      var command = new InfraRequestCommand();
      command.status = status;
      command.jiraIssueId = jiraIssueId;
      command.sso = sso;
      command.githubOrganization = githubOrganization;
      return command;
    }

    public Builder status(RequestStatus status) {
      this.status = status;
      return this;
    }

    public Builder jiraIssueId(String jiraIssueId) {
      this.jiraIssueId = jiraIssueId;
      return this;
    }

    public Builder githubOrganization(String githubOrganization) {
      this.githubOrganization = URI.create(githubOrganization);
      return this;
    }

    public Builder sso(String sso) {
      this.sso = URI.create(sso);
      return this;
    }
  }
}
