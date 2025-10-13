package com.redesignhealth.company.api.document;

import com.redesignhealth.company.api.dto.enums.TopicType;
import java.util.Map;

/**
 * A topic is a base-level entity of the Library system.
 *
 * <p>Topics can be documents, spreadsheets, presentations, or other files
 */
public class Topic {
  private String id;
  private String title;
  private String description;
  private String category;
  private TopicType type;
  private String content;
  private Map<String, Object> metadata;

  /** For Jackson */
  public Topic() {}

  private Topic(Builder builder) {
    this.id = builder.id;
    this.title = builder.title;
    this.description = builder.description;
    this.type = builder.type;
    this.category = builder.category;
    this.content = builder.content;
    this.metadata = builder.metadata;
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

  public TopicType getType() {
    return type;
  }

  public String getContent() {
    return content;
  }

  public void setContent(String content) {
    this.content = content;
  }

  public Map<String, Object> getMetadata() {
    return metadata;
  }

  public static Builder builder() {
    return new Builder();
  }

  public static class Builder {

    private String id;
    private String title;
    private String description;
    private String category;
    private TopicType type;
    private String content;
    private Map<String, Object> metadata;

    public Topic build() {
      return new Topic(this);
    }

    public Builder id(String id) {
      this.id = id;
      return this;
    }

    public Builder title(String title) {
      this.title = title;
      return this;
    }

    public Builder description(String description) {
      this.description = description;
      return this;
    }

    public Builder type(TopicType type) {
      this.type = type;
      return this;
    }

    public Builder category(String category) {
      this.category = category;
      return this;
    }

    public Builder content(String content) {
      this.content = content;
      return this;
    }

    public Builder metadata(Map<String, Object> metadata) {
      this.metadata = metadata;
      return this;
    }
  }
}
