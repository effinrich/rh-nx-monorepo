package com.redesignhealth.company.api.controller;

import static com.redesignhealth.company.api.controller.util.Paths.*;

import com.redesignhealth.company.api.assembler.InfraRequestAssembler;
import com.redesignhealth.company.api.assembler.RequestFormAssembler;
import com.redesignhealth.company.api.dto.InfraRequestSummary;
import com.redesignhealth.company.api.dto.RequestFormSummary;
import com.redesignhealth.company.api.dto.command.InfraRequestCommand;
import com.redesignhealth.company.api.dto.command.RequestFormCommand;
import com.redesignhealth.company.api.entity.FormDefinition;
import com.redesignhealth.company.api.entity.ref.CompanyRef;
import com.redesignhealth.company.api.entity.request.RequestForm;
import com.redesignhealth.company.api.expansion.Expansion;
import com.redesignhealth.company.api.openapi.IncludeSecurityHeaders;
import com.redesignhealth.company.api.service.InfraRequestService;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import java.util.Optional;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@IncludeSecurityHeaders
@RequestMapping("/infra-request")
@Tag(name = "Infrastructure Request", description = "Request infrastructure for a company")
public class InfraRequestController {
  private final InfraRequestService service;
  private final InfraRequestAssembler assembler;
  private final RequestFormAssembler requestFormAssembler;

  public InfraRequestController(
      InfraRequestService infraRequestService, InfraRequestAssembler infraRequestAssembler) {
    this.service = infraRequestService;
    this.assembler = infraRequestAssembler;
    this.requestFormAssembler = new RequestFormAssembler();
  }

  @GetMapping(COMPANY_ID)
  @PreAuthorize("@authChecks.isMember(authentication, #apiId, 'ROLE_OP_CO_CONTRACTOR')")
  public InfraRequestSummary getInfrastructure(
      @ParameterObject CompanyRef apiId, @RequestParam Optional<List<Expansion>> expand) {
    var infraRequest = service.findByApiId(apiId, expand.orElse(List.of()));
    return assembler.toModel(infraRequest);
  }

  @PreAuthorize("@authChecks.isMember(authentication, #apiId, 'ROLE_OP_CO_USER')")
  @PutMapping(COMPANY_ID)
  public InfraRequestSummary updateInfrastructure(
      @ParameterObject CompanyRef apiId, @RequestBody InfraRequestCommand command) {
    var infraRequest = service.getOrCreate(apiId);
    infraRequest.setStatus(command.getStatus());
    service.save(infraRequest);
    return assembler.toModel(infraRequest);
  }

  @PreAuthorize("@authChecks.isMember(authentication, #apiId, 'ROLE_OP_CO_USER')")
  @PutMapping(COMPANY_ID + "/form/{type}")
  public RequestFormSummary updateForm(
      @ParameterObject CompanyRef apiId,
      @PathVariable FormDefinition.Type type,
      @RequestBody RequestFormCommand command) {
    var infraRequest = service.getOrCreate(apiId);
    RequestForm form = service.getOrCreateForm(infraRequest, type);

    form.setForm(command.getForm());
    form.setStatus(command.getStatus());
    service.save(form);
    return requestFormAssembler.toModel(form);
  }

  @PreAuthorize("@authChecks.isMember(authentication, #apiId, 'ROLE_OP_CO_USER')")
  @PostMapping(COMPANY_ID + "/submit")
  public InfraRequestSummary submitRequest(@ParameterObject CompanyRef apiId) {
    return assembler.toModel(service.submitRequest(apiId).block());
  }
}
