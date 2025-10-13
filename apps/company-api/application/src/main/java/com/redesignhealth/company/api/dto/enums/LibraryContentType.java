package com.redesignhealth.company.api.dto.enums;

import com.redesignhealth.company.api.dto.SerializableEnum;

public enum LibraryContentType implements SerializableEnum {
  /** General non-interactive content created by RH */
  ARTICLE("Article"),
  /** General non-interactive content indexed by RH */
  THIRD_PARTY("Third Party"),
  /** Streaming video with instructions or other written guidance */
  VIDEO("Video"),
  /** Gray area between Article and Template */
  TOOL("Tool"),
  /** Content that is meant to be taken and modified by users (eg., a contract). */
  TEMPLATE("Template"),
  /** A collection of articles and templates. */
  SOLUTION("Collection"),
  /** A collection of solutions. */
  CATEGORY("Category");

  private final String displayName;

  LibraryContentType(String displayName) {
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
