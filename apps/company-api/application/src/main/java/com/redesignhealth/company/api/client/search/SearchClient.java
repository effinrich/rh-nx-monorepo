package com.redesignhealth.company.api.client.search;

import com.redesignhealth.company.api.client.search.command.SearchCommand;
import com.redesignhealth.company.api.client.search.command.SearchDeleteDocCommand;
import com.redesignhealth.company.api.client.search.command.SearchFilterOptionsCommand;
import com.redesignhealth.company.api.client.search.command.SearchGetCommand;
import com.redesignhealth.company.api.client.search.command.SearchIndex;
import com.redesignhealth.company.api.client.search.command.SearchIndexCommand;
import com.redesignhealth.company.api.client.search.entity.FilterOptions;
import com.redesignhealth.company.api.client.search.entity.SearchResult;
import java.io.InputStream;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/** Handle querying and indexing data */
public interface SearchClient {

  <T> Page<SearchResult<T>> search(
      SearchCommand command, Pageable pageable, Class<T> documentClass);

  <T> Optional<SearchResult<T>> get(SearchGetCommand command, Class<T> documentClass);

  void index(SearchIndexCommand command);

  List<FilterOptions> getFilterOptions(SearchFilterOptionsCommand command);

  void delete(SearchDeleteDocCommand command);

  boolean indexExists(SearchIndex index);

  boolean indexExists(String index);

  void createIndexWithMappings(SearchIndex index, InputStream mappings);

  void createIndexWithMappings(String indexName, InputStream mappings, String aliasName);
}
