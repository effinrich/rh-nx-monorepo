package com.redesignhealth.company.api.security;

import com.redesignhealth.company.api.entity.ref.PersonRef;
import java.util.Collection;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.util.Assert;

/**
 * Authentication object alternative to default {@link
 * org.springframework.security.authentication.UsernamePasswordAuthenticationToken} The default
 * authentication object contained unnecessary fields like username/password information. When a
 * token is authenticated the JWT value is removed.
 */
public class JwtAuthentication implements Authentication {

  private final JwtRef ref;
  private RedesignUserDetails userDetails;
  private PersonRef impersonationRequest;
  private boolean authenticated;

  private JwtAuthentication(JwtRef ref, PersonRef impersonationRequest) {
    this.ref = ref;
    this.authenticated = false;
    this.impersonationRequest = impersonationRequest;
  }

  public JwtAuthentication(RedesignUserDetails userDetails) {
    this.ref = JwtRef.of("REDACTED");
    this.userDetails = userDetails;
    this.authenticated = true;
    this.impersonationRequest = null;
  }

  public static JwtAuthentication of(JwtRef ref) {
    return new JwtAuthentication(ref, null);
  }

  public static JwtAuthentication of(JwtRef ref, PersonRef impersonationRequest) {
    return new JwtAuthentication(ref, impersonationRequest);
  }

  public JwtRef getRef() {
    return ref;
  }

  @Override
  public Collection<? extends GrantedAuthority> getAuthorities() {
    return userDetails.getAuthorities();
  }

  @Override
  public Object getCredentials() {
    return ref;
  }

  @Override
  public Object getDetails() {
    return null;
  }

  @Override
  public Object getPrincipal() {
    return userDetails;
  }

  @Override
  public boolean isAuthenticated() {
    return authenticated;
  }

  @Override
  public void setAuthenticated(boolean isAuthenticated) throws IllegalArgumentException {
    Assert.isTrue(!isAuthenticated, "Cannot set this token to trusted - use constructor instead");
    authenticated = false;
  }

  @Override
  public String getName() {
    return userDetails.getUsername();
  }

  public PersonRef getImpersonationRequest() {
    return impersonationRequest;
  }
}
