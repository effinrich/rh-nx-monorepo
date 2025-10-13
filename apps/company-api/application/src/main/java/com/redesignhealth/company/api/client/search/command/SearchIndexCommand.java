package com.redesignhealth.company.api.client.search.command;

import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.ToString;

/** Index a document into a search server */
@EqualsAndHashCode(of = {"index", "documentId", "document"})
@Builder
@Getter
@ToString
public class SearchIndexCommand<T> {
  private final SearchIndex index;
  private final String documentId;
  private final T document;
}
