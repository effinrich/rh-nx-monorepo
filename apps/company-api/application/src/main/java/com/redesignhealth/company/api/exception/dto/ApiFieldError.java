package com.redesignhealth.company.api.exception.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;

/** Allow reporting of field level errors to the API client */
public class ApiFieldError extends ApiError {
  @Schema(requiredMode = Schema.RequiredMode.REQUIRED)
  private final List<FieldErrorDetails> errors;

  protected ApiFieldError(Builder builder) {
    super(builder);
    this.errors = List.of(builder.errors);
  }

  public List<FieldErrorDetails> getErrors() {
    return errors;
  }

  public static Builder builder() {
    return new Builder();
  }

  public static class Builder extends ApiError.Builder<Builder> {
    private FieldErrorDetails[] errors;

    public ApiFieldError build() {
      return new ApiFieldError(this);
    }

    public Builder errors(FieldErrorDetails... errors) {
      this.errors = errors;
      return this;
    }
  }
}
