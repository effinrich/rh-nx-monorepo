package com.redesignhealth.company.api.entity.ref;

import com.redesignhealth.company.api.controller.util.Paths;
import com.redesignhealth.company.api.entity.Person;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.enums.ParameterIn;

/**
 * A key/ref that represents a {@link Person}.
 *
 * <p>This is useful for passing around the Person natural key without access to a Person object.
 * This fixes the issue of passing around a vanilla {@link String} email address and gives context
 * around what the email represents.
 *
 * <p>This also sanitizes the natural key on creation.
 */
public class PersonRef extends Ref {
  @Parameter(in = ParameterIn.PATH, name = Paths.EMAIL_PATH_VARIABLE)
  private final String email;

  // parameter name must be the same as path parameter to hydrate properly
  private PersonRef(String email) {
    this.email = email.toLowerCase();
  }

  public static PersonRef of(String email) {
    return new PersonRef(email);
  }

  @Override
  public String getColumnName() {
    return "email";
  }

  @Override
  public String value() {
    return email;
  }

  // Needed to resolve property for OpenAPI Definition file
  public String getEmail() {
    return email;
  }
}
