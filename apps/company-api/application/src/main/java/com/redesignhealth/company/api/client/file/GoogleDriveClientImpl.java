package com.redesignhealth.company.api.client.file;

import static com.redesignhealth.company.api.service.InfraRequestService.logger;

import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.http.HttpResponseException;
import com.google.api.client.http.HttpStatusCodes;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.gson.GsonFactory;
import com.google.api.services.drive.Drive;
import com.google.api.services.drive.DriveScopes;
import com.google.api.services.drive.model.File;
import com.google.api.services.drive.model.Permission;
import com.google.auth.Credentials;
import com.google.auth.http.HttpCredentialsAdapter;
import com.google.auth.oauth2.AccessToken;
import com.google.auth.oauth2.OAuth2Credentials;
import com.google.auth.oauth2.ServiceAccountCredentials;
import com.google.common.annotations.VisibleForTesting;
import com.redesignhealth.company.api.client.file.dto.FileFields;
import com.redesignhealth.company.api.client.file.dto.JsonEnum;
import com.redesignhealth.company.api.client.file.dto.PermissionFields;
import com.redesignhealth.company.api.client.file.dto.PermissionType;
import com.redesignhealth.company.api.client.file.dto.Role;
import com.redesignhealth.company.api.entity.ref.PersonRef;
import com.redesignhealth.company.api.exception.GoogleDriveException;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.springframework.util.MimeType;

public class GoogleDriveClientImpl implements GoogleDriveClient {

  public static final String APP_NAME = "Company API";
  private final Drive client;
  private static final JsonFactory JSON_FACTORY = GsonFactory.getDefaultInstance();
  private static final NetHttpTransport HTTP_TRANSPORT;
  private static final String GOOGLE_FOLDER_MIME_TYPE = "application/vnd.google-apps.folder";

  static {
    try {
      HTTP_TRANSPORT = GoogleNetHttpTransport.newTrustedTransport();
    } catch (Exception e) {
      throw new GoogleDriveException(e);
    }
  }

  private GoogleDriveClientImpl(Credentials credentials) {
    this.client =
        new Drive.Builder(HTTP_TRANSPORT, JSON_FACTORY, new HttpCredentialsAdapter(credentials))
            .setApplicationName(APP_NAME)
            .build();
  }

  @VisibleForTesting
  GoogleDriveClientImpl(Drive client) {
    this.client = client;
  }

  /**
   * Make Google Drive API requests with a service account.
   *
   * @param credentialsFile service account credentials
   */
  public GoogleDriveClientImpl(String credentialsFile) {
    this(getServiceAccountCredentials(credentialsFile, Optional.empty()));
  }

  public GoogleDriveClientImpl(String credentialsFile, String delegatedUser) {
    this(getServiceAccountCredentials(credentialsFile, Optional.of(delegatedUser)));
  }

  /**
   * Make Google Drive API requests on behalf of a person.
   *
   * @param userAccessToken person's access token
   */
  public static GoogleDriveClient getOauthClient(String userAccessToken) {
    var credentials =
        OAuth2Credentials.create(AccessToken.newBuilder().setTokenValue(userAccessToken).build());
    return new GoogleDriveClientImpl(credentials);
  }

  @Override
  public String getDocument(String fileId, MimeType mimeType) {
    try {
      OutputStream outputStream = new ByteArrayOutputStream();
      client.files().export(fileId, mimeType.toString()).executeMediaAndDownloadTo(outputStream);
      return outputStream.toString();
    } catch (HttpResponseException e) {
      if (e.getStatusCode() == HttpStatusCodes.STATUS_CODE_NOT_FOUND) {
        throw new GoogleDriveException(
            String.format(
                "Google Drive document %s not found. Verify that the document is shared with our service account.",
                fileId));
      }
      throw new GoogleDriveException(e);
    } catch (IOException e) {
      throw new GoogleDriveException(e);
    }
  }

  @Override
  public String createFolder(String folderName) {
    return createFolder(folderName, null);
  }

  @Override
  public String createFolder(String folderName, String parentId) {
    var folder = new File();
    folder.setName(folderName);
    folder.setMimeType(GOOGLE_FOLDER_MIME_TYPE);
    if (parentId != null) {
      folder.setParents(List.of(parentId));
    }
    try {
      return client.files().create(folder).setSupportsAllDrives(true).execute().getId();
    } catch (IOException e) {
      throw new GoogleDriveException(e);
    }
  }

