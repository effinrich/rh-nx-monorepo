package com.redesignhealth.company.api.client.file;

import org.springframework.util.MimeType;

/** Manage and retrieve files from remote locations (e.g. Google Drive, S3) */
public interface RemoteFileClient {
  String getDocument(String fileId, MimeType mimeType);
}
