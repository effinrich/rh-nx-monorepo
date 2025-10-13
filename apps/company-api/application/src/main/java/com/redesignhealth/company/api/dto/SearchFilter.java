package com.redesignhealth.company.api.dto;

import java.util.List;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.ToString;

@Getter
@EqualsAndHashCode
@ToString
public class SearchFilter {
  private final String field;
  private final List<String> values;

  private SearchFilter(String field, List<String> values) {
    this.field = field;
    this.values = values;
  }

  public static SearchFilter of(String field, List<String> values) {
    return new SearchFilter(field, values);
  }

  public static SearchFilter of(String field, String... value) {
    return of(field, List.of(value));
  }

  public static SearchFilter of(String field) {
    return of(field, new String[0]);
  }
}
