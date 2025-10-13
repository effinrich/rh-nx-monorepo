package com.redesignhealth.company.api.dto.command;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;

@Getter
public class CategoryCommand {
  @Schema(example = "Infrastructure")
  @NotBlank
  String name;

  public static CategoryCommand of(String name) {
    var categoryCommand = new CategoryCommand();
    categoryCommand.name = name;
    return categoryCommand;
  }
}
