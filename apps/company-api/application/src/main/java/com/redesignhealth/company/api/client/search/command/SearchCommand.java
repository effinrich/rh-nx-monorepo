package com.redesignhealth.company.api.client.search.command;

import com.redesignhealth.company.api.dto.SearchFilter;
import java.util.List;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.ToString;

@Builder
@Getter
@ToString
@EqualsAndHashCode
/** Query a search server */
public class SearchCommand {

  private final String query;
  private List<SearchFilter> filters;
  private final SearchIndex index;
  private List<SearchField> fields;
  private boolean highlight;
  private boolean searchAsYouType;
  private boolean wildCard;

  /**
   * Filters can contain a "," to separate a field from its set of values to filter on
   *
   * <p>Ex. ?filter=fieldName,value would return results with a fieldName=value
   */
  private static final String FIELD_VALUE_SEPARATOR = ",";

  /**
   * Filters can contain multiple values separated by "|" to represent an OR based filter
   *
   * <p>Ex. filter=fieldName,value1|value2 would return results with a fieldName=value1 or
   * fieldName=value2
   */
  private static final String OR_SEPARATOR = "\\|";

  public static List<SearchFilter> convertQueryParams(List<String> queryParams) {
    return queryParams.stream().map(SearchCommand::convertQueryParam).toList();
  }

  public static SearchFilter convertQueryParam(String queryParam) {
    var parts = queryParam.split(FIELD_VALUE_SEPARATOR);
    var field = parts[0];
    if (parts.length > 1) {
      var values = parts[1].split(OR_SEPARATOR);
      return SearchFilter.of(field, values);
    }
    return SearchFilter.of(field);
  }

  public static class SearchCommandBuilder {

    public SearchCommandBuilder searchFilters(List<String> filters) {
      this.filters =
          filters == null
              ? List.of()
              : filters.stream().map(SearchCommand::convertQueryParam).toList();
      return this;
    }
  }
}
