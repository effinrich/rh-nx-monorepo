package com.redesignhealth.company.api.util;

import com.fasterxml.jackson.databind.JsonNode;
import com.networknt.schema.JsonSchema;
import com.networknt.schema.JsonSchemaFactory;
import com.networknt.schema.SpecVersion;
import com.networknt.schema.ValidationMessage;
import com.redesignhealth.company.api.exception.dto.FieldErrorDetails;
import java.net.URI;
import java.util.Set;

public class JsonSchemaUtils {

  private static final JsonSchemaFactory factory =
      JsonSchemaFactory.getInstance(SpecVersion.VersionFlag.V202012);

  private JsonSchemaUtils() {
    throw new IllegalStateException();
  }

  /** Convert raw JSON into a JSON Schema POJO */
  public static JsonSchema getSchema(JsonNode schema) {
    return factory.getSchema(schema);
  }

  /**
   * A meta-schema is a JSON Schema that can be used to validate a JSON Schema. Typically, we use
   * JSON Schemas to validate vanilla JSON. This special meta-schema allows us to do the same on the
   * schema itself.
   */
  public static JsonSchema getMetaSchema() {
    return factory.getSchema(URI.create("https://json-schema.org/draft/2020-12/schema"));
  }

  public static FieldErrorDetails[] convertErrors(Set<ValidationMessage> errors, String fieldName) {
    return errors.stream()
        .map((e) -> FieldErrorDetails.builder().name(fieldName).type(e.getMessage()).build())
        .toList()
        .toArray(new FieldErrorDetails[0]);
  }
}
