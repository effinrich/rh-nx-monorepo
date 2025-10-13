package com.redesignhealth.company.api.client.file;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.redesignhealth.company.api.exception.RemoteUploadException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.model.S3Exception;

@ExtendWith(MockitoExtension.class)
public class S3ClientTests {
  @Mock private software.amazon.awssdk.services.s3.S3Client internalClient;

  private S3Client client;

  @BeforeEach
  public void setup() {
    client = new S3Client(internalClient, "test", "https://example.com");
  }

  @Test
  public void testUpload_callsClient() {
    client.upload("memo.txt", new byte[0], null);
    verify(internalClient, times(1)).putObject(any(PutObjectRequest.class), any(RequestBody.class));
  }

  @Test
  public void testUpload_returnsMetadata() {
    var result = client.upload("memo.txt", new byte[0], null);

    assertThat(result.getHref()).containsPattern("https://example.com/\\w{40}/memo.txt");
    assertThat(result.getFilename()).containsPattern("memo.txt");
  }

  @Test
  public void testUpload_exceptionHandled() {
    when(internalClient.putObject(any(PutObjectRequest.class), any(RequestBody.class)))
        .thenThrow(S3Exception.builder().message("Unknown S3 Bucket").build());

    assertThrows(RemoteUploadException.class, () -> client.upload("memo.txt", new byte[0], null));
  }
}
