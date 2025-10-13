package com.redesignhealth.company.api.controller;

import static com.redesignhealth.company.api.controller.util.Paths.COMPANY_ID;
import static com.redesignhealth.company.api.controller.util.Paths.COMPANY_VENDOR_ID;

import com.redesignhealth.company.api.assembler.CompanyVendorAssembler;
import com.redesignhealth.company.api.dto.CompanyVendorSummary;
import com.redesignhealth.company.api.dto.command.vendor.CompanyVendorCommand;
import com.redesignhealth.company.api.dto.command.vendor.CreateCompanyVendorCommand;
import com.redesignhealth.company.api.entity.ref.CompanyRef;
import com.redesignhealth.company.api.entity.ref.CompanyVendorRef;
import com.redesignhealth.company.api.expansion.Expansion;
import com.redesignhealth.company.api.openapi.IncludeSecurityHeaders;
import com.redesignhealth.company.api.service.CompanyVendorService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import java.util.Optional;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.data.web.SortDefault;
import org.springframework.hateoas.CollectionModel;
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
@RequestMapping("/company" + COMPANY_ID + "/vendor")
@Tag(name = "Company Vendor")
public class CompanyVendorController {
  private final CompanyVendorAssembler companyVendorAssembler;

  private final CompanyVendorService companyVendorService;

  public CompanyVendorController(CompanyVendorService companyVendorService) {
    this.companyVendorAssembler = new CompanyVendorAssembler();
    this.companyVendorService = companyVendorService;
  }

  @Operation(summary = "Add company vendor data")
  @PreAuthorize("@authChecks.isMember(authentication, #apiId, 'ROLE_OP_CO_USER')")
  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public ResponseEntity<CompanyVendorSummary> addCompanyVendor(
      @ParameterObject CompanyRef apiId, @Valid @RequestBody CreateCompanyVendorCommand command) {
    var response = companyVendorAssembler.toModel(companyVendorService.create(apiId, command));
    return new ResponseEntity<>(response, HttpStatus.CREATED);
  }

  @Operation(summary = "Update company vendor data")
  @PreAuthorize("@authChecks.isMember(authentication, #apiId, 'ROLE_OP_CO_USER')")
  @PutMapping(COMPANY_VENDOR_ID)
  public CompanyVendorSummary updateCompanyVendor(
      @ParameterObject CompanyRef apiId,
      @ParameterObject CompanyVendorRef companyVendorId,
      @Valid @RequestBody CompanyVendorCommand command) {
    return companyVendorAssembler.toModel(companyVendorService.update(companyVendorId, command));
  }

  @Operation(summary = "Get all company vendors")
  @PreAuthorize("@authChecks.isMember(authentication, #apiId, 'ROLE_OP_CO_USER')")
  @GetMapping
  public CollectionModel<CompanyVendorSummary> getAllCompanyVendors(
      @ParameterObject CompanyRef apiId,
      @RequestParam Optional<List<Expansion>> expand,
      // Attempting to replicate "unpaged" behaviour while still allowing clients to opt-in to
      // pagination. This endpoint was originally made without pagination.
      @PageableDefault(size = 2000, page = 0)
          @SortDefault.SortDefaults({
            @SortDefault(sort = "vendor.name", direction = Sort.Direction.ASC)
          })
          @ParameterObject
          Pageable page) {
    var results = companyVendorService.getAll(apiId, expand.orElse(List.of()), page);
    return companyVendorAssembler.toCollectionModel(results);
  }

  @Operation(summary = "Get company vendor")
  @PreAuthorize("@authChecks.isMember(authentication, #apiId, 'ROLE_OP_CO_USER')")
  @GetMapping(COMPANY_VENDOR_ID)
  public CompanyVendorSummary getCompanyVendor(
      @ParameterObject CompanyRef apiId,
      @ParameterObject CompanyVendorRef companyVendorRef,
      @RequestParam Optional<List<Expansion>> expand) {
    return companyVendorAssembler.toModel(
        companyVendorService.get(companyVendorRef, expand.orElse(List.of())));
  }

  @Operation(summary = "Delete company vendor")
  @PreAuthorize("@authChecks.isAdmin(authentication)")
  @DeleteMapping(COMPANY_VENDOR_ID)
  public ResponseEntity<Void> deleteCompanyVendor(
      @ParameterObject CompanyVendorRef companyVendorRef) {
    companyVendorService.delete(companyVendorRef);
    return new ResponseEntity<>(HttpStatus.NO_CONTENT);
  }
}
