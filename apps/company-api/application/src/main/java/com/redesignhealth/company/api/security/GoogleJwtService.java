package com.redesignhealth.company.api.security;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.Map;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Google ID implementation for verifying JWTs. Verification requirements found here: <a
 * href="https://developers.google.com/identity/gsi/web/guides/verify-google-id-token">Verify Google
 * ID Token</a>
 */
public class GoogleJwtService implements JwtService {

  private static final Logger logger = LoggerFactory.getLogger(GoogleJwtService.class);
  private final GoogleIdTokenVerifier verifier;

  public GoogleJwtService(GoogleIdTokenVerifier verifier) {
    this.verifier = verifier;
  }

  public Optional<Map<String, Object>> verify(JwtRef jwt) {
    try {
      var idToken = verifier.verify(jwt.value());
      if (null == idToken) {
        logger.info("Verification failed for jwt {}", jwt);
        return Optional.empty();
      }
      return Optional.of(idToken.getPayload());
    } catch (GeneralSecurityException e) {
      logger.warn("Unable to verify signature on token: {}", e.getMessage());
    } catch (IOException e) {
      logger.warn("Unable to parse token payload: {}", e.getMessage());
    }
    return Optional.empty();
  }
}
