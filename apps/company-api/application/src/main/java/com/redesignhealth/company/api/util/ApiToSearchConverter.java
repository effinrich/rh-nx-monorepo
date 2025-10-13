package com.redesignhealth.company.api.util;

import com.redesignhealth.company.api.dto.SearchFilter;
import java.util.List;
import java.util.Map;
import org.springframework.data.domain.Sort;

/**
 * Responsible for translating field names between our API naming conventions and search index
 * naming conventions.
 *
 * <p>For instance, a field might exist in the API called "author", but is stored as "note_taker" in
 * our search server. We need to allow API clients to reference API fields while our service
 * translates those into search commands behinds the scenes.
 *
 * <p>Ex. ?filter=author,Jane Doe -> results in a search query of note_taker:Jane Doe
 */
public class ApiToSearchConverter {

  /** Convert API filter names to Search field names */
  public static List<SearchFilter> convertFilters(
      List<SearchFilter> apiNames, Map<String, String> apiToSearchNames) {
    return apiNames.stream()
        .map(
            filter ->
                SearchFilter.of(
                    apiToSearchNames.getOrDefault(filter.getField(), filter.getField()),
                    filter.getValues()))
        .toList();
  }

  /** Convert API sort field names to Search field names */
  public static Sort convertSort(Sort withApiNames, Map<String, String> apiToSearchNames) {
    return Sort.by(
        withApiNames.stream()
            .map(
                order ->
                    new Sort.Order(
                        order.getDirection(),
                        apiToSearchNames.getOrDefault(order.getProperty(), order.getProperty())))
            .toList());
  }
}
