package com.redesignhealth.property;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import software.amazon.awssdk.services.secretsmanager.SecretsManagerClient;
import software.amazon.awssdk.services.secretsmanager.model.GetSecretValueRequest;
import software.amazon.awssdk.services.secretsmanager.model.GetSecretValueResponse;
import software.amazon.awssdk.services.secretsmanager.model.InvalidParameterException;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AwsSecretsManagerPropertySourceTest {

  private ObjectMapper mapper = new ObjectMapper();
  private AwsSecretsManagerPropertySource propertySource;
  @Mock
  private SecretsManagerClient secretsManagerClient;

  @BeforeEach
  public void setup() {
    propertySource =
      new AwsSecretsManagerPropertySource("test/my-service", secretsManagerClient, mapper);
  }

  @Test
  public void testRefresh_failedToRetrieve() {
    when(secretsManagerClient.getSecretValue(
      GetSecretValueRequest.builder().secretId("test/my-service").build()))
      .thenThrow(InvalidParameterException.class);
    propertySource.refresh();

    assertEquals(0, propertySource.getPropertyNames().length);
  }

  @Test
  public void testRefresh_successFailureKeepsExisitingValues() {
    when(secretsManagerClient.getSecretValue(
      GetSecretValueRequest.builder().secretId("test/my-service").build()))
      .thenReturn(
        GetSecretValueResponse.builder()
          .secretString("{\"datasource.password\": \"secret\"}")
          .build());
    propertySource.refresh();

    assertEquals(1, propertySource.getPropertyNames().length);
    assertEquals("secret", propertySource.getProperty("datasource.password"));

    when(secretsManagerClient.getSecretValue(
      GetSecretValueRequest.builder().secretId("test/my-service").build()))
      .thenThrow(InvalidParameterException.class);
    propertySource.refresh();

    assertEquals(1, propertySource.getPropertyNames().length);
    assertEquals("secret", propertySource.getProperty("datasource.password"));
  }
}

