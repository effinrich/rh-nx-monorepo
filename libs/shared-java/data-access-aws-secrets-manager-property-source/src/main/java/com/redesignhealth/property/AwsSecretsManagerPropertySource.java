package com.redesignhealth.property;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.env.EnumerablePropertySource;
import org.springframework.lang.Nullable;
import software.amazon.awssdk.services.secretsmanager.SecretsManagerClient;
import software.amazon.awssdk.services.secretsmanager.model.GetSecretValueRequest;
import software.amazon.awssdk.services.secretsmanager.model.GetSecretValueResponse;
import software.amazon.awssdk.regions.Region;

public class AwsSecretsManagerPropertySource extends EnumerablePropertySource<SecretsManagerClient> {
  private static Logger logger = LoggerFactory.getLogger(AwsSecretsManagerPropertySource.class);

  private Map<String, Object> properties;
  private final ObjectMapper mapper;
  private final String name;

  public AwsSecretsManagerPropertySource(String name, SecretsManagerClient client, ObjectMapper mapper) {
    super("AWS Secrets Manager key[" + name + "]", client);
        this.mapper = mapper;
    this.name = name;
    properties = new HashMap<>();

    refresh();
  }

  public AwsSecretsManagerPropertySource(String name, Region region, ObjectMapper mapper) {
    this(name, SecretsManagerClient.builder().region(region).build(), mapper);
  }

  @Override
  public String[] getPropertyNames() {
    Set<String> names = properties.keySet();
    return names.toArray(new String[names.size()]);
  }

  @Override
  @Nullable
  public Object getProperty(String name) {
    return this.properties.get(name);
  }

  /**
   * Load properties from SecretManager.
   *
   * <p>SecretManager returns the secrets in a Stringified JSON object Ex. "{"my.password":"...",
   * "my.other.secret": "..."}"
   *
   * <p>If there are any issues with retrieving or parsing the payload, we log a warning and treat
   * the property source as empty.
   */
  public void refresh() {
    try {
      GetSecretValueResponse response =
          this.getSource()
              .getSecretValue(GetSecretValueRequest.builder().secretId(this.name).build());
      properties =
          this.mapper.readValue(
              response.secretString(), new TypeReference<HashMap<String, Object>>() {});
    } catch (Exception e) {
      logger.warn("Unable to retrieve secrets from AWS Secrets Manager. " + e.getMessage());
    }
  }
}

