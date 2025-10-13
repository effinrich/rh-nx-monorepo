package com.redesignhealth.company.api.property;

import java.util.Map;
import lombok.Getter;
import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties("research-entity-converter")
@Getter
public class ResearchEntityConverter extends EntityConverter {
  public ResearchEntityConverter(Map<String, String> apiToSearch) {
    super(apiToSearch);
  }
}
