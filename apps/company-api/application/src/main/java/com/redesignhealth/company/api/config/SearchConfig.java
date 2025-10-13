package com.redesignhealth.company.api.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.redesignhealth.company.api.client.search.NoopSearchClient;
import com.redesignhealth.company.api.client.search.OpenSearchClient;
import com.redesignhealth.company.api.client.search.SearchClient;
import org.apache.http.HttpHost;
import org.opensearch.client.RestClient;
import org.opensearch.client.json.jackson.JacksonJsonpMapper;
import org.opensearch.client.transport.OpenSearchTransport;
import org.opensearch.client.transport.aws.AwsSdk2Transport;
import org.opensearch.client.transport.aws.AwsSdk2TransportOptions;
import org.opensearch.client.transport.rest_client.RestClientTransport;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import software.amazon.awssdk.http.SdkHttpClient;
import software.amazon.awssdk.http.apache.ApacheHttpClient;
import software.amazon.awssdk.regions.Region;

@Configuration
public class SearchConfig {

  @Bean
  @ConditionalOnProperty(name = "search.hostname")
  public SearchClient openSearchClient(
      @Value("${search.hostname}") String hostname,
      @Value("${aws.enabled}") boolean isAwsEnabled,
      @Value("${aws.region}") String awsRegion,
      @Value("${aws.search.service}") String service,
      ObjectMapper objectMapper) {
    OpenSearchTransport transport = null;
    var mapper = new JacksonJsonpMapper(objectMapper);
    // AWS Authenticates differently from standalone OpenSearch instances
    if (isAwsEnabled && hostname.contains("aws")) {
      SdkHttpClient httpClient = ApacheHttpClient.builder().build();
      transport =
          new AwsSdk2Transport(
              httpClient,
              hostname,
              service,
              Region.of(awsRegion),
              AwsSdk2TransportOptions.builder().setMapper(mapper).build());

    } else {
      RestClient restClient = RestClient.builder(new HttpHost(hostname, 9200, "http")).build();
      transport = new RestClientTransport(restClient, mapper);
    }
    return new OpenSearchClient(new org.opensearch.client.opensearch.OpenSearchClient(transport));
  }

  @Bean
  @ConditionalOnProperty(name = "search.hostname", havingValue = "false", matchIfMissing = true)
  public SearchClient noopSearchClient() {
    return new NoopSearchClient();
  }
}
