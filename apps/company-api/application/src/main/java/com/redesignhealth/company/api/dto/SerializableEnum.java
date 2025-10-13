package com.redesignhealth.company.api.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.Arrays;

// Note: There is an issue with generating OpenAPI response schema examples
// for implementors of this interface.
//
// For now { "displayName": "string", "value": "string"} is used.
//
// On requests, we want to only accept "values" and Spring doc generates "enum" types correctly.
// On responses however, we want to share the "value" and "displayName" and Springdoc
// uses this parent interface to generate the schema. We can't have separate schema
// examples per implementor as a result.
// A way to get around this is to create a JSON example from scratch
// @Schema(example = """
//   { "value": "DONE", displayName: "Done" }
//  """, implementation = SerializableEnum.class)
//  private Implementor field1;
@JsonFormat(shape = JsonFormat.Shape.OBJECT)
public interface SerializableEnum {
  @JsonProperty
  String getValue();

  @JsonProperty
  String getDisplayName();

  static <T extends SerializableEnum> T fromDisplayName(T[] values, String displayName) {
    return Arrays.stream(values)
        .filter(value -> value.getDisplayName().equals(displayName))
        .findFirst()
        .orElseThrow(IllegalArgumentException::new);
  }

  static <T extends SerializableEnum> T fromValue(T[] values, String keyword) {
    return Arrays.stream(values)
        .filter(value -> value.getValue().equals(keyword))
        .findFirst()
        .orElseThrow(IllegalArgumentException::new);
  }
}
