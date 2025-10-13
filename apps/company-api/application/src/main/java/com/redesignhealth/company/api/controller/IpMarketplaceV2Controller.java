package com.redesignhealth.company.api.controller;

import static com.redesignhealth.company.api.controller.util.Paths.IP_MARKETPLACE_ID;
import static com.redesignhealth.company.api.controller.util.Paths.IP_MARKETPLACE_TRACK_ID;
import static org.springframework.http.HttpStatus.OK;

import com.redesignhealth.company.api.dto.IpMarketplaceContactInfoV2Summary;
import com.redesignhealth.company.api.entity.ref.IpMarketplaceRef;
import com.redesignhealth.company.api.entity.ref.IpMarketplaceTrackRef;
import com.redesignhealth.company.api.openapi.IncludeSecurityHeaders;
import com.redesignhealth.company.api.service.IpMarketplaceService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@IncludeSecurityHeaders
@Tag(name = "IP Marketplace V2")
public class IpMarketplaceV2Controller {
  private final IpMarketplaceService ipMarketplaceService;

  private static final String REQUEST_MAPPING = "/v2/ip-marketplace";

  public IpMarketplaceV2Controller(IpMarketplaceService ipMarketplaceService) {
    this.ipMarketplaceService = ipMarketplaceService;
  }

  @PutMapping(
      "me" + REQUEST_MAPPING + IP_MARKETPLACE_ID + "/contact-info" + IP_MARKETPLACE_TRACK_ID)
  @PreAuthorize("@authChecks.hasRoleOrHigher(authentication, 'ROLE_OP_CO_USER')")
  public ResponseEntity<IpMarketplaceContactInfoV2Summary> processContactInfo(
      @ParameterObject IpMarketplaceRef ipMarketplaceRef,
      @ParameterObject IpMarketplaceTrackRef ipMarketplaceTrackRef) {
    var result = ipMarketplaceService.createChatRoom(ipMarketplaceRef, ipMarketplaceTrackRef);
    return new ResponseEntity<>(result, OK);
  }

  @PostMapping("me" + REQUEST_MAPPING + IP_MARKETPLACE_ID + "/contact-info")
  @PreAuthorize("@authChecks.hasRoleOrHigher(authentication, 'ROLE_OP_CO_USER')")
  public ResponseEntity<IpMarketplaceContactInfoV2Summary> processContactInfo(
      @ParameterObject IpMarketplaceRef ipMarketplaceRef) {
    var result = ipMarketplaceService.requestChatRoom(ipMarketplaceRef);
    return new ResponseEntity<>(result, OK);
  }
}
