package com.redesignhealth.company.api.client.search.command;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;

/** Configuration for a field to search against */
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
public class SearchField {
  private String name;

  /**
   * Boost a documents score when this field matches a full-text search <a
   * href="https://opensearch.org/docs/latest/query-dsl/full-text/#multi-match">More Details</a>
   */
  private int boost;

  private static final int DEFAULT_BOOST = 1;

  public static SearchField of(String value) {
    return of(value, DEFAULT_BOOST);
  }

  public static SearchField of(String value, int boost) {
    return new SearchField(value, boost);
  }

  @Override
  public String toString() {
    return name + "^" + boost;
  }
}
