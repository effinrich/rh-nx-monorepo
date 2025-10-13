package com.redesignhealth.company.api.client.file;

import com.google.common.annotations.VisibleForTesting;
import com.redesignhealth.company.api.client.file.dto.RemoteFile;
import com.redesignhealth.company.api.entity.id.ApiIdGenerator;
import com.redesignhealth.company.api.exception.RemoteUploadException;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

@VisibleForTesting
@AllArgsConstructor(access = AccessLevel.PACKAGE)
public class S3Client implements RemoteFileUploader {

  public software.amazon.awssdk.services.s3.S3Client client;
  private final String bucket;
  private final String cdnUrl;
  private static final int HASH_LENGTH = 40;

  public S3Client(String bucket, String cdnUrl) {
    this(software.amazon.awssdk.services.s3.S3Client.builder().build(), bucket, cdnUrl);
  }

  /**
   * @param filename name of file with extension
   * @param bytes raw bytes of file
   * @param contentType Content Type of file
   * @return metadata about the file
   */
  public RemoteFile upload(String filename, byte[] bytes, String contentType) {
    var key = generateKey(filename);
    try {
      this.client.putObject(
          PutObjectRequest.builder().bucket(bucket).key(key).contentType(contentType).build(),
          RequestBody.fromBytes(bytes));
    } catch (Exception e) {
      throw new RemoteUploadException(e);
    }

    return RemoteFile.builder().href(String.format(cdnUrl + "/" + key)).filename(filename).build();
  }

  /**
   * Prepend a hash to a filename to prevent collisions.
   *
   * <p>Example Key: ra8b7BBNvBQlEOLdkovDaLbTlcT8tgVOuo8bE4xd/filename.png Note: S3 provides
   * policies for preventing collisions but they slowdown performance More info:
   * https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lock.html
   */
  private static String generateKey(String filename) {
    return ApiIdGenerator.generate(HASH_LENGTH) + "/" + filename;
  }
}
