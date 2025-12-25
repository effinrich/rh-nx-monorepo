package com.redesignhealth.company.api.client.jira;

import java.util.Map;

/**
 * Represents a Jira issue in webhook payloads.
 */
public class IssueBean {
  private String id;
  private String key;
  private String self;
  private Map<String, Object> fields;

  public IssueBean() {}

  public String getId() {
    return id;
  }

  public void setId(String id) {
    this.id = id;
  }

  public String getKey() {
    return key;
  }

  public void setKey(String key) {
    this.key = key;
  }

  public String getSelf() {
    return self;
  }

  public void setSelf(String self) {
    this.self = self;
  }

  public Map<String, Object> getFields() {
    return fields;
  }

  public void setFields(Map<String, Object> fields) {
    this.fields = fields;
  }
}

