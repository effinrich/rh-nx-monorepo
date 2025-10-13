package com.redesignhealth.company.api.controller;

import static com.redesignhealth.company.api.controller.util.Paths.CEO_ID;
import static org.springframework.http.HttpStatus.CREATED;
import static org.springframework.http.HttpStatus.OK;

import com.redesignhealth.company.api.assembler.CeoDirectoryAssembler;
import com.redesignhealth.company.api.dto.CeoSummary;
import com.redesignhealth.company.api.dto.FilterOptionsSummary;
import com.redesignhealth.company.api.dto.command.CeoBaseCommand;
import com.redesignhealth.company.api.dto.command.CeoCreateCommand;
import com.redesignhealth.company.api.entity.ref.CeoRef;
import com.redesignhealth.company.api.expansion.Expansion;
import com.redesignhealth.company.api.openapi.IncludeSecurityHeaders;
import com.redesignhealth.company.api.service.CeoService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.PagedModel;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@IncludeSecurityHeaders
@RequestMapping("/ceos")
@Tag(name = "CEOs")
public class CeoController {
  private final PagedResourcesAssembler<CeoSummary> pagedResourcesAssembler;
  private final CeoService ceoService;

  private final CeoDirectoryAssembler ceoDirectoryAssembler;

  public CeoController(
      PagedResourcesAssembler<CeoSummary> pagedResourcesAssembler,
      CeoService ceoService,
      CeoDirectoryAssembler ceoDirectoryAssembler) {
    this.pagedResourcesAssembler = pagedResourcesAssembler;
    this.ceoService = ceoService;
    this.ceoDirectoryAssembler = ceoDirectoryAssembler;
  }

  @PostMapping()
  @PreAuthorize("@authChecks.isAdmin(authentication)")
  @ResponseStatus(CREATED)
  public ResponseEntity<CeoSummary> createCeo(
      @Valid @RequestBody CeoCreateCommand ceoCreateCommand) {
    var result = ceoService.create(ceoCreateCommand);
    return new ResponseEntity<>(result, CREATED);
  }

  @GetMapping()
  @PreAuthorize("@authChecks.hasRoleOrHigher(authentication, 'ROLE_OP_CO_USER')")
  public PagedModel<CeoSummary> getCeos(
      @RequestParam Optional<String> q,
      @RequestParam Optional<List<String>> filter,
      @ParameterObject Pageable pageable,
      @RequestParam Optional<List<Expansion>> expand) {
    return pagedResourcesAssembler.toModel(
        ceoService.query(
            q.orElse(null), filter.orElse(new ArrayList<>()), pageable, expand.orElse(List.of())),
        ceoDirectoryAssembler);
  }

  @GetMapping(CEO_ID)
  @PreAuthorize("@authChecks.hasRoleOrHigher(authentication, 'ROLE_OP_CO_USER')")
  public ResponseEntity<CeoSummary> get(@ParameterObject CeoRef ceoRef) {
    var result = ceoService.get(ceoRef);
    return new ResponseEntity<>(result, OK);
  }

  @PutMapping(CEO_ID)
  @PreAuthorize("@authChecks.hasRoleOrHigher(authentication, 'ROLE_OP_CO_USER')")
  public ResponseEntity<CeoSummary> put(
      @ParameterObject CeoRef ceoRef, @Valid @RequestBody CeoBaseCommand ceoBaseCommand) {
    var result = ceoService.update(ceoBaseCommand, ceoRef);
    return new ResponseEntity<>(result, OK);
  }

  @GetMapping("/filters")
  @PreAuthorize("@authChecks.hasRoleOrHigher(authentication, 'ROLE_OP_CO_USER')")
  public CollectionModel<FilterOptionsSummary> getFilters() {
    return CollectionModel.of(
        ceoService.getFilters().stream().map(FilterOptionsSummary::from).toList());
  }

  @DeleteMapping(CEO_ID)
  @PreAuthorize("@authChecks.isAdmin(authentication)")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public ResponseEntity<Void> delete(@ParameterObject CeoRef ceoRef) {
    ceoService.delete(ceoRef);
    return new ResponseEntity<>(HttpStatus.NO_CONTENT);
  }
}
