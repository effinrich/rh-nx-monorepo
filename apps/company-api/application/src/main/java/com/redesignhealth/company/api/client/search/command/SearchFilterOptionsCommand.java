package com.redesignhealth.company.api.client.search.command;

import java.util.List;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.ToString;

/** Get a list of values for a set of fields */
@Builder
@Getter
@ToString
@EqualsAndHashCode
public class SearchFilterOptionsCommand {
  private final SearchIndex index;
  private final List<String> fields;
}
