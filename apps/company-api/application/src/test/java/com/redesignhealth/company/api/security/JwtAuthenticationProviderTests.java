package com.redesignhealth.company.api.security;

import static com.redesignhealth.company.api.entity.request.RoleAuthority.*;
import static com.redesignhealth.company.api.expansion.Expansion.*;
import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

import com.redesignhealth.company.api.entity.Person;
import com.redesignhealth.company.api.entity.ref.PersonRef;
import com.redesignhealth.company.api.repository.PersonRepository;
import com.redesignhealth.company.api.service.RedesignUserDetailsService;
import java.util.Map;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;

@ExtendWith(MockitoExtension.class)
class JwtAuthenticationProviderTests {

  @Mock private JwtService jwtService;

  @Mock private PersonRepository personRepository;

  private AuthenticationProvider authenticationProvider;

  private static final JwtAuthentication requestedJwt = JwtAuthentication.of(JwtRef.of("token"));
  private static final PersonRef email = PersonRef.of("test@redesignhealth.com");

  @BeforeEach
  public void setup() {
    authenticationProvider =
        new JwtAuthenticationProvider(jwtService, new RedesignUserDetailsService(personRepository));
  }

  @Test
  public void testAuthenticate_throwsOnExpiredJwt() {
    when(jwtService.verify(requestedJwt.getRef())).thenReturn(Optional.empty());

    Exception e =
        assertThrows(
            AuthenticationException.class, () -> authenticationProvider.authenticate(requestedJwt));

    assertThat(e.getMessage()).isEqualTo("JWT failed verification");
  }

  @Test
  public void testAuthenticate_throwsOnJwtWithoutEmail() {
    when(jwtService.verify(requestedJwt.getRef())).thenReturn(Optional.of(Map.of()));

    Exception e =
        assertThrows(
            AuthenticationException.class, () -> authenticationProvider.authenticate(requestedJwt));

    assertThat(e.getMessage()).isEqualTo("\"email\" field missing in JWT");
  }

  @Test
  public void testAuthenticate_throwsWhenEmailNotInSystem() {
    when(jwtService.verify(requestedJwt.getRef()))
        .thenReturn(Optional.of(Map.of("email", email.value())));
    when(personRepository.findByEmail(email, MEMBER_OF)).thenReturn(Optional.empty());

    Exception e =
        assertThrows(
            AuthenticationException.class, () -> authenticationProvider.authenticate(requestedJwt));

    assertThat(e.getMessage())
        .isEqualTo("Person test@redesignhealth.com does not exist in our system");
  }

  @Test
  public void testAuthenticate_authenticates() {
    when(jwtService.verify(requestedJwt.getRef()))
        .thenReturn(Optional.of(Map.of("email", "test@redesignhealth.com")));
    when(personRepository.findByEmail(email, MEMBER_OF))
        .thenReturn(Optional.of(Person.from(email)));

    var auth = authenticationProvider.authenticate(requestedJwt);
    assertThat(auth.isAuthenticated()).isTrue();
    assertThat(auth.getName()).isEqualTo(email.value());
    assertThat(auth.getCredentials()).isEqualTo(JwtRef.of("REDACTED"));

    var user = (UserDetails) auth.getPrincipal();
    assertThat(user.getUsername()).isEqualTo(email.value());
  }

  @Test
  public void testAuthenticate_authenticatesImpersonation() {

    var personMakingRequest = Person.from(email);
    personMakingRequest.setRole(ROLE_SUPER_ADMIN);
    var impersonation = Person.from(PersonRef.of("other@redesignhealth.com"));
    when(personRepository.findByEmail(personMakingRequest.getEmail(), MEMBER_OF))
        .thenReturn(Optional.of(personMakingRequest));
    when(personRepository.findByEmail(impersonation.getEmail(), MEMBER_OF))
        .thenReturn(Optional.of(impersonation));

    var jwt = JwtAuthentication.of(JwtRef.of("token"), impersonation.getEmail());

    when(jwtService.verify(jwt.getRef()))
        .thenReturn(Optional.of(Map.of("email", personMakingRequest.getEmail().value())));

    var auth = authenticationProvider.authenticate(jwt);
    assertThat(auth.isAuthenticated()).isTrue();
    assertThat(auth.getName()).isEqualTo("other@redesignhealth.com");
    assertThat(auth.getCredentials()).isEqualTo(JwtRef.of("REDACTED"));

    var user = (UserDetails) auth.getPrincipal();
    assertThat(user.getUsername()).isEqualTo("other@redesignhealth.com");
    assertThat(user.getAuthorities().isEmpty()).isTrue();
  }

  @Test
  public void testAuthenticate_failsImpersonation() {
    var personMakingRequest = Person.from(email);
    personMakingRequest.setRole(ROLE_RH_ADMIN);
    var impersonation = Person.from(PersonRef.of("other@redesignhealth.com"));
    when(personRepository.findByEmail(personMakingRequest.getEmail(), MEMBER_OF))
        .thenReturn(Optional.of(personMakingRequest));

    var jwt = JwtAuthentication.of(JwtRef.of("token"), impersonation.getEmail());

    when(jwtService.verify(jwt.getRef()))
        .thenReturn(Optional.of(Map.of("email", personMakingRequest.getEmail().value())));

    Exception e =
        assertThrows(AuthenticationException.class, () -> authenticationProvider.authenticate(jwt));

    assertThat(e.getMessage())
        .isEqualTo("Cannot impersonate other@redesignhealth.com with this level of access");
  }
}
