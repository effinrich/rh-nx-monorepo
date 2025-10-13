package com.redesignhealth.company.api.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.redesignhealth.company.api.client.message.JiraIssueMessageClient;
import com.redesignhealth.company.api.client.message.MessageClient;
import com.redesignhealth.company.api.client.message.NoopMessageClient;
import com.redesignhealth.company.api.dto.command.InfraRequestCommand;
import com.redesignhealth.company.api.property.JiraRequestProperties;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.sqs.SqsClient;

@Configuration
public class MessagingConfig {

  @Bean
  @ConditionalOnProperty(name = "aws.enabled")
  public MessageClient<InfraRequestCommand> jiraIssueMessageClient(
      @Value("${aws.region}") String awsRegion,
      @Value("${aws.sqs.jiraIssueQueue}") String jiraIssueQueue,
      ObjectMapper objectMapper,
      JiraRequestProperties properties) {
    return new JiraIssueMessageClient(
        SqsClient.builder().region(Region.of(awsRegion)).build(),
        jiraIssueQueue,
        objectMapper,
        properties);
  }

  @Bean
  @ConditionalOnProperty(name = "aws.enabled", havingValue = "false", matchIfMissing = true)
  MessageClient<InfraRequestCommand> noopJiraIssueMessageclient() {
    return new NoopMessageClient<>();
  }
}
