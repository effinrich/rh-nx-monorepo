package com.redesignhealth.company.api.client.prometheus;

import com.redesignhealth.company.api.dto.prometheus.PrometheusMetric;
import org.springframework.web.reactive.function.client.WebClient;

public class ExternalPrometheusClient implements PrometheusClient {
  private final WebClient client;
  private final String instance;

  public ExternalPrometheusClient(String baseUrl, String instanceParameterPerEnv) {
    client = WebClient.builder().baseUrl(baseUrl).build();
    instance = instanceParameterPerEnv;
  }

  @Override
  public PrometheusMetric getCounterValues(String counter) {
    String prometheusQuery = String.format("{instance=\"%s\", __name__=\"%s\"}", instance, counter);
    return client
        .get()
        .uri(
            uriBuilder ->
                uriBuilder
                    .path("/api/v1/query")
                    .queryParam("query", "{prometheusQuery}")
                    .build(prometheusQuery))
        .retrieve()
        .bodyToMono(PrometheusMetric.class)
        .block();
  }
}
