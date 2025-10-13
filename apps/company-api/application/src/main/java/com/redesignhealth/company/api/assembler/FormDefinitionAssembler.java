package com.redesignhealth.company.api.assembler;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;

import com.redesignhealth.company.api.controller.FormDefinitionController;
import com.redesignhealth.company.api.dto.FormDefinitionSummary;
import com.redesignhealth.company.api.entity.FormDefinition;
import org.springframework.hateoas.Link;
import org.springframework.hateoas.server.mvc.RepresentationModelAssemblerSupport;

public class FormDefinitionAssembler
    extends RepresentationModelAssemblerSupport<FormDefinition, FormDefinitionSummary> {

  public FormDefinitionAssembler() {
    super(FormDefinitionController.class, FormDefinitionSummary.class);
  }

  @Override
  public FormDefinitionSummary toModel(FormDefinition entity) {
    return FormDefinitionSummary.from(entity).add(createSelfRel(entity.getType()));
  }

  private Link createSelfRel(FormDefinition.Type type) {
    return linkTo(this.getControllerClass()).slash(type).withSelfRel();
  }
}
