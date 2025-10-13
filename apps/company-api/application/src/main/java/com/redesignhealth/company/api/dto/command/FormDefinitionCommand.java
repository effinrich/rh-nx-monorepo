package com.redesignhealth.company.api.dto.command;

import com.fasterxml.jackson.databind.JsonNode;

public class FormDefinitionCommand {
  public JsonNode schema;

  public JsonNode getSchema() {
    return schema;
  }
}
