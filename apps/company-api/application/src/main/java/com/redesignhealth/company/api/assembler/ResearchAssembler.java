package com.redesignhealth.company.api.assembler;

import com.redesignhealth.company.api.controller.ResearchController;
import com.redesignhealth.company.api.dto.ResearchSummary;
import com.redesignhealth.company.api.entity.research.Research;
import org.springframework.hateoas.server.mvc.RepresentationModelAssemblerSupport;

public class ResearchAssembler
    extends RepresentationModelAssemblerSupport<Research, ResearchSummary> {
  public ResearchAssembler() {
    super(ResearchController.class, ResearchSummary.class);
  }

  @Override
  public ResearchSummary toModel(Research entity) {
    return ResearchSummary.from(entity);
  }
}
