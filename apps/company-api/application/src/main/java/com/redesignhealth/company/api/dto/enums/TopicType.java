package com.redesignhealth.company.api.dto.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.redesignhealth.company.api.dto.SerializableEnum;
import java.util.Map;

public enum TopicType implements SerializableEnum {
  ARTICLE("Article"),
  TEMPLATE("Template");

  private final String displayName;

  TopicType(String displayName) {
    this.displayName = displayName;
  }

  @Override
  public String getValue() {
    return this.name();
  }

  @Override
  public String getDisplayName() {
    return this.displayName;
  }

  // This is needed to handle deserializing either a String (e.g. ARTICLE) or Object
  // {"value": "ARTICLE", "displayName": "Article"}. Jackson only supports one
  // deserializer per class. We'll have to do some type checking to infer what's
  // being passed to this factory.
  @JsonCreator(mode = JsonCreator.Mode.DELEGATING)
  public static TopicType fromJson(Object values) {
    if (values instanceof String value) {
      return TopicType.valueOf(value);
    }

    var map = (Map<String, String>) values;
    return TopicType.valueOf(map.get("value"));
  }
}
