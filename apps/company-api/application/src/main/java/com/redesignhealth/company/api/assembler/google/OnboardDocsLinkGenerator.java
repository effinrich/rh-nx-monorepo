package com.redesignhealth.company.api.assembler.google;

import com.redesignhealth.company.api.assembler.LinkGenerator;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.hateoas.Link;
import org.springframework.stereotype.Component;
import org.springframework.util.Assert;

/**
 * Link to company onboard documentation in an external cloud. This could be S3, GDrive, Dropbox
 * etc.
 */
@Component
public class OnboardDocsLinkGenerator implements LinkGenerator {
  private static final String GOOGLE_DRIVE_FOLDER_PATH = "/drive/u/0/folders/";
  private final String hostname;

  public OnboardDocsLinkGenerator(@Value("${google.drive.hostname}") String hostname) {
    this.hostname = hostname;
  }

  @Override
  public Link generate(String folderId) {
    Assert.notNull(folderId, "Folder ID cannot be null");
    return Link.of(hostname + GOOGLE_DRIVE_FOLDER_PATH + folderId).withRel("onboardDocs");
  }
}
