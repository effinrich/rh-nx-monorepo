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
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

public class NoopSearchClient implements SearchClient {
  private static final Logger logger = LoggerFactory.getLogger(NoopSearchClient.class);

  @Override
  public <T> Page<SearchResult<T>> search(
      SearchCommand command, Pageable pageable, Class<T> documentClass) {
    logger.info("Mocked call to search command={} and pageable={}", command, pageable);
    return new PageImpl<>(List.of(), pageable, 0);
  }

  @Override
  public <T> Optional<SearchResult<T>> get(SearchGetCommand command, Class<T> documentClass) {
    logger.info("Mocked call to get command={}", command);
    return Optional.empty();
  }

  @Override
  public void index(SearchIndexCommand command) {
    logger.info("Mocked call to index command={}", command);
  }

  @Override
  public List<FilterOptions> getFilterOptions(SearchFilterOptionsCommand command) {
    logger.info("Mocked call to get filter options for command={}", command);
    return List.of();
  }

  @Override
  public void delete(SearchDeleteDocCommand command) {
    logger.info("Mocked call to delete document for command={}", command);
  }

  @Override
  public boolean indexExists(SearchIndex index) {
    return indexExists(index.getValue());
  }

  @Override
  public boolean indexExists(String index) {
    logger.info("Mocked call to check the index={} exists", index);
    return false;
  }

  @Override
  public void createIndexWithMappings(SearchIndex index, InputStream mappings) {
    createIndexWithMappings(index.getValue(), mappings, index.getValue());
  }

  @Override
  public void createIndexWithMappings(String indexName, InputStream mappings, String aliasName) {
    logger.info("Mocked call to create the index={} ", indexName);
  }
}
