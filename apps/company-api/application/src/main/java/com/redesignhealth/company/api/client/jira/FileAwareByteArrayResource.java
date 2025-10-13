package com.redesignhealth.company.api.client.jira;

import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.codec.multipart.MultipartHttpMessageWriter;
import org.springframework.web.reactive.function.client.WebClient;

/**
 * Bum bum bum... multipart/form-data requests with {@link WebClient} and the lower level {@link
 * MultipartHttpMessageWriter} requires files be of type {@link Resource} and implement getFilename.
 * The only in memory {@link ByteArrayResource} does not implement getFilename. This extension is a
 * workaround until Spring adds support for getFilename.
 */
public class FileAwareByteArrayResource extends ByteArrayResource {

  private final String filename;

  public FileAwareByteArrayResource(String filename, byte[] byteArray) {
    super(byteArray);
    this.filename = filename;
  }

  @Override
  public String getFilename() {
    return filename;
  }
}
