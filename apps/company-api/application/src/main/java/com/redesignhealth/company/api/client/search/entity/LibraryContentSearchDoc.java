package com.redesignhealth.company.api.client.search.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
@AllArgsConstructor
public class LibraryContentSearchDoc {
  private final String id;
  private final String title;
  private final String description;
  private final String type;
  private final String content;
  private final String libraryId;
}
