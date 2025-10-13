package com.redesignhealth.company.api.entity.ref;

import com.redesignhealth.company.api.controller.util.Paths;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.enums.ParameterIn;
import lombok.Getter;

@Getter
public class ResearchRef extends Ref {

  @Parameter(in = ParameterIn.PATH, name = Paths.RESEARCH_ID_VARIABLE)
  private final String value;

  private ResearchRef(String researchId) {
    this.value = researchId;
  }

  public static ResearchRef of(String value) {
    return new ResearchRef(value);
  }

  @Override
  public String value() {
    return value;
  }

  // Needed to resolve property for OpenAPI Definition file
  public String getValue() {
    return value;
  }
}
