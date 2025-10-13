package com.redesignhealth.company.api.property;

import java.util.Map;
import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties("ceo-directory-entity-converter")
public class CeoDirectoryConverter extends EntityConverter {
  public CeoDirectoryConverter(Map<String, String> apiToSearch) {
    super(apiToSearch);
  }
}
