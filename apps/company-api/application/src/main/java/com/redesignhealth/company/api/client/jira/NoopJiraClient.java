package com.redesignhealth.company.api.client.jira;

import com.redesignhealth.jira.rest.client.model.Attachment;
import com.redesignhealth.jira.rest.client.model.CreatedIssue;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import reactor.core.publisher.Mono;

public class NoopJiraClient implements JiraClient {

  Logger logger = LoggerFactory.getLogger(NoopJiraClient.class);

  @Override
  public Mono<CreatedIssue> createIssue(CreateIssueRequest request) {
    logger.info(
        "Mocked call to create Jira issue. Enable Jira interactions through 'jira.enabled' property.");
    return Mono.just(new CreatedIssue());
  }

  @Override
  public Mono<List<Attachment>> attachFilesToIssue(
      String issueKey, List<FileAwareByteArrayResource> files) {
    logger.info(
        "Mocked call to attach files to Jira issue. Enable Jira interactions through 'jira.enabled' property.");
    return Mono.just(List.of());
  }
}
