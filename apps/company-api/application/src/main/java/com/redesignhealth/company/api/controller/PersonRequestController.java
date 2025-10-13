package com.redesignhealth.company.api.controller;

import static org.springframework.http.HttpStatus.CREATED;

import com.redesignhealth.company.api.assembler.PersonRequestAssembler;
import com.redesignhealth.company.api.dto.PersonRequestSummary;
import com.redesignhealth.company.api.dto.command.PersonRequestCommand;
import com.redesignhealth.company.api.entity.PersonRequest;
import com.redesignhealth.company.api.openapi.IncludeSecurityHeaders;
import com.redesignhealth.company.api.service.PersonRequestService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.PagedModel;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@IncludeSecurityHeaders
@RequestMapping("/person-request")
@Tag(name = "Person Request", description = "Request access for a user")
public class PersonRequestController {

  private final PersonRequestService personRequestService;
  private final PersonRequestAssembler assembler;
  private final PagedResourcesAssembler<PersonRequest> pagedAssembler;

  public PersonRequestController(
      PersonRequestService requestService,
      PagedResourcesAssembler<PersonRequest> pagedAssembler,
      PersonRequestAssembler personRequestAssembler) {
    this.personRequestService = requestService;
    this.assembler = personRequestAssembler;
    this.pagedAssembler = pagedAssembler;
  }

  @PreAuthorize("@authChecks.isAdmin(authentication)")
  @GetMapping
  public PagedModel<PersonRequestSummary> getRequests(@ParameterObject Pageable pageable) {
    Page<PersonRequest> results = personRequestService.findAll(pageable);
    return pagedAssembler.toModel(results, assembler);
  }

  @PreAuthorize("@authChecks.isMember(authentication, #command, 'ROLE_OP_CO_USER')")
  @PostMapping
  public ResponseEntity<PersonRequestSummary> requestPerson(
      @RequestBody PersonRequestCommand command) {
    var result = personRequestService.requestPerson(command).map(assembler::toModel).block();
    return new ResponseEntity<>(result, CREATED);
  }
}
