package com.redesignhealth.company.api.entity;

import com.fasterxml.jackson.databind.JsonNode;
import com.redesignhealth.company.api.dto.SerializableEnum;
import com.vladmihalcea.hibernate.type.json.JsonBinaryType;
import jakarta.persistence.*;
import org.hibernate.annotations.Type;

@Entity
public class FormDefinition {

  @Id @GeneratedValue private Long id;

  @Column(unique = true)
  private Type type;

  @org.hibernate.annotations.Type(JsonBinaryType.class)
  @Column(columnDefinition = "jsonb")
  private JsonNode schema;

  public static FormDefinition of(Type type) {
    var formDefinition = new FormDefinition();
    formDefinition.type = type;
    return formDefinition;
  }

  public Type getType() {
    return type;
  }

  public JsonNode getSchema() {
    return schema;
  }

  public void setSchema(JsonNode schema) {
    this.schema = schema;
  }

  public enum Type implements SerializableEnum {
    TECH_STACK("Tech Stack"),
    PRIVACY_QUESTIONNAIRE("Privacy Questionnaire");

    private final String displayName;

    Type(String displayName) {
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
  }
}
