package com.redesignhealth.company.api.security;

import java.util.Objects;

/** Reference a Json Web Token (JWT) */
public class JwtRef {

  private final String token;

  private JwtRef(String token) {
    this.token = token;
  }

  public static JwtRef of(String token) {
    return new JwtRef(token);
  }

  public String value() {
    return token;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) return true;
    if (o == null || getClass() != o.getClass()) return false;
    JwtRef jwtRef = (JwtRef) o;
    return token.equals(jwtRef.token);
  }

  @Override
  public int hashCode() {
    return Objects.hash(token);
  }
}
