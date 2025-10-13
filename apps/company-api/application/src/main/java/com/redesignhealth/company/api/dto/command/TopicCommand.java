package com.redesignhealth.company.api.dto.command;

import com.redesignhealth.company.api.dto.enums.TopicType;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.Map;

public class TopicCommand {

  @Schema(
      example = "Using a NC/LC Website Builder: Squarespace",
      requiredMode = Schema.RequiredMode.REQUIRED)
  @NotBlank
  private String title;

  @Schema(
      example = "Describes how to set up your website",
      requiredMode = Schema.RequiredMode.REQUIRED)
  @NotBlank
  private String description;

  @Schema(example = "Go To Market", requiredMode = Schema.RequiredMode.REQUIRED)
  @NotBlank
  private String category;

  @Schema(requiredMode = Schema.RequiredMode.REQUIRED)
  @NotNull
  private TopicType type;

  private Map<String, Object> metadata;

  public String getTitle() {
    return title;
  }

  public String getDescription() {
    return description;
  }

  public String getCategory() {
    return category;
  }

  public Map<String, Object> getMetadata() {
    return metadata;
  }

  public TopicType getType() {
    return type;
  }
}
