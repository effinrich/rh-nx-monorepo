package com.redesignhealth.company.api.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.ToString;

@Getter
@EqualsAndHashCode
@ToString
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class LinkRef {
  @Schema(example = "https://example.com")
  private final String href;

  @Schema(example = "report_url")
  private final String name;

  public static LinkRef of(String href) {
    return new LinkRef(href, null);
  }

  public static LinkRef of(String href, String name) {
    return new LinkRef(href, name);
  }
}
