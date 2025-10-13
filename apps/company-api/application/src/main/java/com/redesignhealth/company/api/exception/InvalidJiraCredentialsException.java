package com.redesignhealth.company.api.exception;

import com.redesignhealth.company.api.exception.status.InternalServerErrorException;

public class InvalidJiraCredentialsException extends InternalServerErrorException {
  public InvalidJiraCredentialsException() {
    super("Invalid credentials, check 'jira.username' and 'jira.apiKey' properties");
  }
}
