package com.redesignhealth.company.api.client.search.utils;

import com.redesignhealth.company.api.client.search.command.SearchCommand;
import com.redesignhealth.company.api.client.search.entity.SearchResult;
import com.redesignhealth.company.api.dto.SearchFilter;
import com.redesignhealth.company.api.property.EntityConverter;
import com.redesignhealth.company.api.util.ApiToSearchConverter;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

public class Sanitizer {
  public static Pageable sanitizePageable(Pageable pageable, EntityConverter converter) {
    var sanitizedSort =
        ApiToSearchConverter.convertSort(pageable.getSort(), converter.getApiToSearch());
    return PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), sanitizedSort);
  }

  public static List<SearchFilter> sanitizeFilters(
      List<String> queryParamFilters, EntityConverter converter) {
    var filters = SearchCommand.convertQueryParams(queryParamFilters);
    return ApiToSearchConverter.convertFilters(filters, converter.getApiToSearch());
  }

  public static <T> SearchResult<T> sanitizeHighlightedText(
      SearchResult<T> result, EntityConverter entityConverter) {
    if (result.getHighlightedText() != null) {
      var sanitizedHighlights =
          result.getHighlightedText().entrySet().stream()
              .collect(
                  Collectors.toMap(
                      k -> entityConverter.getSearchToApi().getOrDefault(k.getKey(), k.getKey()),
                      Map.Entry::getValue));
      return SearchResult.of(result.getSource(), sanitizedHighlights, result.getId());
    }
    return result;
  }

  public static String sanitizeNameAsAlphaNumeric(String name) {
    return name.replaceAll("[^a-zA-Z0-9]", "");
  }
}
