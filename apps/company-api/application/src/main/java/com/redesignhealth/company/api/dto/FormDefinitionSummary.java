package com.redesignhealth.company.api.dto;

import com.fasterxml.jackson.databind.JsonNode;
import com.redesignhealth.company.api.entity.FormDefinition;
import org.springframework.hateoas.RepresentationModel;

public class FormDefinitionSummary extends RepresentationModel<FormDefinitionSummary> {
  private SerializableEnum type;
  private JsonNode schema;

  public static FormDefinitionSummary from(FormDefinition formDefinition) {
    var summary = new FormDefinitionSummary();
    summary.type = formDefinition.getType();
    summary.schema = formDefinition.getSchema();
    return summary;
  }

  public SerializableEnum getType() {
    return type;
  }

  public JsonNode getSchema() {
    return schema;
  }
}
