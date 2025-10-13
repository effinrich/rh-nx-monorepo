package com.redesignhealth.company.api.controller;

import static org.springframework.http.HttpStatus.CREATED;

import com.redesignhealth.company.api.dto.AssetSummary;
import com.redesignhealth.company.api.openapi.IncludeSecurityHeaders;
import com.redesignhealth.company.api.service.AssetService;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import org.springframework.hateoas.CollectionModel;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@IncludeSecurityHeaders
@RequestMapping("/asset")
@Tag(name = "Asset")
public class AssetController {

  private final AssetService assetService;
  public static final String MULTIPART_FILE_KEY = "file";

  public AssetController(AssetService assetService) {
    this.assetService = assetService;
  }

  @PreAuthorize("@authChecks.hasRoleOrHigher(authentication, 'ROLE_OP_CO_USER')")
  @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  public ResponseEntity<CollectionModel<AssetSummary>> upload(
      @RequestParam(MULTIPART_FILE_KEY) List<MultipartFile> files) {
    return new ResponseEntity<>(CollectionModel.of(assetService.upload(files)), CREATED);
  }
}
