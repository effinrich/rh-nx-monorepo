package com.redesignhealth.company.api.config;

import com.redesignhealth.company.api.client.file.GoogleDriveClient;
import com.redesignhealth.company.api.client.file.GoogleDriveClientImpl;
import com.redesignhealth.company.api.client.file.GoogleDriveLambdaClient;
import com.redesignhealth.company.api.client.file.MkDocsLambdaClient;
import com.redesignhealth.company.api.client.file.NoopRemoteFileClient;
import com.redesignhealth.company.api.client.file.NoopRemoteFileUploader;
import com.redesignhealth.company.api.client.file.RemoteFileClient;
import com.redesignhealth.company.api.client.file.RemoteFileUploader;
import com.redesignhealth.company.api.client.file.S3Client;
import com.redesignhealth.company.api.dto.enums.RemoteContentSource;
import com.redesignhealth.company.api.service.AdviseService;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.util.StringUtils;

@Configuration
public class RemoteFileConfig {

  private static final String MKDOCS_LAMBDA_CLIENT_BEAN_NAME = "mkDocsLambdaClient";
  private static final String GOOGLE_DRIVE_LAMBDA_CLIENT_BEAN_NAME = "googleDriveLambdaClient";

  @Bean
  public AdviseService adviseService(
      @Value("${advise.google.drive.service.account.json:}") String credentialsFile) {
    if (StringUtils.hasText(credentialsFile)) {
      return new AdviseService(Optional.of(credentialsFile));
    }
    return new AdviseService(Optional.empty());
  }

  @Bean
  public GoogleDriveClient googleDriveClient(
      @Value("${google.drive.service.account.json:}") String credentialsFile) {
    if (StringUtils.hasText(credentialsFile)) {
      return new GoogleDriveClientImpl(credentialsFile);
    }
    return new NoopRemoteFileClient();
  }

  @Bean
  public GoogleDriveClient researchGoogleDriveClient(
      @Value("${google.drive.research.account.json:}") String credentialsFile,
      @Value("${google.drive.research.account.delegate:}") String delegateUser) {
    if (StringUtils.hasText(credentialsFile) && StringUtils.hasText(delegateUser)) {
      return new GoogleDriveClientImpl(credentialsFile, delegateUser);
    }
    return new NoopRemoteFileClient();
  }

  @Bean(GOOGLE_DRIVE_LAMBDA_CLIENT_BEAN_NAME)
  public RemoteFileClient googleDriveLambdaClient(
      @Value("${google-drive-lambda.hostname:}") String hostname) {
    if (StringUtils.hasText(hostname)) {
      return new GoogleDriveLambdaClient(hostname);
    }
    return new NoopRemoteFileClient();
  }

  @Bean(MKDOCS_LAMBDA_CLIENT_BEAN_NAME)
  public RemoteFileClient mkDocsLambdaClient(@Value("${mkdocs-lambda.hostname:}") String hostname) {
    if (StringUtils.hasText(hostname)) {
      return new MkDocsLambdaClient(hostname);
    }
    return new NoopRemoteFileClient();
  }

  @Bean
  public Map<RemoteContentSource, RemoteFileClient> remoteFileClients(
      @Qualifier(MKDOCS_LAMBDA_CLIENT_BEAN_NAME) RemoteFileClient mkDocsLambdaClient,
      @Qualifier(GOOGLE_DRIVE_LAMBDA_CLIENT_BEAN_NAME) RemoteFileClient googleDriveLambdaClient) {
    Map<RemoteContentSource, RemoteFileClient> remoteFileClients = new HashMap<>();
    remoteFileClients.put(RemoteContentSource.MKDOCS, mkDocsLambdaClient);
    remoteFileClients.put(RemoteContentSource.GOOGLE_DRIVE, googleDriveLambdaClient);
    return remoteFileClients;
  }

  @Bean
  public RemoteFileUploader remoteFileUploader(
      @Value("${aws.s3.assets.bucket:}") String s3Bucket,
      @Value("${aws.s3.assets.url:}") String cdnUrl,
      @Value("${aws.enabled:false}") boolean isAwsEnabled) {

    if (isAwsEnabled && StringUtils.hasText(s3Bucket)) {
      return new S3Client(s3Bucket, cdnUrl);
    }

    return new NoopRemoteFileUploader();
  }
}
