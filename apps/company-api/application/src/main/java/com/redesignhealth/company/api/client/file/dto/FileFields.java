package com.redesignhealth.company.api.client.file.dto;

/**
 * Useful for hydrating fields not included by default in API responses <a
 * href="https://developers.google.com/drive/api/v3/reference/files">Full list of fields</a>
 */
public enum FileFields implements JsonEnum {
  CAPABILITIES("capabilities");

  private final String jsonValue;

  FileFields(String jsonValue) {
    this.jsonValue = jsonValue;
  }

  @Override
  public String jsonValue() {
    return jsonValue;
  }
}
