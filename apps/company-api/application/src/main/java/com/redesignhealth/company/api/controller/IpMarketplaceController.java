package com.redesignhealth.company.api.controller;

import static com.redesignhealth.company.api.controller.util.Paths.IP_MARKETPLACE_ID;
import static org.springframework.http.HttpStatus.CREATED;
import static org.springframework.http.HttpStatus.OK;

import com.redesignhealth.company.api.assembler.IpMarketplaceAssembler;
import com.redesignhealth.company.api.dto.FilterOptionsSummary;
import com.redesignhealth.company.api.dto.IpMarketplaceContactInfoSummary;
import com.redesignhealth.company.api.dto.IpMarketplaceSummary;
import com.redesignhealth.company.api.dto.command.ipMarketplace.IpMarketplaceBaseCommand;
import com.redesignhealth.company.api.dto.command.ipMarketplace.IpMarketplaceContactInfoCommand;
import com.redesignhealth.company.api.dto.command.ipMarketplace.IpMarketplaceCreateCommand;
import com.redesignhealth.company.api.entity.ref.IpMarketplaceRef;
import com.redesignhealth.company.api.expansion.Expansion;
import com.redesignhealth.company.api.openapi.IncludeSecurityHeaders;
import com.redesignhealth.company.api.service.IpMarketplaceService;
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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@IncludeSecurityHeaders
@Tag(name = "IP Marketplace")
public class IpMarketplaceController {
  private final IpMarketplaceService ipMarketplaceService;
  private final IpMarketplaceAssembler ipMarketplaceAssembler;
  private final PagedResourcesAssembler<IpMarketplaceSummary> pagedResourcesAssembler;

  private static final String REQUEST_MAPPING = "/ip-marketplace";

  public IpMarketplaceController(
      IpMarketplaceService ipMarketplaceService,
      IpMarketplaceAssembler ipMarketplaceAssembler,
      PagedResourcesAssembler<IpMarketplaceSummary> pagedResourcesAssembler) {
    this.ipMarketplaceService = ipMarketplaceService;
    this.ipMarketplaceAssembler = ipMarketplaceAssembler;
    this.pagedResourcesAssembler = pagedResourcesAssembler;
  }

  @PostMapping(REQUEST_MAPPING)
  @PreAuthorize("@authChecks.hasRoleOrHigher(authentication, 'ROLE_OP_CO_USER')")
  @ResponseStatus(CREATED)
  public ResponseEntity<IpMarketplaceSummary> createIpMarketplace(
      @Valid @RequestBody IpMarketplaceCreateCommand command) {
    var result = ipMarketplaceService.create(command);
    return new ResponseEntity<>(result, CREATED);
  }

  @PutMapping(REQUEST_MAPPING + IP_MARKETPLACE_ID)
  @PreAuthorize("@authChecks.hasRoleOrHigher(authentication, 'ROLE_OP_CO_USER')")
  public ResponseEntity<IpMarketplaceSummary> update(
      @ParameterObject IpMarketplaceRef ipMarketplaceRef,
      @Valid @RequestBody IpMarketplaceBaseCommand command) {
    var result = ipMarketplaceService.update(ipMarketplaceRef, command);
    return new ResponseEntity<>(result, OK);
  }

  @PutMapping("me" + REQUEST_MAPPING + IP_MARKETPLACE_ID + "/contact-info")
  @PreAuthorize("@authChecks.hasRoleOrHigher(authentication, 'ROLE_OP_CO_USER')")
  public ResponseEntity<IpMarketplaceContactInfoSummary> processContactInfo(
      @ParameterObject IpMarketplaceRef ipMarketplaceRef,
      @Valid @RequestBody IpMarketplaceContactInfoCommand command) {
    var result = ipMarketplaceService.processContactInfo(command, ipMarketplaceRef);
    return new ResponseEntity<>(result, OK);
  }

  @GetMapping(REQUEST_MAPPING)
  @PreAuthorize("@authChecks.hasRoleOrHigher(authentication, 'ROLE_OP_CO_USER')")
  public PagedModel<IpMarketplaceSummary> getIpRecords(
      @RequestParam Optional<String> q,
      @RequestParam Optional<List<String>> filter,
      @ParameterObject Pageable pageable,
      @RequestParam Optional<List<Expansion>> expand) {
    return pagedResourcesAssembler.toModel(
        ipMarketplaceService.query(
            q.orElse(null), filter.orElse(new ArrayList<>()), pageable, expand.orElse(List.of())),
        ipMarketplaceAssembler);
  }

  @GetMapping(REQUEST_MAPPING + "/filters")
  @PreAuthorize("@authChecks.hasRoleOrHigher(authentication, 'ROLE_OP_CO_USER')")
  public CollectionModel<FilterOptionsSummary> getFilter() {
    return CollectionModel.of(
        ipMarketplaceService.getFilters().stream().map(FilterOptionsSummary::from).toList());
  }

  @GetMapping(REQUEST_MAPPING + IP_MARKETPLACE_ID)
  @PreAuthorize("@authChecks.hasRoleOrHigher(authentication, 'ROLE_OP_CO_USER')")
  public ResponseEntity<IpMarketplaceSummary> get(
      @ParameterObject IpMarketplaceRef ipMarketplaceRef,
      @RequestParam Optional<List<Expansion>> expand) {
    var result = ipMarketplaceService.get(ipMarketplaceRef, expand.orElse(List.of()));
    return new ResponseEntity<>(result, OK);
  }

  @DeleteMapping(REQUEST_MAPPING + IP_MARKETPLACE_ID)
  @PreAuthorize("@authChecks.isAdmin(authentication)")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public ResponseEntity<Void> delete(@ParameterObject IpMarketplaceRef ipMarketplaceRef) {
    ipMarketplaceService.delete(ipMarketplaceRef);
    return new ResponseEntity<>(HttpStatus.NO_CONTENT);
  }
}
