package com.redesignhealth.company.api.client.search.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

/**
 * An aggregation on how many documents contain a given keyword appears in our search server's
 * index.
 */
@AllArgsConstructor
@Getter
public class Term {
  private final String keyword;
  private final long count;
  @Setter @Getter private String displayName;

  public Term(String keyword, long count) {
    this.keyword = keyword;
    this.count = count;
  }

  public static Term of(String keyword, long count) {
    return new Term(keyword, count);
  }

  public static Term of(String keyword, long count, String displayName) {
    return new Term(keyword, count, displayName);
  }
}
