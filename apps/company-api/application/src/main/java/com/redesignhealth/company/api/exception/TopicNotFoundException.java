package com.redesignhealth.company.api.exception;

import com.redesignhealth.company.api.exception.status.NotFoundException;

public class TopicNotFoundException extends NotFoundException {

  public TopicNotFoundException() {
    super("Topic");
  }
}
