package com.redesignhealth.company.api.entity.ref;

import static com.redesignhealth.company.api.controller.util.Paths.EXPERT_NOTE_ID_VARIABLE;

import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.enums.ParameterIn;
import lombok.Getter;

@Getter
public class ExpertNoteRef extends Ref {
  @Parameter(in = ParameterIn.PATH, name = EXPERT_NOTE_ID_VARIABLE)
  // Needed to resolve property for OpenAPI Definition file
  @Getter
  private final String value;

  private ExpertNoteRef(String expertNoteId) {
    this.value = expertNoteId;
  }

  public static ExpertNoteRef of(String value) {
    return new ExpertNoteRef(value);
  }

  @Override
  public String value() {
    return value;
  }
}
