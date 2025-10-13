package com.redesignhealth.company.api.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;

@Getter
public class LibraryCommand {
  @Schema(example = "Developer Documentation")
  @NotBlank
  private String displayName;
}
