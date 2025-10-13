package com.redesignhealth.company.api.client.file.dto;

/**
 * Useful for hydrating fields not included by default in the API responses <a
 * href="https://developers.google.com/drive/api/v3/reference/permissions">Full list of fields</a>
 */
public enum PermissionFields implements JsonEnum {
  ID("id"),
  EMAIL_ADDRESS("emailAddress"),
  PERMISSIONS("permissions");

  private final String jsonValue;

  PermissionFields(String jsonValue) {
    this.jsonValue = jsonValue;
  }

  @Override
  public String jsonValue() {
    return jsonValue;
  }
}
