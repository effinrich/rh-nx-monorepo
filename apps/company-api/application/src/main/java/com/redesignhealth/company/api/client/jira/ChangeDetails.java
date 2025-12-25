package com.redesignhealth.company.api.client.jira;

/**
 * Represents a single change item in a Jira changelog.
 */
public class ChangeDetails {
  private String field;
  private String fieldtype;
  private String fieldId;
  private String from;
  private String fromString;
  private String to;
  private String toString;

  public ChangeDetails() {}

  public String getField() {
    return field;
  }

  public void setField(String field) {
    this.field = field;
  }

  public String getFieldtype() {
    return fieldtype;
  }

  public void setFieldtype(String fieldtype) {
    this.fieldtype = fieldtype;
  }

  public String getFieldId() {
    return fieldId;
  }

  public void setFieldId(String fieldId) {
    this.fieldId = fieldId;
  }

  public String getFrom() {
    return from;
  }

  public void setFrom(String from) {
    this.from = from;
  }

  public String getFromString() {
    return fromString;
  }

  public void setFromString(String fromString) {
    this.fromString = fromString;
  }

  public String getTo() {
    return to;
  }

  public void setTo(String to) {
    this.to = to;
  }

  public String getToString() {
    return toString;
  }

  public void setToString(String toString) {
    this.toString = toString;
  }
}

