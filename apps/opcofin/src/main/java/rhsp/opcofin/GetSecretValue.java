// https://github.com/awsdocs/aws-doc-sdk-examples/blob/main/javav2/example_code/secretsmanager/src/main/java/com/example/secrets/GetSecretValue.java

package rhsp.opcofin;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Component;

import software.amazon.awssdk.auth.credentials.DefaultCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.secretsmanager.SecretsManagerClient;
import software.amazon.awssdk.services.secretsmanager.model.GetSecretValueRequest;
import software.amazon.awssdk.services.secretsmanager.model.GetSecretValueResponse;

@Component
public class GetSecretValue {

    private final Logger logger = LoggerFactory.getLogger(GetSecretValue.class);
    
    @Cacheable("secretsmanager")
    public String request(String arn) {
        logger.debug("aws secretsmanager get-secret-value --secret-id " + arn);
        Region region = Region.US_EAST_1;
        SecretsManagerClient secretsClient = SecretsManagerClient.builder()
            .region(region)
            .credentialsProvider(DefaultCredentialsProvider.create())
            .build();

        GetSecretValueRequest valueRequest = GetSecretValueRequest.builder()
            .secretId(arn)
            .build();

        GetSecretValueResponse valueResponse = secretsClient.getSecretValue(valueRequest);
        String secret = valueResponse.secretString();
        secretsClient.close();
        return secret;
    }
}
