package com.redesignhealth.company.api.property;

import java.util.Map;
import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties("ip-marketplace-entity-converter")
public class IpMarketplaceConverter extends EntityConverter {
  public IpMarketplaceConverter(Map<String, String> apiToSearch) {
    super(apiToSearch);
  }
}
