package com.redesignhealth.company.api.client.search;

import com.redesignhealth.company.api.client.search.command.SearchCommand;
import com.redesignhealth.company.api.client.search.command.SearchDeleteDocCommand;
import com.redesignhealth.company.api.client.search.command.SearchField;
import com.redesignhealth.company.api.client.search.command.SearchFilterOptionsCommand;
import com.redesignhealth.company.api.client.search.command.SearchGetCommand;
import com.redesignhealth.company.api.client.search.command.SearchIndex;
import com.redesignhealth.company.api.client.search.command.SearchIndexCommand;
import com.redesignhealth.company.api.client.search.entity.FilterOptions;
import com.redesignhealth.company.api.client.search.entity.SearchResult;
import com.redesignhealth.company.api.client.search.entity.Term;
import com.redesignhealth.company.api.dto.SearchFilter;
import com.redesignhealth.company.api.exception.SearchServerException;
import com.redesignhealth.company.api.expansion.UnsupportedSortPropertyException;
import com.redesignhealth.company.api.util.OpenSearchUtil;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
import org.opensearch.client.opensearch._types.FieldSort;
import org.opensearch.client.opensearch._types.FieldValue;
import org.opensearch.client.opensearch._types.SortOptions;
import org.opensearch.client.opensearch._types.SortOrder;
import org.opensearch.client.opensearch._types.aggregations.Aggregation;
import org.opensearch.client.opensearch._types.mapping.Property;
import org.opensearch.client.opensearch._types.mapping.TypeMapping;
import org.opensearch.client.opensearch._types.query_dsl.MultiMatchQuery;
import org.opensearch.client.opensearch._types.query_dsl.Query;
import org.opensearch.client.opensearch._types.query_dsl.TextQueryType;
import org.opensearch.client.opensearch._types.query_dsl.WildcardQuery;
import org.opensearch.client.opensearch.core.GetResponse;
import org.opensearch.client.opensearch.core.SearchRequest;
import org.opensearch.client.opensearch.core.SearchResponse;
import org.opensearch.client.opensearch.core.search.HighlightField;
import org.opensearch.client.opensearch.core.search.HighlighterOrder;
import org.opensearch.client.opensearch.indices.Alias;
import org.opensearch.client.opensearch.indices.CreateIndexRequest;
import org.opensearch.client.opensearch.indices.ExistsRequest;
import org.opensearch.client.transport.endpoints.BooleanResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

public class OpenSearchClient implements SearchClient {

  private static final Logger logger = LoggerFactory.getLogger(OpenSearchClient.class);

  /** The default is 10 https://opensearch.org/docs/latest/aggregations/bucket-agg/ */
  private static final int BUCKET_AGGREGATION_SIZE = 1000;

  private final org.opensearch.client.opensearch.OpenSearchClient client;

  /**
   * OpenSearch SDK does not throw when a document isn't found to delete. Instead it returns a
   * "not_found" code. It also returns a "deleted" code on success.
   */
  private static final String DELETED_RESULT_CODE = "deleted";

  /**
   * <a
   * href="https://www.elastic.co/guide/en/elasticsearch/reference/current/mapping-source-field.html#include-exclude">source-fields</a>
   *
   * <p>Helps reduce our download size by omitting the "content"
   */
  private static final List<String> FIELDS_OMITTED = List.of("content");

  private static final float MATCH_PHRASE_BOOST = 2.0f;

  /**
   * <a
   * href="https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-bool-query.html#bool-min-should-match">More
   * Info</a>
   */
  private static final String DEFAULT_SHOULD_MATCH = "1";

  private static final String WILDCARD = "*";

  /**
   * To return whole sentences without splitting them, set fragment_size to 0. <a
   * href="https://opensearch.org/docs/latest/search-plugins/searching-data/highlight/">More
   * Info</a>
   */
  private static final int HIGHLIGHTER_FRAGMENT_LENGTH = 0;

  private static final HighlighterOrder HIGHLIGHTER_ORDER = HighlighterOrder.Score;

  public OpenSearchClient(org.opensearch.client.opensearch.OpenSearchClient client) {
    this.client = client;
  }

