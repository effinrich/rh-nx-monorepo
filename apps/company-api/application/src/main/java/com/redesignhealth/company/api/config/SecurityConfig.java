package com.redesignhealth.company.api.config;

import static org.springframework.security.config.Customizer.withDefaults;

import com.redesignhealth.company.api.entity.request.RoleAuthority;
import com.redesignhealth.company.api.security.RedesignAuthenticationFilter;
import java.util.List;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableMethodSecurity(jsr250Enabled = true)
public class SecurityConfig {

  @Value("${cors.allowedOriginPatterns}")
  public List<String> allowedOriginPatterns;

  @Value("${cors.allowedMethods}")
  public List<String> allowedMethods;

  @Value("${cors.allowedHeaders}")
  public List<String> allowedHeaders;

  @Bean
  public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http.sessionManagement(
        sessionAuthenticationStrategy ->
            sessionAuthenticationStrategy.sessionCreationPolicy(SessionCreationPolicy.STATELESS));
    http.csrf(AbstractHttpConfigurer::disable);
    http.cors(withDefaults());

    http.authorizeHttpRequests(
        request -> {
          request
              .requestMatchers("/public/**", "/", "/actuator/**", "/error/**")
              .permitAll()
              .requestMatchers("/admin/**")
              .hasRole(RoleAuthority.ROLE_SUPER_ADMIN.name().replace("ROLE_", ""))
              .requestMatchers("/**")
              .authenticated();
        });
    http.exceptionHandling(
        config ->
            config.authenticationEntryPoint(new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED)));
    http.apply(new SecurityFilterConfigurer());

    return http.build();
  }

  @Bean
  public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();
    configuration.setAllowedOriginPatterns(allowedOriginPatterns);
    configuration.setAllowedMethods(allowedMethods);
    configuration.setAllowedHeaders(allowedHeaders);
    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", configuration);
    return source;
  }

  // Needed to register AuthenticationManager with our AuthenticationFilter
  // More info:
  // https://github.com/spring-projects/spring-security/issues/10822#issuecomment-1036063319
  public static class SecurityFilterConfigurer
      extends AbstractHttpConfigurer<SecurityFilterConfigurer, HttpSecurity> {
    @Override
    public void configure(HttpSecurity http) {
      AuthenticationManager authenticationManager =
          http.getSharedObject(AuthenticationManager.class);
      http.addFilterBefore(
          new RedesignAuthenticationFilter(authenticationManager),
          UsernamePasswordAuthenticationFilter.class);
    }
  }
}
