package com.redesignhealth.company.api.property;

import com.redesignhealth.company.api.entity.request.RequestStatus;
import java.util.Map;
import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties("jira.request")
public class JiraRequestProperties {
  private final User user;
  private final Infrastructure infrastructure;

  public JiraRequestProperties(User user, Infrastructure infrastructure) {
    this.user = user;
    this.infrastructure = infrastructure;
  }

  public User getUser() {
    return user;
  }

  public Infrastructure getInfrastructure() {
    return infrastructure;
  }

  public static class User {
    private final String project;
    private final Issue issue;

    public User(String project, Issue issue) {
      this.project = project;
      this.issue = issue;
    }

    public String getProject() {
      return project;
    }

    public Issue getIssue() {
      return issue;
    }
  }

  public static class Infrastructure {
    private final String project;
    private final Issue parentIssue;
    private final Issue childIssue;

    private final Map<String, String> statusIds;

    public Infrastructure(
        String project, Issue parentIssue, Issue childIssue, Map<String, String> statusIds) {
      this.project = project;
      this.parentIssue = parentIssue;
      this.childIssue = childIssue;
      this.statusIds = statusIds;
    }

    public String getProject() {
      return project;
    }

    public String getStatusId(RequestStatus status) {
      return statusIds.get(status.name());
    }

    public Issue getParentIssue() {
      return parentIssue;
    }

    public Issue getChildIssue() {
      return childIssue;
    }
  }

  public static class Issue {
    public static final String GITHUB_FIELD = "github";
    public static final String SSO_FIELD = "sso";
    public static final String REQUESTED_RESOURCE_TYPE_FIELD = "requestedResourceType";
    public static final String EPIC_NAME_FIELD = "epicName";

    private final String type;
    private final Map<String, String> fields;

    public Issue(String type, Map<String, String> fields) {
      this.type = type;
      this.fields = fields;
    }

    public String getType() {
      return type;
    }

    public String getFieldId(String name) {
      return fields.get(name);
    }
  }
}
