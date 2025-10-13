package com.redesignhealth.company.api;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.redesignhealth.company.api.property.CeoDirectoryConverter;
import com.redesignhealth.company.api.property.ExpertNoteEntityConverter;
import com.redesignhealth.company.api.property.IpMarketplaceConverter;
import com.redesignhealth.company.api.property.JiraClientProperties;
import com.redesignhealth.company.api.property.JiraRequestProperties;
import com.redesignhealth.company.api.property.ResearchArticleEntityConverter;
import com.redesignhealth.company.api.property.ResearchEntityConverter;
import com.redesignhealth.company.api.property.RocketChatSellerCredentials;
import com.redesignhealth.company.api.taxonomy.CompanyTaxonomy;
import com.redesignhealth.property.AwsSecretsManagerPropertySource;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.scheduling.annotation.EnableScheduling;
import software.amazon.awssdk.regions.Region;

@SpringBootApplication
@EnableScheduling
@EnableConfigurationProperties({
  JiraRequestProperties.class,
  JiraClientProperties.class,
  ResearchEntityConverter.class,
  ExpertNoteEntityConverter.class,
  CompanyTaxonomy.class,
  ResearchArticleEntityConverter.class,
  CeoDirectoryConverter.class,
  IpMarketplaceConverter.class,
  RocketChatSellerCredentials.class
})
public class Application {

  public static void main(String[] args) {
    new SpringApplicationBuilder()
        .sources(Application.class)
        .initializers(
            context -> {
              // initialize secrets before beans are initialize and reference them through
              // properties
              var env = context.getEnvironment();
              var secretId = env.getProperty("aws.secret.name");
              var region = env.getProperty("aws.region", "us-east-1");
              AwsSecretsManagerPropertySource propertySource =
                  new AwsSecretsManagerPropertySource(
                      secretId, Region.of(region), new ObjectMapper());
              env.getPropertySources().addLast(propertySource);
            })
        .run(args);
  }
}
