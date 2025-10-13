package com.redesignhealth.company.api.dto;

import com.redesignhealth.company.api.client.search.entity.FilterOptions;
import java.util.List;
import lombok.Getter;

@Getter
public class FilterOptionsSummary {
  private String key;
  private List<TermSummary> options;

  public static FilterOptionsSummary from(FilterOptions filterOptions) {
    var summary = new FilterOptionsSummary();
    summary.key = filterOptions.getField();
    summary.options = filterOptions.getTerms().stream().map(TermSummary::from).toList();
    return summary;
  }
}
