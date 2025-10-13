package com.redesignhealth.company.api.util;

import com.redesignhealth.company.api.dto.SearchFilter;
import jakarta.annotation.Nullable;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import java.util.List;
import org.springframework.data.jpa.domain.Specification;

public class SpecificationUtil {

  /**
   * Support searching and filtering against a database.
   *
   * <p>Queries are case-insensitive
   *
   * <p>Filters are case-sensitive
   *
   * @param q query String
   * @param queryColumns columns to apply "q" against
   * @param filters all filters must match for results to be returned
   * @return WHERE clause to be attached to SQL query
   */
  public static <T> Specification<T> searchAndFilter(
      @Nullable String q, List<String> queryColumns, List<SearchFilter> filters) {
    return (root, query, builder) ->
        builder.and(search(builder, root, q, queryColumns), filter(builder, root, filters));
  }

  public static <T> Specification<T> search(@Nullable String q, List<String> queryColumns) {
    return (root, query, builder) -> search(builder, root, q, queryColumns);
  }

  private static <T> Predicate search(
      CriteriaBuilder builder, Root<T> root, @Nullable String q, List<String> queryColumns) {
    // noop
    if (q == null) {
      return builder.and();
    }
    return builder.or(
        queryColumns.stream()
            .map(col -> builder.like(builder.lower(root.get(col)), "%" + q.toLowerCase() + "%"))
            .toList()
            .toArray(new Predicate[0]));
  }

  private static <T> Predicate filter(
      CriteriaBuilder builder, Root<T> root, List<SearchFilter> filters) {
    return builder.and(
        filters.stream()
            .map(filter -> root.get(filter.getField()).in(filter.getValues()))
            .toList()
            .toArray(Predicate[]::new));
  }
}
