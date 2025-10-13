package com.redesignhealth.company.api.property;

import java.util.Map;
import lombok.Getter;
import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties("expert-note-entity-converter")
@Getter
public class ExpertNoteEntityConverter extends EntityConverter {
  public ExpertNoteEntityConverter(Map<String, String> apiToSearch) {
    super(apiToSearch);
  }
}
