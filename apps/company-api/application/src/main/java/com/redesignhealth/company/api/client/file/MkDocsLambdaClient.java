package com.redesignhealth.company.api.client.file;

import com.redesignhealth.company.api.exception.UnsupportedMimeTypeException;
import org.springframework.http.MediaType;
import org.springframework.util.MimeType;
import org.springframework.util.MimeTypeUtils;
import org.springframework.web.reactive.function.client.WebClient;

/** Wrapper around MkDocs Html Service hosted on an AWS Lambda. */
public class MkDocsLambdaClient implements RemoteFileClient {
  private final WebClient client;
  private final int HTML_DOCUMENT_MAX_MEMORY = 500 * 1024; // 500kb

  public MkDocsLambdaClient(String hostname) {
    client =
        WebClient.builder()
            .baseUrl(hostname)
            .codecs(codec -> codec.defaultCodecs().maxInMemorySize(HTML_DOCUMENT_MAX_MEMORY))
            .build();
  }

  public String getDocument(String id, MimeType mimeType) {
    if (MimeTypeUtils.TEXT_HTML.equals(mimeType)) {
      return client
          .get()
          .uri(uri -> uri.queryParam("html", "true").queryParam("docId", id).build())
          .exchangeToMono(r -> r.bodyToMono(String.class))
          .block();
    }

    if (MimeTypeUtils.TEXT_PLAIN.equals(mimeType)) {
      return client
          .get()
          .uri(uri -> uri.queryParam("html", "true").queryParam("docId", id).build())
          .accept(MediaType.TEXT_PLAIN)
          .exchangeToMono(r -> r.bodyToMono(String.class))
          .block();
    }

    throw new UnsupportedMimeTypeException(mimeType);
  }
}
