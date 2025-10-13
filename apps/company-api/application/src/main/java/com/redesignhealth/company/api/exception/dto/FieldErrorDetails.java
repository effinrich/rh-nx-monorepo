package com.redesignhealth.company.api.exception.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import org.springframework.validation.FieldError;

public class FieldErrorDetails {
  @Schema(example = "displayName", requiredMode = Schema.RequiredMode.REQUIRED)
  private final String name;

  @Schema(example = "!$@#!@Hello", requiredMode = Schema.RequiredMode.REQUIRED)
  private final Object rejectedValue;

  @Schema(
      example = "cannot contain special characters",
      requiredMode = Schema.RequiredMode.REQUIRED)
  private final String description;

  private FieldErrorDetails(String name, Object rejectedValue, String type) {
    this.name = name;
    this.rejectedValue = rejectedValue;
    this.description = type;
  }

  public static FieldErrorDetails of(String name, FieldErrorType type) {
    return new FieldErrorDetails(name, null, type.getDescription());
  }

  public static FieldErrorDetails of(String name, String rejectedValue, FieldErrorType type) {
    return new FieldErrorDetails(name, rejectedValue, type.getDescription());
  }

  public FieldErrorDetails(FieldError fieldError) {
    this.name = fieldError.getField();
    this.rejectedValue = fieldError.getRejectedValue();
    this.description = fieldError.getDefaultMessage();
  }

  public String getName() {
    return name;
  }

  public Object getRejectedValue() {
    return rejectedValue;
  }

  public String getDescription() {
    return description;
  }

  public static Builder builder() {
    return new Builder();
  }

  public static class Builder {
    private String name;
    private Object rejectedValue;

    private String fieldErrorType;

    public FieldErrorDetails build() {
      return new FieldErrorDetails(name, rejectedValue, fieldErrorType);
    }

    public Builder name(String name) {
      this.name = name;
      return this;
    }

    public Builder rejectedValue(Object rejectedValue) {
      this.rejectedValue = rejectedValue;
      return this;
    }

    public Builder type(FieldErrorType fieldErrorType) {
      this.fieldErrorType = fieldErrorType.getDescription();
      return this;
    }

    public Builder type(String fieldErrorType) {
      this.fieldErrorType = fieldErrorType;
      return this;
    }
  }
}
