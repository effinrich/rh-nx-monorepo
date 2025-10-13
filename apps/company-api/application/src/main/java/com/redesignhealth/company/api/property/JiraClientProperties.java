package com.redesignhealth.company.api.property;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties("jira")
public class JiraClientProperties {

  private final boolean enabled;
  private final String username;
  private final String apiKey;
  private final String host;

  public JiraClientProperties(boolean enabled, String username, String apiKey, String host) {
    this.enabled = enabled;
    this.username = username;
    this.apiKey = apiKey;
    this.host = host;
  }

  public boolean isEnabled() {
    return enabled;
  }

  public String getUsername() {
    return username;
  }

  public String getApiKey() {
    return apiKey;
  }

  public String getHost() {
    return host;
  }
}
