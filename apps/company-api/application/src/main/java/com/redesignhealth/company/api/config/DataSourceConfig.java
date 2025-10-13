package com.redesignhealth.company.api.config;

import static com.redesignhealth.company.api.config.DataSourceConfig.DATE_TIME_PROVIDER_BEAN;

import com.redesignhealth.company.api.entity.audit.Auditable;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Optional;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.auditing.DateTimeProvider;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@Configuration
@EnableJpaAuditing(dateTimeProviderRef = DATE_TIME_PROVIDER_BEAN)
public class DataSourceConfig {

  static final String DATE_TIME_PROVIDER_BEAN = "dateTimeProvider";

  /**
   * This {@link DateTimeProvider} is used to generate our created/lastModified timestamps in {@link
   * Auditable}
   *
   * <p>The default {@link org.springframework.data.auditing.CurrentDateTimeProvider} has
   * variability on OS's due to {@link LocalDateTime} leveraging OS clocks for precision. Mac's have
   * a precision of 10x^-6 while our Docker image has 10x^-9 precision. We'll force 10x^-6 due to
   * our underlying datasource (CockroachDB) only storing up to 10x^-6.
   */
  @Bean(name = DATE_TIME_PROVIDER_BEAN)
  public DateTimeProvider dateTimeProvider() {
    return () -> Optional.of(LocalDateTime.now().truncatedTo(ChronoUnit.MICROS));
  }
}