  @Override
  public <T> Page<SearchResult<T>> search(
      SearchCommand command, Pageable pageable, Class<T> documentClass) {
    final SearchResponse<T> response;

    try {
      var sort = convertToSearchSort(pageable.getSort(), command.getIndex());
      var query = createBoolQuery(command);

      response =
          client.search(
              request -> {
                request
                    .index(command.getIndex().getValue())
                    .query(query)
                    .from(pageable.getPageSize() * (pageable.getPageNumber()))
                    .size(pageable.getPageSize())
                    .source(s -> s.filter(f -> f.excludes(FIELDS_OMITTED)))
                    .sort(sort);
                handleHighlighting(request, command);
                return request;
              },
              documentClass);
    } catch (IOException e) {
      throw new SearchServerException(e);
    }
    var results =
        response.hits().hits().stream()
            .map(f -> SearchResult.of(f.source(), f.highlight(), f.id()))
            .toList();
    var page = new PageImpl<>(results, pageable, response.hits().total().value());
    return page;
  }

  /**
   * Request highlighted text for matching field values <a
   * href="https://opensearch.org/docs/2.2/opensearch/search/highlight/">More Details</a>
   */
  private void handleHighlighting(SearchRequest.Builder request, SearchCommand command) {
    if (command.isHighlight()) {
      var fields =
          command.getFields().stream()
              .collect(
                  Collectors.toMap(SearchField::getName, k -> HighlightField.of(config -> config)));
      request.highlight(
          h -> h.fields(fields).fragmentSize(HIGHLIGHTER_FRAGMENT_LENGTH).order(HIGHLIGHTER_ORDER));
    }
  }

  @Override
  public <T> Optional<SearchResult<T>> get(SearchGetCommand command, Class<T> documentClass) {
    final GetResponse<T> response;
    try {
      response =
          client.get(
              request -> request.id(command.getDocumentId()).index(command.getIndex().getValue()),
              documentClass);
    } catch (IOException e) {
      throw new SearchServerException(e);
    }
    return Optional.of(SearchResult.of(response.source()));
  }

  @Override
  public void index(SearchIndexCommand command) {
    try {
      client.index(
          i ->
              i.index(command.getIndex().getValue())
                  .id(command.getDocumentId())
                  .document(command.getDocument()));
    } catch (IOException e) {
      throw new SearchServerException(e);
    }
  }

  /**
   * Gets all possible values for a given field.
   *
   * <p>Note: The field must be type "keyword". "text" fields will result in an error.
   *
   * <p>https://opensearch.org/docs/latest/aggregations/bucket-agg/#terms
   */
  @Override
  public List<FilterOptions> getFilterOptions(SearchFilterOptionsCommand command) {
    SearchResponse<Void> response;
    try {
      Map<String, Aggregation> aggregations = new HashMap<>();
      var searchIndexProperties = getMappingProperties(command.getIndex());
      for (var requestedFilterField : command.getFields()) {
        var sanitizedField =
            OpenSearchUtil.getProperty(requestedFilterField, searchIndexProperties);
        var aggregation =
            Aggregation.of(
                agg -> agg.terms(t -> t.field(sanitizedField).size(BUCKET_AGGREGATION_SIZE)));
        aggregations.put(requestedFilterField, aggregation);
      }
      response =
          client.search(
              request -> request.index(command.getIndex().getValue()).aggregations(aggregations),
              Void.class);
      return response.aggregations().entrySet().stream()
          .map(
              agg -> {
                var terms =
                    agg.getValue().sterms().buckets().array().stream()
                        .map(bucket -> Term.of(bucket.key(), bucket.docCount()))
                        .toList();
                return FilterOptions.builder().field(agg.getKey()).terms(terms).build();
              })
          .toList();
    } catch (IOException e) {
      throw new SearchServerException(e);
    }
  }

