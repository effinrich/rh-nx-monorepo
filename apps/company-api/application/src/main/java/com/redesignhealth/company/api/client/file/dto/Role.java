package com.redesignhealth.company.api.client.file.dto;

/**
 * <a href="https://developers.google.com/drive/api/v3/reference/permissions">Full list of roles</a>
 */
public enum Role implements JsonEnum {
  WRITER("writer");

  private final String jsonValue;

  Role(String jsonValue) {
    this.jsonValue = jsonValue;
  }

  @Override
  public String jsonValue() {
    return jsonValue;
  }
}
