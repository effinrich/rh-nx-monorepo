package com.redesignhealth.company.api.security;

import java.util.Map;
import java.util.Optional;

public interface JwtService {

  /**
   * Verify token and return JWT payload
   *
   * @param jwt encoded string
   * @return {@code Optional.empty()} if verification failed, {@code Optional.of(payload)} if
   *     success
   */
  Optional<Map<String, Object>> verify(JwtRef jwt);
}
