package com.redesignhealth.company.api.service.helper;

import com.redesignhealth.company.api.client.search.SearchClient;
import com.redesignhealth.company.api.client.search.command.SearchFilterOptionsCommand;
import com.redesignhealth.company.api.client.search.command.SearchIndex;
import com.redesignhealth.company.api.client.search.entity.FilterOptions;
import com.redesignhealth.company.api.property.EntityConverter;
import java.util.List;

public class Filter {
  public static List<FilterOptions> fromOS(
      SearchIndex searchIndex,
      List<String> VALID_SEARCH_FILTERS,
      SearchClient searchClient,
      EntityConverter entityConverter) {
    var command =
        SearchFilterOptionsCommand.builder()
            .index(searchIndex)
            .fields(VALID_SEARCH_FILTERS)
            .build();
    return searchClient.getFilterOptions(command).stream()
        .map(
            filterTerms ->
                FilterOptions.builder()
                    .field(
                        entityConverter
                            .getSearchToApi()
                            .getOrDefault(filterTerms.getField(), filterTerms.getField()))
                    .terms(filterTerms.getTerms())
                    .build())
        .toList();
  }
}
