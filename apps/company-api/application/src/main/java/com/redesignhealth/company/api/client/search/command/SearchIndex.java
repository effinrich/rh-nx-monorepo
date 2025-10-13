package com.redesignhealth.company.api.client.search.command;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.ToString;

@ToString
@Getter
@AllArgsConstructor(access = AccessLevel.PACKAGE)
public enum SearchIndex {
  TOPIC("platform-library"),
  CONTENT("platform-library-content"),
  RESEARCH("research_library_v2"),
  EXPERT_NOTE("expert_note_v1"),
  RESEARCH_EXTERNAL_CONTENT("research_external_content_v1"),
  CEO_DIRECTORY("ceo_directory_v1"),
  IP_MARKETPLACE("ip_marketplace_v1");

  private final String value;
}
