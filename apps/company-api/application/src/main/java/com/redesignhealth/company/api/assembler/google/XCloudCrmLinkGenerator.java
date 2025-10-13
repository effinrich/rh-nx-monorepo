package com.redesignhealth.company.api.assembler.google;

import com.redesignhealth.company.api.assembler.LinkGenerator;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.hateoas.Link;
import org.springframework.stereotype.Component;

/** Link to Salesforce Experience Cloud instance hosted by RH Enterprise Growth */
@Component
public class XCloudCrmLinkGenerator implements LinkGenerator {
  private final String xCloudUrl;

  public XCloudCrmLinkGenerator(@Value("${xcloud.url}") String xCloudUrl) {
    this.xCloudUrl = xCloudUrl;
  }

  @Override
  /**
   * Note: For the moment, the XCloud URL is actually constant across companies. It doesn't matter
   * what id you pass in.
   */
  public Link generate(String anyString) {
    return Link.of(xCloudUrl).withRel("xCloud");
  }
}
