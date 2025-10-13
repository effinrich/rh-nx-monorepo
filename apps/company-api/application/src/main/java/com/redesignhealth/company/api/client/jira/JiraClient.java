package com.redesignhealth.company.api.client.jira;

import com.redesignhealth.jira.rest.client.model.Attachment;
import com.redesignhealth.jira.rest.client.model.CreatedIssue;
import java.util.List;
import reactor.core.publisher.Mono;

public interface JiraClient {
  /**
   * More info:
   * https://developer.atlassian.com/cloud/jira/platform/rest/v2/api-group-issues/#api-rest-api-2-issue-post
   */
  Mono<CreatedIssue> createIssue(CreateIssueRequest request);

  /**
   * More info:
   * https://developer.atlassian.com/cloud/jira/platform/rest/v2/api-group-issue-attachments/#api-rest-api-2-issue-issueidorkey-attachments-post
   */
  Mono<List<Attachment>> attachFilesToIssue(
      String issueKey, List<FileAwareByteArrayResource> files);
}
