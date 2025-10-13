package com.redesignhealth.company.api.exception.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.servlet.http.HttpServletRequest;

/**
 * Heavily influenced by {@link
 * org.springframework.boot.autoconfigure.web.servlet.error.BasicErrorController#error(HttpServletRequest)}
 *
 * <p>Unfortunately the generic error returned is of type Map<String, Object> and gets rid of some
 * of the object schema.
 *
 * <p>This class helps us generate an OpenAPI Model for our errors.
 */
public class ApiError {
  @Schema(example = "2022-12-01T18:24:09.402+00:00", requiredMode = Schema.RequiredMode.REQUIRED)
  protected final String timestamp;

  @Schema(example = "400", requiredMode = Schema.RequiredMode.REQUIRED)
  protected final int status;

  @Schema(example = "Bad Request", requiredMode = Schema.RequiredMode.REQUIRED)
  protected final String error;

  @Schema(
      example = "An error occurred with some of the data you sent.",
      requiredMode = Schema.RequiredMode.REQUIRED)
  protected final String message;

  @Schema(example = "/company", requiredMode = Schema.RequiredMode.REQUIRED)
  protected final String path;

  protected ApiError(Builder<?> builder) {
    this.error = builder.error;
    this.timestamp = builder.timestamp;
    this.status = builder.status;
    this.message = builder.message;
    this.path = builder.path;
  }

  public String getTimestamp() {
    return timestamp;
  }

  public int getStatus() {
    return status;
  }

  public String getError() {
    return error;
  }

  public String getMessage() {
    return message;
  }

  public String getPath() {
    return path;
  }

  public static Builder<?> builder() {
    return new Builder<>();
  }

  public static class Builder<T extends Builder<T>> {
    private String timestamp;
    private int status;
    private String error;
    private String message;
    private String path;

    public ApiError build() {
      return new ApiError(this);
    }

    public T timestamp(String timestamp) {
      this.timestamp = timestamp;
      return (T) this;
    }

    public T status(int status) {
      this.status = status;
      return (T) this;
    }

    public T error(String error) {
      this.error = error;
      return (T) this;
    }

    public T message(String message) {
      this.message = message;
      return (T) this;
    }

    public T path(String path) {
      this.path = path;
      return (T) this;
    }
  }
}
