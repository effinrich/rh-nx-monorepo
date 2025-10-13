package com.redesignhealth.company.api.dto.command;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;

public class CreatePersonCommand extends PersonCommand {
  @NotBlank
  @Schema(example = "brett.shaheen@redesignhealth.com", requiredMode = Schema.RequiredMode.REQUIRED)
  private String email;

  public String getEmail() {
    return email;
  }
}
