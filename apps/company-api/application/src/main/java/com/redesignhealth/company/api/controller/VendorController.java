package com.redesignhealth.company.api.controller;

import static com.redesignhealth.company.api.controller.util.Paths.VENDOR_ID;
import static org.springframework.http.HttpStatus.CREATED;

import com.redesignhealth.company.api.assembler.VendorAssembler;
import com.redesignhealth.company.api.client.search.command.SearchCommand;
import com.redesignhealth.company.api.dto.FilterOptionsSummary;
import com.redesignhealth.company.api.dto.VendorSummary;
import com.redesignhealth.company.api.dto.command.vendor.CreateVendorCommand;
import com.redesignhealth.company.api.dto.command.vendor.VendorCommand;
import com.redesignhealth.company.api.entity.ref.CompanyRef;
import com.redesignhealth.company.api.entity.ref.VendorRef;
import com.redesignhealth.company.api.openapi.IncludeSecurityHeaders;
import com.redesignhealth.company.api.service.VendorService;
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
import org.springframework.web.bind.annotation.RestController;

@RestController
@IncludeSecurityHeaders
@RequestMapping("/vendor")
@Tag(name = "Vendor")
public class VendorController {
  private final VendorService vendorService;

  private final VendorAssembler vendorAssembler;

  public VendorController(VendorService vendorService) {
    this.vendorService = vendorService;
    this.vendorAssembler = new VendorAssembler();
  }

  @GetMapping
  @PreAuthorize("@authChecks.hasRoleOrHigher(authentication, 'ROLE_OP_CO_USER')")
  public CollectionModel<VendorSummary> getVendors(
      @RequestParam Optional<String> q,
      @RequestParam Optional<List<String>> filter,
      // Attempting to replicate "unpaged" behaviour while still allowing clients to opt-in to
      // pagination. This endpoint was originally made without pagination.
      @PageableDefault(size = 2000, page = 0)
          @SortDefault.SortDefaults({@SortDefault(sort = "name", direction = Sort.Direction.ASC)})
          @ParameterObject
          Pageable page) {
    var results =
        vendorService.getAll(
            q.orElse(null), SearchCommand.convertQueryParams(filter.orElse(List.of())), page);
    return CollectionModel.of(results);
  }

  @GetMapping("/filters")
  @PreAuthorize("@authChecks.hasRoleOrHigher(authentication, 'ROLE_OP_CO_USER')")
  public CollectionModel<FilterOptionsSummary> getFilters() {
    return CollectionModel.of(
        vendorService.getFilters().stream().map(FilterOptionsSummary::from).toList());
  }

  @Operation(summary = "Add Vendor data")
  @PreAuthorize("@authChecks.hasRoleOrHigher(authentication, 'ROLE_RH_ADMIN')")
  @PostMapping()
  public ResponseEntity<VendorSummary> addVendor(
      @ParameterObject CompanyRef apiId, @Valid @RequestBody CreateVendorCommand vendorCommand) {
    var vendor = vendorService.addVendorData(vendorCommand);
    var result = vendorAssembler.toModel(vendor);
    return new ResponseEntity<>(result, CREATED);
  }

  @Operation(summary = "Update Vendor data")
  @PreAuthorize("@authChecks.hasRoleOrHigher(authentication, 'ROLE_RH_ADMIN')")
  @PutMapping(VENDOR_ID)
  public VendorSummary updateVendor(
      @ParameterObject VendorRef vendorId, @Valid @RequestBody VendorCommand vendorCommand) {
    var vendor = vendorService.update(vendorId, vendorCommand);
    return vendorAssembler.toModel(vendor);
  }

  @Operation(summary = "Get Vendor data")
  @PreAuthorize("@authChecks.hasRoleOrHigher(authentication, 'ROLE_OP_CO_USER')")
  @GetMapping(VENDOR_ID)
  public VendorSummary getVendor(@ParameterObject VendorRef vendorId) {
    var vendor = vendorService.get(vendorId);
    return vendorAssembler.toModel(vendor);
  }

  @Operation(summary = "Delete company vendor")
  @PreAuthorize("@authChecks.isAdmin(authentication)")
  @DeleteMapping(VENDOR_ID)
  public ResponseEntity<Void> deleteVendor(@ParameterObject VendorRef vendorId) {
    vendorService.delete(vendorId);
    return new ResponseEntity<>(HttpStatus.NO_CONTENT);
  }
}
