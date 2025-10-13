package com.redesignhealth.company.api.entity.ref;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;

@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class ResearchArticleRef extends Ref {

  private final String value;

  public static ResearchArticleRef of(String value) {
    return new ResearchArticleRef(value);
  }

  @Override
  public String value() {
    return value;
  }
}
