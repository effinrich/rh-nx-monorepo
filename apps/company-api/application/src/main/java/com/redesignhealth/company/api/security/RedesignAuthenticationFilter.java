package com.redesignhealth.company.api.security;

import com.redesignhealth.company.api.entity.ref.PersonRef;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

public class RedesignAuthenticationFilter extends OncePerRequestFilter {
  private static final Logger logger = LoggerFactory.getLogger(RedesignAuthenticationFilter.class);

  private final AuthenticationManager authenticationManager;

  public static final String IMPERSONATION_HEADER = "RH-Impersonation-Email";
  public static final String GOOGLE_ACCESS_TOKEN_HEADER = "RH-Google-Access-Token";

  public RedesignAuthenticationFilter(AuthenticationManager authenticationManager) {
    this.authenticationManager = authenticationManager;
  }

  @Override
  protected void doFilterInternal(
      HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
      throws ServletException, IOException {
    final String header = request.getHeader(HttpHeaders.AUTHORIZATION);

    if (!StringUtils.hasText(header) || !header.startsWith("Bearer ")) {
      filterChain.doFilter(request, response);
      return;
    }
    JwtRef jwt = JwtRef.of(header.split(" ")[1]);
    final String impersonationHeader = request.getHeader(IMPERSONATION_HEADER);
    PersonRef impersonation =
        impersonationHeader != null ? PersonRef.of(impersonationHeader) : null;

    try {
      SecurityContextHolder.getContext()
          .setAuthentication(
              this.authenticationManager.authenticate(JwtAuthentication.of(jwt, impersonation)));
    } catch (Exception e) {
      logger.error("Issue authenticating jwt", e);
    }

    filterChain.doFilter(request, response);
  }
}
