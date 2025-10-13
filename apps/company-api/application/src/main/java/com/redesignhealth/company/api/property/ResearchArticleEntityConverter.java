package com.redesignhealth.company.api.property;

import java.util.Map;
import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties("research-external-content-converter")
public class ResearchArticleEntityConverter extends EntityConverter {
  public ResearchArticleEntityConverter(Map<String, String> apiToSearch) {
    super(apiToSearch);
  }
}
