package com.redesignhealth.company.api.client.search.entity;

import jakarta.annotation.Nullable;
import java.util.List;
import java.util.Map;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;

/** Search document and metadata about the document */
@Getter
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class SearchResult<T> {
  private T source;
  @Nullable private Map<String, List<String>> highlightedText;

  @Nullable private String id;

  public static <T> SearchResult<T> of(
      T source, Map<String, List<String>> highlightedText, String id) {
    return new SearchResult<>(source, highlightedText, id);
  }

  public static <T> SearchResult<T> of(T source) {
    return of(source, null, null);
  }
}
