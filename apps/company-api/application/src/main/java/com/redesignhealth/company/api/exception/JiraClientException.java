package com.redesignhealth.company.api.exception;

import com.redesignhealth.company.api.client.jira.ErrorCollection;
import com.redesignhealth.company.api.exception.status.BadRequestException;

public class JiraClientException extends BadRequestException {

  public JiraClientException(ErrorCollection errorCollection) {
    super(errorCollection.toString());
  }
}
