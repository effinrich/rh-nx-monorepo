package com.redesignhealth.company.api.assembler.google;

import com.redesignhealth.company.api.assembler.LinkGenerator;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.hateoas.Link;
import org.springframework.stereotype.Component;
import org.springframework.util.Assert;

@Component
public class GoogleDocsLinkGenerator implements LinkGenerator {
  private final String hostname;

  public GoogleDocsLinkGenerator(@Value("${google.docs.hostname}") String hostname) {
    this.hostname = hostname;
  }

  @Override
  public Link generate(String documentId) {
    Assert.notNull(documentId, "Document ID cannot be null");
    if (documentId.startsWith("https")) {
      return Link.of(documentId, "googleDocs");
    }
    return Link.of(hostname + "/document/d/" + documentId).withRel("googleDocs");
  }
}
