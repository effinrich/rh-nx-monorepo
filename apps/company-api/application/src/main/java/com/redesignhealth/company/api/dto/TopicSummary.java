package com.redesignhealth.company.api.dto;

import com.redesignhealth.company.api.document.Topic;
import io.swagger.v3.oas.annotations.media.Schema;
import java.util.Map;
import org.springframework.hateoas.RepresentationModel;

/**
 * @see Topic
 */
public class TopicSummary extends RepresentationModel<TopicSummary> {

  @Schema(requiredMode = Schema.RequiredMode.REQUIRED)
  private String id;

  @Schema(
      example = "Using a NC/LC Website Builder: Squarespace",
      requiredMode = Schema.RequiredMode.REQUIRED)
  private String title;

  @Schema(
      example = "Describes how to set up your website",
      requiredMode = Schema.RequiredMode.REQUIRED)
  private String description;

  @Schema(example = "Go To Market", requiredMode = Schema.RequiredMode.REQUIRED)
  private String category;

  @Schema(requiredMode = Schema.RequiredMode.REQUIRED)
  private SerializableEnum type;

  private Map<String, Object> metadata;

  private String content;

  public static TopicSummary from(Topic entity) {
    var summary = new TopicSummary();
    summary.id = entity.getId();
    summary.title = entity.getTitle();
    summary.description = entity.getDescription();
    summary.type = entity.getType();
    summary.content = entity.getContent();
    summary.metadata = entity.getMetadata();
    summary.category = entity.getCategory();

    return summary;
  }

  public String getId() {
    return id;
  }

  public String getTitle() {
    return title;
  }

  public String getDescription() {
    return description;
  }

  public String getCategory() {
    return category;
  }

  public SerializableEnum getType() {
    return type;
  }

  public Map<String, Object> getMetadata() {
    return metadata;
  }

  public String getContent() {
    return content;
  }
}
