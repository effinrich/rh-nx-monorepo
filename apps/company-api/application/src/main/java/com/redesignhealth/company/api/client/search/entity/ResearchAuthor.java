package com.redesignhealth.company.api.client.search.entity;

import com.fasterxml.jackson.annotation.JsonCreator;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.ToString;

@Getter
@EqualsAndHashCode
@ToString
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class ResearchAuthor {
  private final String name;

  @JsonCreator
  public static ResearchAuthor of(String name) {
    return new ResearchAuthor(name);
  }
}
