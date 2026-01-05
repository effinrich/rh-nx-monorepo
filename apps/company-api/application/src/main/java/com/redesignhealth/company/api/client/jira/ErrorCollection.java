package com.redesignhealth.company.api.client.jira;

import java.util.List;
import java.util.Map;

/**
 * Represents error information returned from Jira API.
 */
public class ErrorCollection {
  private List<String> errorMessages;
  private Map<String, String> errors;
  private Integer status;

  public ErrorCollection() {}

  public List<String> getErrorMessages() {
    return errorMessages;
  }

  public void setErrorMessages(List<String> errorMessages) {
    this.errorMessages = errorMessages;
  }

  public Map<String, String> getErrors() {
    return errors;
  }

  public void setErrors(Map<String, String> errors) {
    this.errors = errors;
  }

  public Integer getStatus() {
    return status;
  }

  public void setStatus(Integer status) {
    this.status = status;
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("ErrorCollection{");
    if (errorMessages != null && !errorMessages.isEmpty()) {
      sb.append("errorMessages=").append(errorMessages);
    }
    if (errors != null && !errors.isEmpty()) {
      if (sb.length() > 16) sb.append(", ");
      sb.append("errors=").append(errors);
    }
    if (status != null) {
      if (sb.length() > 16) sb.append(", ");
      sb.append("status=").append(status);
    }
    sb.append("}");
    return sb.toString();
  }
}

