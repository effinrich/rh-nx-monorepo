package com.redesignhealth.company.api.property;

import java.util.HashMap;
import java.util.Map;
import lombok.Getter;

@Getter
public class EntityConverter {
  private final Map<String, String> apiToSearch;
  private final Map<String, String> searchToApi;

  public EntityConverter(Map<String, String> apiToSearch) {
    this.apiToSearch = apiToSearch;
    this.searchToApi = new HashMap<>();
    for (var entry : apiToSearch.entrySet()) {
      searchToApi.put(entry.getValue(), entry.getKey());
    }
  }
}
