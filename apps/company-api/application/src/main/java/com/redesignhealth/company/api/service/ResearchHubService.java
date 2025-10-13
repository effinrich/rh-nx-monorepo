package com.redesignhealth.company.api.service;

import static com.redesignhealth.company.api.client.search.utils.Sanitizer.sanitizeHighlightedText;

import com.redesignhealth.company.api.client.search.SearchClient;
import com.redesignhealth.company.api.client.search.command.SearchCommand;
import com.redesignhealth.company.api.client.search.command.SearchField;
import com.redesignhealth.company.api.client.search.command.SearchIndex;
import com.redesignhealth.company.api.client.search.entity.SearchResult;
import com.redesignhealth.company.api.dto.SearchFilter;
import com.redesignhealth.company.api.entity.Company;
import com.redesignhealth.company.api.entity.ref.CompanyRef;
import com.redesignhealth.company.api.expansion.Expansion;
import com.redesignhealth.company.api.property.EntityConverter;
import com.redesignhealth.company.api.repository.CompanyRepository;
import com.redesignhealth.company.api.util.ApiToSearchConverter;
import jakarta.annotation.Nullable;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

public abstract class ResearchHubService<T> {

  private final Class<T> searchDomainClass;

  protected ResearchHubService(Class<T> searchDomainClass) {
    this.searchDomainClass = searchDomainClass;
  }

  protected Page<SearchResult<T>> query(
      SearchClient client, @Nullable String q, List<String> filters, Pageable pageable) {
    return query(client, q, filters, pageable, List.of());
  }

  protected Page<SearchResult<T>> query(
      SearchClient client,
      @Nullable String q,
      List<String> filters,
      Pageable pageable,
      List<Expansion> expansions) {
    var sanitizedFilters = sanitizeFilters(filters);
    var sanitizedPageable = sanitizePageable(pageable);
    var shouldHighlight = expansions.contains(Expansion.HIGHLIGHTED_TEXT);
    var command =
        SearchCommand.builder()
            .index(getIndex())
            .fields(getFieldsToSearch())
            .highlight(shouldHighlight)
            .query(q)
            .filters(sanitizedFilters)
            .build();

    var results = client.search(command, sanitizedPageable, searchDomainClass);
    if (shouldHighlight) {
      var sanitizedResults =
          results.getContent().stream()
              .map((result) -> sanitizeHighlightedText(result, getEntityConverter()))
              .toList();
      return new PageImpl<>(sanitizedResults, results.getPageable(), results.getTotalElements());
    }
    return results;
  }

  /** Clean up query parameters provided */
  private List<SearchFilter> sanitizeFilters(List<String> queryParamFilters) {
    var filters = SearchCommand.convertQueryParams(queryParamFilters);
    return ApiToSearchConverter.convertFilters(filters, getEntityConverter().getApiToSearch());
  }

  /** Clean up pagination options */
  private Pageable sanitizePageable(Pageable pageable) {
    var sanitizedSort =
        ApiToSearchConverter.convertSort(pageable.getSort(), getEntityConverter().getApiToSearch());
    return PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), sanitizedSort);
  }

  abstract EntityConverter getEntityConverter();

  abstract List<SearchField> getFieldsToSearch();

  abstract SearchIndex getIndex();

  protected Map<CompanyRef, Company> getCompanies(
      Set<CompanyRef> ids, CompanyRepository companyRepository) {
    return companyRepository.findAllByApiIdIn(ids).stream()
        .collect(Collectors.toMap(Company::getApiId, Function.identity()));
  }
}
