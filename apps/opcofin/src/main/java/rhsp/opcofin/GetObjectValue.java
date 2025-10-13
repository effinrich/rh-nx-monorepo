// https://github.com/awsdocs/aws-doc-sdk-examples/blob/main/javav2/example_code/s3/src/main/java/com/example/s3/GetObjectData.java

package rhsp.opcofin;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import software.amazon.awssdk.auth.credentials.DefaultCredentialsProvider;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

@Component
public class GetObjectValue {

    private final Logger logger = LoggerFactory.getLogger(GetObjectValue.class);

    public byte[] request(String bucketName, String keyName) {
        logger.debug("s3 get " + bucketName + " " + keyName);
        Region region = Region.US_EAST_1;
        S3Client s3 = S3Client.builder()
            .region(region)
            .credentialsProvider(DefaultCredentialsProvider.create())
            .build();
        
        GetObjectRequest objectRequest = GetObjectRequest
            .builder()
            .key(keyName)
            .bucket(bucketName)
            .build();
        
        byte[] bytes = s3.getObjectAsBytes(objectRequest).asByteArray();
        s3.close();
        return bytes;
    }

    public void update(String bucketName, String keyName, byte[] bytes) {
        logger.debug("s3 put " + bucketName + " " + keyName);
        Region region = Region.US_EAST_1;
        S3Client s3 = S3Client.builder()
            .region(region)
            .credentialsProvider(DefaultCredentialsProvider.create())
            .build(); 

        PutObjectRequest putObjectRequest = PutObjectRequest.builder()
            .bucket(bucketName)
            .key(keyName)
            .build();

        var response = s3.putObject(putObjectRequest, RequestBody.fromBytes(bytes));
        logger.debug("etag " + response.eTag());
        s3.close();
        return;
    }
    
}
