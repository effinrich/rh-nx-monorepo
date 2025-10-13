package com.redesignhealth.company.api.dto.command;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.redesignhealth.company.api.dto.LinkRef;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import java.util.List;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ResearchCommand {
  public static final String COMPANY_ID_FIELD = "companyId";
  public static final String AUTHORS_FIELD = "authors";
  public static final String SUPPORTING_FILES_FIELD = "supportingFiles";

  @Schema(example = "Shinra User Research", requiredMode = Schema.RequiredMode.REQUIRED)
  @NotBlank
  private String title;

  @Schema(
      example = "[\"terra.branford@redesignhealth.com\"]",
      requiredMode = Schema.RequiredMode.REQUIRED)
  @JsonProperty(AUTHORS_FIELD)
  @NotEmpty
  private List<@NotBlank String> authors;

  @Schema(example = "6aBCde12", requiredMode = Schema.RequiredMode.REQUIRED)
  @JsonProperty(COMPANY_ID_FIELD)
  @NotBlank
  private String companyId;

  @Schema(example = "Free Form Text", requiredMode = Schema.RequiredMode.REQUIRED)
  @NotBlank
  private String objectives;

  @Schema(example = "[\"Concept Test\"]", requiredMode = Schema.RequiredMode.REQUIRED)
  @NotEmpty
  private List<@NotBlank String> services;

  @Schema(example = "[\"Government\"]", requiredMode = Schema.RequiredMode.REQUIRED)
  @NotEmpty
  private List<@NotBlank String> segments;

  @Schema(example = "[\"Survey\"]", requiredMode = Schema.RequiredMode.REQUIRED)
  @NotEmpty
  private List<@NotBlank String> methods;

  @Schema(example = "[{ \"href\": \"https://example.com\", \"name\": \"report_url\" }]")
  @JsonProperty(SUPPORTING_FILES_FIELD)
  @NotEmpty
  private List<LinkRef> supportingFiles;

  @Schema(example = "100")
  private Long sampleSize;

  @Schema(example = "In-house")
  private String teamRole;

  @Schema(example = "[\"GenZ\"]")
  private List<String> additionalSegments;

  @Schema(example = "[\"Q-sort Exercise\"]")
  private List<String> specializedMethods;
}