  @Override
  public void delete(SearchDeleteDocCommand command) {
    try {
      var deleteResponse =
          client.delete(
              request -> request.id(command.getDocumentId()).index(command.getIndex().getValue()));
      if (!DELETED_RESULT_CODE.equals(deleteResponse.result().jsonValue())) {
        logger.warn(
            "Issue deleting id={} from index={} server responded with message={}",
            command.getDocumentId(),
            command.getIndex().getValue(),
            deleteResponse.result().jsonValue());
      }
    } catch (IOException e) {
      throw new SearchServerException(e);
    }
  }

  @Override
  public boolean indexExists(SearchIndex index) {
    return indexExists(index.getValue());
  }

  @Override
  public boolean indexExists(String index) {
    try {
      BooleanResponse response = client.indices().exists(ExistsRequest.of(s -> s.index(index)));
      // if response is null the check operation for the index has failed and returns true  to avoid
      // create the index
      if (response == null) return true;
      return response.value();
    } catch (IOException e) {
      throw new SearchServerException(e);
    }
  }

  @Override
  public void createIndexWithMappings(String indexName, InputStream mappings, String aliasName) {
    try {
      var mapper = client._transport().jsonpMapper();
      var parser = mapper.jsonProvider().createParser(mappings);
      var createIndexRequest =
          new CreateIndexRequest.Builder()
              .index(indexName)
              .mappings(TypeMapping._DESERIALIZER.deserialize(parser, mapper))
              .aliases(aliasName, new Alias.Builder().build())
              .build();
      client.indices().create(createIndexRequest);
    } catch (IOException e) {
      throw new SearchServerException(e);
    }
  }

  @Override
  public void createIndexWithMappings(SearchIndex index, InputStream mappings) {
    String indexName = index.getValue() + '-' + System.currentTimeMillis();
    String alias = index.getValue();
    createIndexWithMappings(indexName, mappings, alias);
  }

  /**
   * <a
   * href="https://www.elastic.co/blog/how-to-improve-elasticsearch-search-relevance-with-boolean-queries">More
   * info on tuning relevancy of queries</a>.
   *
   * @param command configuration for query
   * @return Query
   */
  private Query createBoolQuery(SearchCommand command) throws IOException {
    var filters = convertFiltersToTermsQueries(command.getFilters(), command.getIndex());
    return Query.of(
        baseQuery ->
            baseQuery.bool(
                boolQuery -> {
                  if (command.getQuery() != null) {
                    // "should" queries allow us to combine document scores from multiple queries
                    List<Query> queryConditions =
                        new java.util.ArrayList<>(
                            List.of(
                                Query.of(
                                    orQuery ->
                                        orQuery.multiMatch(
                                            mm -> {
                                              createBaseQuery(
                                                  mm, command.getQuery(), command.getFields());
                                              return mm;
                                            })),
                                Query.of(
                                    matchPhraseQuery ->
                                        matchPhraseQuery.multiMatch(
                                            mm -> {
                                              createBaseQuery(
                                                  mm, command.getQuery(), command.getFields());
                                              mm.type(TextQueryType.Phrase);
                                              // Prioritize Match Phrase Query
                                              mm.boost(MATCH_PHRASE_BOOST);
                                              return mm;
                                            }))));
                    if (command.isWildCard() && command.getFields() != null) {
                      for (SearchField sf : command.getFields())
                        queryConditions.add(
                            Query.of(
                                orQuery ->
                                    orQuery.wildcard(
                                        wq -> {
                                          createBaseWildcardQuery(
                                              command.getQuery() + WILDCARD, wq, sf);
                                          return wq;
                                        })));
                    }
                    if (command.isSearchAsYouType()) {
                      queryConditions.add(
                          Query.of(
                              orQuery ->
                                  orQuery.multiMatch(
                                      mm -> {
                                        createBaseQuery(
                                            command.getQuery(),
                                            mm,
                                            expandSearchFields(command.getFields()),
                                            TextQueryType.BoolPrefix);
                                        return mm;
                                      })));
                    }

                    boolQuery.should(queryConditions);
                    // If this is not provided, results will be returned even if "should" queries
                    // don't match.
                    // This is due to "filter" matching results.
                    // More info:
                    // https://discuss.elastic.co/t/combine-should-with-filter-search-api/139129
                    boolQuery.minimumShouldMatch(DEFAULT_SHOULD_MATCH);
                  }
                  boolQuery.filter(filters);

                  return boolQuery;
                }));
  }

