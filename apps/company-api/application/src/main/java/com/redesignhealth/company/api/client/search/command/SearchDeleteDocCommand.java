package com.redesignhealth.company.api.client.search.command;

import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

/** Delete a search document */
@Builder
@Getter
@ToString
public class SearchDeleteDocCommand {
  private SearchIndex index;
  private String documentId;
}
