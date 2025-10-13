package com.redesignhealth.company.api.openapi;

import static com.redesignhealth.company.api.config.OpenApiConfig.GOOGLE_ID_SCHEME;
import static com.redesignhealth.company.api.config.OpenApiConfig.IMPERSONATION_EMAIL_SCHEME;
import static java.lang.annotation.ElementType.ANNOTATION_TYPE;
import static java.lang.annotation.ElementType.METHOD;
import static java.lang.annotation.ElementType.TYPE;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.security.SecurityRequirements;
import java.lang.annotation.Inherited;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * Useful for OpenAPI generation
 *
 * <p>Automatically add headers to requests
 *
 * <p>see: {@link com.redesignhealth.company.api.config.OpenApiConfig} for more details
 */
@Target({METHOD, TYPE, ANNOTATION_TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Inherited
@SecurityRequirements(
    value = {
      @SecurityRequirement(name = GOOGLE_ID_SCHEME),
      @SecurityRequirement(name = IMPERSONATION_EMAIL_SCHEME)
    })
public @interface IncludeSecurityHeaders {}
