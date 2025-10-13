package com.redesignhealth.company.api.controller;

import com.redesignhealth.company.api.assembler.ConsentAssembler;
import com.redesignhealth.company.api.dto.ConsentSummary;
import com.redesignhealth.company.api.entity.Consent;
import com.redesignhealth.company.api.openapi.IncludeSecurityHeaders;
import com.redesignhealth.company.api.service.ConsentService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;

@RestController
@IncludeSecurityHeaders
@Tag(name = "Account Consent Forms")
public class ConsentController {
  private final ConsentAssembler consentAssembler;
  private final ConsentService consentService;

  public ConsentController(ConsentService consentService) {
    this.consentService = consentService;
    this.consentAssembler = new ConsentAssembler();
  }

  @PutMapping("/me/consent/{type}")
  public ConsentSummary upsertConsent(
      @PathVariable Consent.Type type, @RequestBody ConsentCommand command) {
    return consentAssembler.toModel(consentService.upsert(type, command));
  }

  @GetMapping("/me/consent/{type}")
  public ConsentSummary getConsent(@PathVariable Consent.Type type) {
    return consentAssembler.toModel(consentService.get(type));
  }
}
