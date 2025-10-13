package com.redesignhealth.company.api.client.jira;

import java.util.List;
import java.util.Map;

public class CreateIssueRequest {

  private final String issuetype;
  private final String project;
  private final String summary;
  private final String description;

  private final String parentIssue;

  private final List<String> labels;

  private final Map<String, String> additionalFields;

  private CreateIssueRequest(Builder builder) {
    this.issuetype = builder.issuetype;
    this.project = builder.projectId;
    this.summary = builder.summary;
    this.description = builder.description;
    this.parentIssue = builder.parentIssue;

    // Jira labels cannot contain spaces
    this.labels =
        builder.labels != null
            ? builder.labels.stream().map((l) -> l.replace(" ", "-").toLowerCase()).toList()
            : List.of();

    this.additionalFields = builder.additionalFields;
  }

  public String getIssuetype() {
    return issuetype;
  }

  public String getProject() {
    return project;
  }

  public String getSummary() {
    return summary;
  }

  public String getDescription() {
    return description;
  }

  public String getParentIssue() {
    return parentIssue;
  }

  public List<String> getLabels() {
    return labels;
  }

  public Map<String, String> getAdditionalFields() {
    return additionalFields;
  }

  public static Builder builder() {
    return new Builder();
  }

  public static class Builder {

    private String issuetype;
    private String projectId;
    private String summary;
    private String description;
    private String parentIssue;
    private Map<String, String> additionalFields;
    private List<String> labels;

    public Builder issuetype(String issuetype) {
      this.issuetype = issuetype;
      return this;
    }

    public Builder project(String project) {
      this.projectId = project;
      return this;
    }

    public Builder summary(String summary) {
      this.summary = summary;
      return this;
    }

    public Builder description(String description) {
      this.description = description;
      return this;
    }

    public Builder parentIssue(String parentIssue) {
      this.parentIssue = parentIssue;
      return this;
    }

    public Builder additionalFields(Map<String, String> additionalFields) {
      this.additionalFields = additionalFields;
      return this;
    }

    public Builder labels(List<String> labels) {
      this.labels = labels;
      return this;
    }

    public CreateIssueRequest build() {
      return new CreateIssueRequest(this);
    }
  }
}
