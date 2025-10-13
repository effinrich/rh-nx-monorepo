package com.redesignhealth.company.api.assembler;

import com.redesignhealth.company.api.controller.InfraRequestController;
import com.redesignhealth.company.api.dto.RequestFormSummary;
import com.redesignhealth.company.api.entity.request.RequestForm;
import org.springframework.hateoas.server.mvc.RepresentationModelAssemblerSupport;

public class RequestFormAssembler
    extends RepresentationModelAssemblerSupport<RequestForm, RequestFormSummary> {

  public RequestFormAssembler() {
    super(InfraRequestController.class, RequestFormSummary.class);
  }

  @Override
  public RequestFormSummary toModel(RequestForm requestForm) {
    return RequestFormSummary.from(requestForm);
  }
}