  private static void createBaseQuery(
      MultiMatchQuery.Builder mm, String query, List<SearchField> fields) {
    mm.query(query);
    if (fields != null) {
      mm.fields(fields.stream().map(SearchField::toString).toList());
    }
  }

  private static void createBaseQuery(
      String query,
      MultiMatchQuery.Builder mm,
      List<SearchField> fields,
      TextQueryType textQueryType) {
    createBaseQuery(mm, query, fields);
    // searchAsYouType required this bool prefix type to avoid doing searching within a sentence
    // (infix completion),
    // and only does search based on the beginning of the sentence (prefix completion)
    if (textQueryType != null) mm.type(textQueryType);
  }

  private static void createBaseWildcardQuery(
      String query, WildcardQuery.Builder wq, SearchField field) {
    wq.wildcard(query);
    wq.caseInsensitive(true);
    wq.field(field.getName());
  }

  /** Terms Queries: https://opensearch.org/docs/latest/query-dsl/term/#terms */
  private List<Query> convertFiltersToTermsQueries(
      List<SearchFilter> searchFilters, SearchIndex index) throws IOException {
    if (searchFilters.isEmpty()) {
      return List.of();
    }

    var searchIndexProperties = getMappingProperties(index);

    return searchFilters.stream()
        .filter(searchFilter -> !searchFilter.getValues().isEmpty())
        .map(
            searchFilter ->
                new Query.Builder()
                    .terms(
                        termQuery -> {
                          var sanitizedFieldName =
                              OpenSearchUtil.getProperty(
                                  searchFilter.getField(), searchIndexProperties);
                          var values =
                              searchFilter.getValues().stream().map(FieldValue::of).toList();
                          return termQuery.field(sanitizedFieldName).terms(t -> t.value(values));
                        })
                    .build())
        .toList();
  }

  private Map<String, Property> getMappingProperties(SearchIndex index) throws IOException {
    return client
        .indices()
        .get(r -> r.index(index.getValue()))
        .result()
        .values()
        .iterator()
        .next()
        .mappings()
        .properties();
  }

  /**
   * Convert Spring's {@link Sort} into OpenSearch's {@link SortOptions}.
   *
   * @throws UnsupportedSortPropertyException if field schema is not available to sort by
   */
  private List<SortOptions> convertToSearchSort(Sort sort, SearchIndex index) throws IOException {
    if (sort.isUnsorted()) {
      return List.of();
    }

    var indexProperties = getMappingProperties(index);

    return sort.stream()
        .map(
            order -> {
              var field = OpenSearchUtil.getProperty(order.getProperty(), indexProperties);
              var sortOrder = order.isAscending() ? SortOrder.Asc : SortOrder.Desc;
              return SortOptions.of(
                  s -> s.field(FieldSort.of(f -> f.field(field).order(sortOrder))));
            })
        .toList();
  }

  // This method adds prefix in the fields used for a searching using search as you type attribute.
  // In createBaseQuery we will add support for creation:
  // "the most efficient way of querying to serve a search-as-you-type use case is usually a
  // multi_match query
  // of type bool_prefix that targets the root search_as_you_type field and its shingle subfields."
  private List<SearchField> expandSearchFields(List<SearchField> fields) {
    String prefixLevel2 = "._2gram";
    String prefixLevel3 = "._3gram";
    List<SearchField> expandedSearchFields;
    if (fields != null) {
      expandedSearchFields = new ArrayList<>();
      fields.forEach(
          searchField -> {
            expandedSearchFields.add(SearchField.of(searchField.getName(), searchField.getBoost()));
            expandedSearchFields.add(
                SearchField.of(searchField.getName() + prefixLevel2, searchField.getBoost()));
            expandedSearchFields.add(
                SearchField.of(searchField.getName() + prefixLevel3, searchField.getBoost()));
          });
      return expandedSearchFields;
    }
    return null;
  }
}
