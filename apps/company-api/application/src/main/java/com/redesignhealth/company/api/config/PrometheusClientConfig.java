package com.redesignhealth.company.api.config;

import com.redesignhealth.company.api.client.prometheus.ExternalPrometheusClient;
import com.redesignhealth.company.api.client.prometheus.NoopPrometheusClient;
import com.redesignhealth.company.api.client.prometheus.PrometheusClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class PrometheusClientConfig {
  public static String NOT_DEFINED_SERVER = "https://www.example.com";

  @Bean
  public PrometheusClient externalPrometheusClient(
      @Value("${prometheus-service.base-url}") String baseUrl,
      @Value("${prometheus-service.instance}") String instance) {
    if (!baseUrl.equals(NOT_DEFINED_SERVER)) return new ExternalPrometheusClient(baseUrl, instance);
    else return new NoopPrometheusClient();
  }
}
