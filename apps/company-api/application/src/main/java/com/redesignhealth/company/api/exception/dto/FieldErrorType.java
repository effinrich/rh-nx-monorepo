package com.redesignhealth.company.api.exception.dto;

/** Types of errors API fields can have, with human-readable descriptions */
public enum FieldErrorType {
  UNIQUE("must be unique"),
  NOT_NULL("must not be null"),
  EXISTS("must exist"),
  INVALID_REFERENCE("must not reference itself"),
  NOT_EMPTY("must not be empty"),
  NOT_BLANK("must not be blank"),

  NOT_BELONG("Child doesn't belong to parent"),
  CONTAINS_REPORT_URL("must contain 'report_url'");

  private String description;

  private FieldErrorType(String description) {
    this.description = description;
  }

  public String getDescription() {
    return description;
  }
}
