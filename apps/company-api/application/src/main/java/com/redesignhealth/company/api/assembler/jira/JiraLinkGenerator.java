package com.redesignhealth.company.api.assembler.jira;

import com.redesignhealth.company.api.assembler.LinkGenerator;
import com.redesignhealth.company.api.property.JiraClientProperties;
import org.springframework.hateoas.Link;
import org.springframework.stereotype.Component;
import org.springframework.util.Assert;

@Component
public class JiraLinkGenerator implements LinkGenerator {
  private final JiraClientProperties jiraClientProperties;

  public JiraLinkGenerator(JiraClientProperties jiraClientProperties) {
    this.jiraClientProperties = jiraClientProperties;
  }

  @Override
  public Link generate(String jiraIssueId) {
    Assert.notNull(jiraIssueId, "Jira Issue ID cannot be null");
    return Link.of(jiraClientProperties.getHost() + "/browse/" + jiraIssueId).withRel("jiraTicket");
  }
}
