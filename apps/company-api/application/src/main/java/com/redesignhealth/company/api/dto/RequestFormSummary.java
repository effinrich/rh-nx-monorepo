package com.redesignhealth.company.api.dto;

import com.fasterxml.jackson.databind.JsonNode;
import com.redesignhealth.company.api.entity.FormDefinition;
import com.redesignhealth.company.api.entity.request.PublicationStatus;
import com.redesignhealth.company.api.entity.request.RequestForm;
import io.swagger.v3.oas.annotations.media.Schema;
import org.springframework.hateoas.RepresentationModel;

public class RequestFormSummary extends RepresentationModel<RequestFormSummary> {

  @Schema(requiredMode = Schema.RequiredMode.REQUIRED)
  private PublicationStatus status;

  private FormDefinition.Type type;
  private JsonNode form;

  public static RequestFormSummary from(RequestForm requestForm) {
    var summary = new RequestFormSummary();
    summary.form = requestForm.getForm();
    summary.type = requestForm.getType();
    summary.status = requestForm.getStatus();
    return summary;
  }

  public SerializableEnum getStatus() {
    return status;
  }

  public SerializableEnum getType() {
    return type;
  }

  public JsonNode getForm() {
    return form;
  }
}
