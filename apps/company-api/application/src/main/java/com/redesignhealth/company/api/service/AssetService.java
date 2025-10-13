package com.redesignhealth.company.api.service;

import com.redesignhealth.company.api.client.file.RemoteFileUploader;
import com.redesignhealth.company.api.dto.AssetSummary;
import com.redesignhealth.company.api.exception.RemoteUploadException;
import java.io.IOException;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class AssetService {

  private final RemoteFileUploader client;

  public AssetService(RemoteFileUploader client) {
    this.client = client;
  }

  public List<AssetSummary> upload(List<MultipartFile> files) {
    return files.stream()
        .map(
            file -> {
              try {
                return AssetSummary.from(
                    client.upload(
                        file.getOriginalFilename(), file.getBytes(), file.getContentType()));
              } catch (IOException e) {
                throw new RemoteUploadException(e);
              }
            })
        .toList();
  }
}
