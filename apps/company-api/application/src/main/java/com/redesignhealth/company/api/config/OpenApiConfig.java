package com.redesignhealth.company.api.config;

import static com.redesignhealth.company.api.security.RedesignAuthenticationFilter.IMPERSONATION_HEADER;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.security.SecurityScheme.Type;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

  public static final String GOOGLE_ID_SCHEME = "Google ID";
  public static final String IMPERSONATION_EMAIL_SCHEME = "Impersonation Email";

  @Bean
  public OpenAPI customOpenApi(@Value("${build.version}") String version) {
    return new OpenAPI()
        .info(
            new Info()
                .title("Company API")
                .version(version)
                .contact(new Contact().name("Product & Engineering")))
        .components(
            new Components()
                .addSecuritySchemes(
                    GOOGLE_ID_SCHEME,
                    new io.swagger.v3.oas.models.security.SecurityScheme()
                        .type(Type.HTTP)
                        .bearerFormat("JWT")
                        .scheme("bearer")
                        .description("Authorize with Google ID JWT"))
                .addSecuritySchemes(
                    IMPERSONATION_EMAIL_SCHEME,
                    new io.swagger.v3.oas.models.security.SecurityScheme()
                        .type(Type.APIKEY)
                        .in(SecurityScheme.In.HEADER)
                        .name(IMPERSONATION_HEADER)
                        .description("Impersonate another person.")));
  }

  // when we have more endpoints in v2 we will uncomment this code block
  // @Bean
  // public GroupedOpenApi apiV1() {
  //  return GroupedOpenApi.builder().group("v1").pathsToExclude("/**/v2/**").build();
  // }

  // @Bean
  // public GroupedOpenApi apiV2() {
  //  return GroupedOpenApi.builder().group("v2").pathsToMatch("/**/v2/**").build();
  // }

}
