package com.redesignhealth.company.api.client.message;

import com.redesignhealth.jira.rest.client.model.Changelog;
import com.redesignhealth.jira.rest.client.model.IssueBean;

/**
 * Represents a Webhook response from Jira More info:
 * https://developer.atlassian.com/server/jira/platform/webhooks/#executing-a-webhook
 */
public class JiraWebhookPayload {
  private IssueBean issue;
  private Changelog changelog;

  public IssueBean getIssue() {
    return issue;
  }

  public Changelog getChangelog() {
    return changelog;
  }
}
