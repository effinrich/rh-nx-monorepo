package com.redesignhealth.company.api.client.file.dto;

/**
 * <a href="https://developers.google.com/drive/api/v3/reference/permissions">Full list of
 * permission types</a>
 */
public enum PermissionType implements JsonEnum {
  USER("user");

  private final String jsonValue;

  PermissionType(String jsonValue) {
    this.jsonValue = jsonValue;
  }

  @Override
  public String jsonValue() {
    return jsonValue;
  }
}
