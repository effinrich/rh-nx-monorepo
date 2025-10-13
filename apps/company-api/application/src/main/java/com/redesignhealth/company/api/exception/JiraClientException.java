package com.redesignhealth.company.api.exception;

import com.redesignhealth.company.api.exception.status.BadRequestException;
import com.redesignhealth.jira.rest.client.model.ErrorCollection;

public class JiraClientException extends BadRequestException {

  public JiraClientException(ErrorCollection errorCollection) {
    super(errorCollection.toString());
  }
}
