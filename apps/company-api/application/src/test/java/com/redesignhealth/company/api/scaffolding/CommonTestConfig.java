package com.redesignhealth.company.api.scaffolding;

import static org.springframework.restdocs.operation.preprocess.Preprocessors.prettyPrint;

import com.redesignhealth.company.api.assembler.google.OnboardDocsLinkGenerator;
import com.redesignhealth.company.api.assembler.google.XCloudCrmLinkGenerator;
import com.redesignhealth.company.api.assembler.jira.JiraLinkGenerator;
import com.redesignhealth.company.api.config.SecurityConfig;
import com.redesignhealth.company.api.property.ExpertNoteEntityConverter;
import com.redesignhealth.company.api.property.JiraClientProperties;
import com.redesignhealth.company.api.property.ResearchEntityConverter;
import com.redesignhealth.company.api.security.AuthChecksService;
import com.redesignhealth.company.api.service.RedesignUserDetailsService;
import com.redesignhealth.company.api.taxonomy.CompanyTaxonomy;
import org.mockito.Mockito;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.boot.test.autoconfigure.restdocs.RestDocsMockMvcConfigurationCustomizer;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;

@TestConfiguration
@Import({SecurityConfig.class})
@EnableConfigurationProperties({
  ResearchEntityConverter.class,
  ExpertNoteEntityConverter.class,
  CompanyTaxonomy.class
})
public class CommonTestConfig {
  @Bean
  public RedesignUserDetailsService redesignUserDetailsService() {
    return Mockito.mock(RedesignUserDetailsService.class);
  }

  @Bean
  public JiraLinkGenerator jiraLinkGenerator() {
    return new JiraLinkGenerator(
        new JiraClientProperties(
            true, "test@example.com", "REDACTED", "https://redesignhealth.atlassian.net"));
  }

  @Bean
  public OnboardDocsLinkGenerator onboardDocsLinkGenerator() {
    return new OnboardDocsLinkGenerator("https://example.com");
  }

  @Bean
  public XCloudCrmLinkGenerator xCloudCrmLinkGenerator() {
    return new XCloudCrmLinkGenerator("https://example.com");
  }

  @Bean
  public RestDocsMockMvcConfigurationCustomizer configurer() {
    return c ->
        c.operationPreprocessors()
            .withRequestDefaults(prettyPrint())
            .withResponseDefaults(prettyPrint());
  }

  @Bean
  public AuthChecksService authChecks() {
    return new AuthChecksService();
  }
}
