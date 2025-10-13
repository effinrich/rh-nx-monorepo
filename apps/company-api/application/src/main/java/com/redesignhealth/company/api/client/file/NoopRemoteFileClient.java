package com.redesignhealth.company.api.client.file;

import com.redesignhealth.company.api.entity.ref.PersonRef;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.util.MimeType;

public class NoopRemoteFileClient implements GoogleDriveClient, RemoteFileClient {
  private static final Logger logger = LoggerFactory.getLogger(NoopRemoteFileClient.class);

  @Override
  public String getDocument(String fileId, MimeType mimeType) {
    logger.info("Mocked call to get id={}, mimeType={}", fileId, mimeType);

    return "Remote File Client Disabled";
  }

  @Override
  public String createFolder(String folderName) {
    return createFolder(folderName, null);
  }

  @Override
  public String createFolder(String folderName, String parentId) {
    logger.info("Mocked call to create folder={} and parentId={}", folderName, parentId);
    return null;
  }

  @Override
  public void deleteFolder(String folderId) {
    logger.info("Mocked call to delete folder={}", folderId);
  }

  @Override
  public Optional<String> getFolder(String folderName) {
    logger.info("Mocked call to get folder={}", folderName);
    return Optional.empty();
  }

  @Override
  public String copy(String fileId, String destinationFolderId) {
    logger.info("Mocked call to copy file={} to folder={}", fileId, destinationFolderId);
    return null;
  }

  @Override
  public boolean canEdit(String fileId) {
    logger.info("Mocked call to check edit access on file={}", fileId);
    return false;
  }

  @Override
  public void grantEditAccess(String fileId, PersonRef personRef) {
    logger.info("Mocked call to share file={} with email={}", fileId, personRef);
  }

  @Override
  public void revokeAccess(String fileId, PersonRef personRef) {
    logger.info("Mocked call to revoke access from file={} for email={}", fileId, personRef);
  }
}
