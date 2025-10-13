package com.redesignhealth.company.api.dto.command;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;

@Getter
public class CeoCreateCommand extends CeoBaseCommand {
  @Schema(example = "rh@redesignhealth.com", requiredMode = Schema.RequiredMode.REQUIRED)
  private String email;
}
