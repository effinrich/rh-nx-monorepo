package com.redesignhealth.company.api.config;

import com.redesignhealth.company.api.client.email.EmailSender;
import com.redesignhealth.company.api.client.email.NoopEmailSender;
import com.redesignhealth.company.api.client.email.SesEmailSender;
import com.redesignhealth.company.api.template.TemplateGenerator;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.sesv2.SesV2Client;

@Configuration
public class EmailConfig {

  @Bean
  @ConditionalOnProperty(name = "aws.enabled")
  public EmailSender sesEmailSender(
      @Value("${aws.region}") String awsRegion, TemplateGenerator templateGenerator) {
    return new SesEmailSender(
        SesV2Client.builder().region(Region.of(awsRegion)).build(), templateGenerator);
  }

  @Bean
  @ConditionalOnProperty(name = "aws.enabled", havingValue = "false", matchIfMissing = true)
  public EmailSender noopEmailSender() {
    return new NoopEmailSender();
  }
}
