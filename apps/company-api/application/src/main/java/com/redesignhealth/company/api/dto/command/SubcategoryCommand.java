package com.redesignhealth.company.api.dto.command;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SubcategoryCommand {
  @Schema(example = "Admin Tools")
  @NotBlank
  String name;

  public static SubcategoryCommand of(String name) {
    var subcategoryCommand = new SubcategoryCommand();
    subcategoryCommand.setName(name);
    return subcategoryCommand;
  }
}
