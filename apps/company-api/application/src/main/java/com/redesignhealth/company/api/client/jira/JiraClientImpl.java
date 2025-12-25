package com.redesignhealth.company.api.client.jira;

import com.redesignhealth.company.api.exception.InvalidJiraCredentialsException;
import com.redesignhealth.company.api.exception.JiraClientException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.client.MultipartBodyBuilder;
import org.springframework.web.reactive.function.client.ClientResponse;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

public class JiraClientImpl implements JiraClient {

  private final WebClient client;

  public JiraClientImpl(WebClient client) {
    this.client = client;
  }

  public Mono<IssueCreated> createIssue(CreateIssueRequest request) {

    Map<String, Object> fields = new HashMap<>();
    Map<String, Object> issuetype = new HashMap<>();
    issuetype.put("id", request.getIssuetype());
    fields.put("issuetype", issuetype);
    if (request.getProject() != null) {
      Map<String, Object> project = new HashMap<>();
      project.put("id", request.getProject());
      fields.put("project", project);
    }
    if (request.getParentIssue() != null) {
      Map<String, Object> parent = new HashMap<>();
      parent.put("key", request.getParentIssue());
      fields.put("parent", parent);
    }
    if (request.getLabels() != null) {
      fields.put("labels", request.getLabels());
    }
    fields.put("summary", request.getSummary());
    fields.put("description", request.getDescription());

    // add custom key/values
    // avoid using this if it's a common supported jira field
    // this is meant to give flexibility for custom fields on issue types
    if (request.getAdditionalFields() != null) {
      fields.putAll(request.getAdditionalFields());
    }
    Map<String, Object> body = new HashMap<>();
    body.put("fields", fields);

    return client
        .post()
        .uri("/rest/api/2/issue")
        .bodyValue(body)
        .exchangeToMono(response -> handleResponse(response, IssueCreated.class));
  }

  @Override
  public Mono<List<Attachment>> attachFilesToIssue(
      String issueKey, List<FileAwareByteArrayResource> files) {
    MultipartBodyBuilder builder = new MultipartBodyBuilder();
    files.forEach((file) -> builder.part("file", file));

    return client
        .post()
        .uri("/rest/api/2/issue/" + issueKey + "/attachments")
        .header("X-Atlassian-Token", "no-check")
        .contentType(MediaType.MULTIPART_FORM_DATA)
        .bodyValue(builder.build())
        .exchangeToMono(
            response ->
                handleResponse(response, new ParameterizedTypeReference<List<Attachment>>() {}));
  }

  private <T> Mono<T> handleResponse(ClientResponse response, ParameterizedTypeReference<T> type) {
    return handleError(response).flatMap((r) -> r.bodyToMono(type));
  }

  private <T> Mono<T> handleResponse(ClientResponse response, Class<T> clazz) {
    return handleError(response).flatMap((r) -> r.bodyToMono(clazz));
  }

  private Mono<ClientResponse> handleError(ClientResponse response) {
    if (response.statusCode() == HttpStatus.UNAUTHORIZED) {
      // Jira returns plain text for 401s when the provided API Key is incorrect or
      // missing. It reports Basic Auth is deprecated, and recommends using API Keys.
      // Unfortunately API Keys leverages basic auth and Jira can't tell if you are
      // providing a password or an API Key.
      //
      // Message in API Response:
      // "Basic authentication with passwords is deprecated. For more information, see:
      // https://developer.atlassian.com/cloud/confluence/deprecation-notice-basic-auth/"
      return Mono.error(new InvalidJiraCredentialsException());
    }
    if (response.statusCode().is4xxClientError()) {
      return response
          .bodyToMono(ErrorCollection.class)
          .flatMap(errors -> Mono.error(new JiraClientException(errors)));
    }
    return Mono.just(response);
  }
}
