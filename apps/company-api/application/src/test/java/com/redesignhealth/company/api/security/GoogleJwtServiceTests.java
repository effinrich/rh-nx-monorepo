package com.redesignhealth.company.api.security;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.mockito.Mockito.when;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken.Payload;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import java.io.IOException;
import java.security.GeneralSecurityException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
public class GoogleJwtServiceTests {

  @Mock private GoogleIdTokenVerifier verifier;

  private JwtService jwtService;

  @BeforeEach
  public void setup() {
    jwtService = new GoogleJwtService(verifier);
  }

  @Test
  public void testVerify_expiredToken() throws GeneralSecurityException, IOException {
    when(verifier.verify("expired.token")).thenReturn(null);
    assertFalse(jwtService.verify(JwtRef.of("expired.token")).isPresent());
  }

  @Test
  public void testVerify_expiredCerts() throws GeneralSecurityException, IOException {
    when(verifier.verify("token")).thenThrow(GeneralSecurityException.class);
    assertFalse(jwtService.verify(JwtRef.of("token")).isPresent());
  }

  @Test
  public void testVerify_malformedJwt() throws GeneralSecurityException, IOException {
    when(verifier.verify("malformedToken")).thenThrow(IOException.class);
    assertFalse(jwtService.verify(JwtRef.of("malformedToken")).isPresent());
  }

  @Test
  public void testVerify_validJwt() throws GeneralSecurityException, IOException {
    GoogleIdToken parsedToken = Mockito.mock(GoogleIdToken.class);
    Payload payload = Mockito.mock(Payload.class);
    when(parsedToken.getPayload()).thenReturn(payload);
    when(verifier.verify("valid.token")).thenReturn(parsedToken);

    assertThat(jwtService.verify(JwtRef.of("valid.token")).get()).isEqualTo(payload);
  }
}
