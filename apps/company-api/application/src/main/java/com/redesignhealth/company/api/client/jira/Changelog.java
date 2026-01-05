package com.redesignhealth.company.api.client.jira;

import java.util.List;

/**
 * Represents the changelog in Jira webhook payloads.
 */
public class Changelog {
  private String id;
  private List<ChangeDetails> items;

  public Changelog() {}

  public String getId() {
    return id;
  }

  public void setId(String id) {
    this.id = id;
  }

  public List<ChangeDetails> getItems() {
    return items;
  }

  public void setItems(List<ChangeDetails> items) {
    this.items = items;
  }
}