  @Override
  public Optional<String> getFolder(String folderName) {
    try {
      var response =
          client
              .files()
              .list()
              .setQ(
                  String.format(
                      "mimeType = '%s' and name = '%s'", GOOGLE_FOLDER_MIME_TYPE, folderName))
              .setSupportsAllDrives(true)
              .setIncludeItemsFromAllDrives(true)
              .execute();
      if (!response.getFiles().isEmpty()) {
        if (response.getFiles().size() > 1) {
          logger.warn("Customer has multiple folders with the same name");
        }
        return Optional.of(response.getFiles().get(0).getId());
      }
      return Optional.empty();
    } catch (IOException e) {
      throw new GoogleDriveException(e);
    }
  }

  @Override
  public String copy(String fileId, String destinationFolderId) {
    var destination = new File();
    destination.setParents(List.of(destinationFolderId));

    try {
      return client
          .files()
          .copy(fileId, destination)
          .setSupportsAllDrives(true)
          .setFields("webViewLink")
          .execute()
          .getWebViewLink();
    } catch (IOException e) {
      throw new GoogleDriveException(e);
    }
  }

  @Override
  public boolean canEdit(String fileId) {
    try {
      var capabilities =
          client
              .files()
              .get(fileId)
              .setFields(FileFields.CAPABILITIES.jsonValue())
              .execute()
              .getCapabilities();
      return capabilities.getCanEdit();
    } catch (IOException e) {
      logger.error("Error checking edit access", e);
    }
    return false;
  }

  @Override
  public void grantEditAccess(String fileId, PersonRef personRef) {
    var permission =
        new Permission()
            .setType(PermissionType.USER.jsonValue())
            .setEmailAddress(personRef.getEmail())
            .setRole(Role.WRITER.jsonValue());

    try {
      client.permissions().create(fileId, permission).setSupportsAllDrives(true).execute();
    } catch (IOException e) {
      throw new GoogleDriveException(e);
    }
  }

  @Override
  public void revokeAccess(String fileId, PersonRef personRef) {
    try {
      var personPermission =
          client
              .permissions()
              .list(fileId)
              .setFields(
                  createNestedFieldsQuery(
                      PermissionFields.PERMISSIONS,
                      List.of(PermissionFields.ID, PermissionFields.EMAIL_ADDRESS)))
              .setSupportsAllDrives(true)
              .execute()
              .getPermissions()
              .stream()
              .filter(f -> f.getEmailAddress() != null)
              .filter(f -> personRef.getEmail().equals(f.getEmailAddress().toLowerCase()))
              .findFirst()
              .orElse(null);

      if (personPermission != null) {
        client
            .permissions()
            .delete(fileId, personPermission.getId())
            .setSupportsAllDrives(true)
            .execute();
      } else {
        logger.warn("Attempted to revoke access from person={} but they don't exist", personRef);
      }
    } catch (IOException e) {
      throw new GoogleDriveException(e);
    }
  }

  @Override
  public void deleteFolder(String folderId) {
    try {
      client.files().delete(folderId).setSupportsAllDrives(true).execute();
    } catch (IOException e) {
      throw new GoogleDriveException(e);
    }
  }

  private static Credentials getServiceAccountCredentials(
      String credentialsFile, Optional<String> delegatedUser) {
    try {
      var credentials =
          ServiceAccountCredentials.fromStream(new ByteArrayInputStream(credentialsFile.getBytes()))
              .createScoped(List.of(DriveScopes.DRIVE));
      if (delegatedUser.isEmpty()) {
        return credentials;
      }
      return credentials.createDelegated(delegatedUser.get());
    } catch (IOException e) {
      throw new GoogleDriveException(e);
    }
  }

  /**
   * Create Google Drive Syntax for nested fields.
   *
   * <p>Example format: parent(child1, child2)
   *
   * <p><a href="https://developers.google.com/drive/api/guides/fields-parameter">More info here</a>
   *
   * @param parent
   * @param children
   * @return
   */
  private static String createNestedFieldsQuery(JsonEnum parent, List<JsonEnum> children) {
    return parent.jsonValue()
        + "("
        + children.stream().map(JsonEnum::jsonValue).collect(Collectors.joining(","))
        + ")";
  }
}
