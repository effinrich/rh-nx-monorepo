package com.redesignhealth.company.api.assembler;

import com.redesignhealth.company.api.controller.ExpertNoteController;
import com.redesignhealth.company.api.dto.ExpertNoteSummary;
import com.redesignhealth.company.api.entity.ExpertNote;
import org.springframework.hateoas.server.mvc.RepresentationModelAssemblerSupport;

public class ExpertNoteAssembler
    extends RepresentationModelAssemblerSupport<ExpertNote, ExpertNoteSummary> {
  public ExpertNoteAssembler() {
    super(ExpertNoteController.class, ExpertNoteSummary.class);
  }

  @Override
  public ExpertNoteSummary toModel(ExpertNote entity) {
    return ExpertNoteSummary.from(entity);
  }
}
