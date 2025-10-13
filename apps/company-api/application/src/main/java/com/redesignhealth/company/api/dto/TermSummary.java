package com.redesignhealth.company.api.dto;

import com.redesignhealth.company.api.client.search.entity.Term;
import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * An aggregation on how many documents contain a given keyword appears in our search server's
 * index.
 */
@Getter
@AllArgsConstructor
public class TermSummary {
  private final String keyword;
  private final long count;
  private final String displayName;

  public static TermSummary from(Term term) {
    return new TermSummary(term.getKeyword(), term.getCount(), term.getDisplayName());
  }
}
