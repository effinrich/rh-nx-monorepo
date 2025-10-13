package com.redesignhealth.company.api.security;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.redesignhealth.company.api.entity.Person;
import com.redesignhealth.company.api.entity.ref.PersonRef;
import jakarta.servlet.FilterChain;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpHeaders;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

@ExtendWith(MockitoExtension.class)
public class RedesignAuthenticationFilterTests {

  private RedesignAuthenticationFilter filter;
  private MockHttpServletRequest request;
  private MockHttpServletResponse response;
  @Mock private FilterChain filterChain;
  @Mock private AuthenticationManager authenticationManager;

  @BeforeEach
  public void setup() {
    filter = new RedesignAuthenticationFilter(authenticationManager);
    request = new MockHttpServletRequest();
    response = new MockHttpServletResponse();
  }

  @AfterEach
  public void postTest() throws Exception {
    // the filter chain should always be called within the filter
    verify(filterChain).doFilter(request, response);
    // reset security context
    SecurityContextHolder.clearContext();
  }

  @Test
  void testDoFilterInternal_authHeaderMissing() throws Exception {
    request.removeHeader(HttpHeaders.AUTHORIZATION);

    filter.doFilter(request, response, filterChain);

    assertNull(SecurityContextHolder.getContext().getAuthentication());
  }

  @Test
  void testDoFilterInternal_authHeaderNotBearer() throws Exception {
    request.addHeader(HttpHeaders.AUTHORIZATION, "Basic secret");

    filter.doFilter(request, response, filterChain);

    assertNull(SecurityContextHolder.getContext().getAuthentication());
  }

  @Test
  void testDoFilterInternal_authFailure() throws Exception {
    when(authenticationManager.authenticate(any())).thenThrow(RuntimeException.class);
    request.addHeader(HttpHeaders.AUTHORIZATION, "Bearer secret");
    filter.doFilter(request, response, filterChain);
    assertNull(SecurityContextHolder.getContext().getAuthentication());
  }

  @Test
  void testDoFilterInternal_authSuccess() throws Exception {
    when(authenticationManager.authenticate(any()))
        .thenReturn(
            new JwtAuthentication(
                RedesignUserDetails.from(Person.from(PersonRef.of("test@redesignhealth.com")))));
    request.addHeader(HttpHeaders.AUTHORIZATION, "Bearer secret");

    filter.doFilter(request, response, filterChain);

    UserDetails user =
        (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    assertEquals("test@redesignhealth.com", user.getUsername());
  }
}
