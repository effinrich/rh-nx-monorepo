package com.redesignhealth.company.api.config;

import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.googleapis.auth.oauth2.GooglePublicKeysManager;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.redesignhealth.company.api.expansion.StringToExpansionConverter;
import com.redesignhealth.company.api.security.GoogleJwtService;
import com.redesignhealth.company.api.security.JwtService;
import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.Collection;
import java.util.List;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.format.FormatterRegistry;
import org.springframework.http.MediaType;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.web.servlet.config.annotation.ContentNegotiationConfigurer;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

  /**
   * Receive application/json instead of application/hal+json if no Accept header is provided. The
   * application/json format is easier to consume for clients out of the box. spring-hateoas
   * defaults to application/hal+json.
   */
  @Override
  public void configureContentNegotiation(ContentNegotiationConfigurer configurer) {
    configurer.defaultContentType(MediaType.APPLICATION_JSON);
  }

  /**
   * TODO: figure out why Spring Boot configuration isn't being respected.
   *
   * <p>I want to apologize for anyone that runs into issues try to configure our {@link
   * ObjectMapper} only to find this note. Something is causing Spring to load two {@link
   * MappingJackson2HttpMessageConverters}s. One is picking up all of the changes from config via
   * properties files and @Bean module declarations but the other is not. I believe it's due to
   * Spring HATEOAS using a separate message converter for JSON, but haven't fully looked into it.
   * I'm giving up on the investigation for now. If you figure it out, feel free to delete this
   * method and leverage.
   *
   * <p>Bean: @Bean public Module hibernateModule() { new Hibernate5Module(); }
   *
   * <p>Property: spring.jackson.default-property-inclusion: non_null
   */
  @Override
  public void extendMessageConverters(List<HttpMessageConverter<?>> converters) {
    for (HttpMessageConverter converter : converters) {
      if (converter instanceof MappingJackson2HttpMessageConverter) {
        ObjectMapper mapper = ((MappingJackson2HttpMessageConverter) converter).getObjectMapper();
        mapper.setSerializationInclusion(Include.NON_NULL);
        // use ISO-8601
        mapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
      }
    }
  }

  @Override
  public void addFormatters(FormatterRegistry registry) {
    registry.addConverter(new StringToExpansionConverter());
    // Replace Spring's default behaviour of splitting query params on ","
    // Before:  q=1,2 resulted in List[0]=1, List[1]=2
    // After: q=1,2 results in List[0]=1,2
    // More info:
    // https://github.com/spring-projects/spring-framework/issues/23820#issuecomment-543087878
    registry.removeConvertible(String.class, Collection.class);
    registry.addConverter(String.class, Collection.class, List::of);
  }

  /** Manage caching and rotating public keys for Google APIs */
  @Bean
  public GooglePublicKeysManager googlePublicKeysManager()
      throws GeneralSecurityException, IOException {
    return new GooglePublicKeysManager(
        GoogleNetHttpTransport.newTrustedTransport(), GsonFactory.getDefaultInstance());
  }

  @Bean
  public JwtService jwtService(
      @Value("${google.app.allowList}") List<String> googleAppAllowList,
      GooglePublicKeysManager googlePublicKeysManager) {
    return new GoogleJwtService(
        new GoogleIdTokenVerifier.Builder(googlePublicKeysManager)
            .setAudience(googleAppAllowList)
            .build());
  }
}
