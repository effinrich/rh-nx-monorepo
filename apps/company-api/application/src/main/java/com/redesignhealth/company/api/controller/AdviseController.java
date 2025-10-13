package com.redesignhealth.company.api.controller;

import com.redesignhealth.company.api.dto.AdviseTokenExchangeSummary;
import com.redesignhealth.company.api.openapi.IncludeSecurityHeaders;
import com.redesignhealth.company.api.security.RedesignUserDetails;
import com.redesignhealth.company.api.service.AdviseService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

// TODO: Integration tests needed here once the feature is basically proven
@RestController
@IncludeSecurityHeaders
@Slf4j
@RequestMapping("/advise")
@Tag(
    name = "Advise Token Exchange",
    description = "Exchange a Google OpenID Connect token for an access token to the Advise sheets")
public class AdviseController {

  private final AdviseService adviseService;

  public AdviseController(AdviseService adviseService) {
    this.adviseService = adviseService;
  }

  @PostMapping("/token-exchange")
  @PreAuthorize("@authChecks.hasRoleOrHigher(authentication, 'ROLE_OP_CO_USER')")
  public AdviseTokenExchangeSummary tokenExchange(Authentication auth) {
    var userDetails = (RedesignUserDetails) auth.getPrincipal();
    log.info("token exchange for {}", userDetails.getUsername());

    var accessToken = adviseService.getAccessToken();

    return new AdviseTokenExchangeSummary(accessToken);
  }
}
