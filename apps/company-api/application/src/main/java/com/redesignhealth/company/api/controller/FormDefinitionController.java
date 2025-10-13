package com.redesignhealth.company.api.controller;

import com.redesignhealth.company.api.assembler.FormDefinitionAssembler;
import com.redesignhealth.company.api.dto.FormDefinitionSummary;
import com.redesignhealth.company.api.dto.command.FormDefinitionCommand;
import com.redesignhealth.company.api.entity.FormDefinition;
import com.redesignhealth.company.api.openapi.IncludeSecurityHeaders;
import com.redesignhealth.company.api.service.FormDefinitionService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/form-definition")
@Tag(name = "Form Definition")
@IncludeSecurityHeaders
public class FormDefinitionController {

  private final FormDefinitionAssembler formDefinitionAssembler;
  private final FormDefinitionService formDefinitionService;

  public FormDefinitionController(FormDefinitionService formDefinitionServcie) {
    this.formDefinitionAssembler = new FormDefinitionAssembler();
    this.formDefinitionService = formDefinitionServcie;
  }

  @GetMapping("/{type}")
  public FormDefinitionSummary get(@PathVariable FormDefinition.Type type) {
    return formDefinitionAssembler.toModel(formDefinitionService.get(type));
  }

  @PreAuthorize("@authChecks.isAdmin(authentication)")
  @PutMapping("/{type}")
  public FormDefinitionSummary upsert(
      @PathVariable FormDefinition.Type type, @RequestBody FormDefinitionCommand command) {
    return formDefinitionAssembler.toModel(formDefinitionService.upsert(type, command));
  }
}
