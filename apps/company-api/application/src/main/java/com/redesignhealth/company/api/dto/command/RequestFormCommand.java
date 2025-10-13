package com.redesignhealth.company.api.dto.command;

import com.fasterxml.jackson.databind.JsonNode;
import com.redesignhealth.company.api.entity.request.PublicationStatus;

public class RequestFormCommand {
  public PublicationStatus status;
  public JsonNode form;

  public PublicationStatus getStatus() {
    return status;
  }

  public JsonNode getForm() {
    return form;
  }
}
