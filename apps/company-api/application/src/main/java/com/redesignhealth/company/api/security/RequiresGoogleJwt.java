package com.redesignhealth.company.api.security;

import static java.lang.annotation.ElementType.ANNOTATION_TYPE;
import static java.lang.annotation.ElementType.METHOD;
import static java.lang.annotation.ElementType.TYPE;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import java.lang.annotation.Inherited;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * Useful for OpenAPI generation
 *
 * <p>Adds GoogleID authentication header to requests
 *
 * <p>see: {@link OpenApiConfig} for more details
 */
@Target({METHOD, TYPE, ANNOTATION_TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Inherited
@SecurityRequirement(name = "GoogleID")
public @interface RequiresGoogleJwt {}
