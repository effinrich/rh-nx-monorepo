package com.redesignhealth.company.api.controller;

import static com.redesignhealth.company.api.controller.util.Paths.*;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.http.HttpStatus.CREATED;

import com.redesignhealth.company.api.assembler.CompanyAssembler;
import com.redesignhealth.company.api.assembler.CompanyDtoAssembler;
import com.redesignhealth.company.api.assembler.CompanyMemberAssembler;
import com.redesignhealth.company.api.assembler.CompanyMemberAuditAssembler;
import com.redesignhealth.company.api.dto.CompanyDto;
import com.redesignhealth.company.api.dto.CompanyDtoSummary;
import com.redesignhealth.company.api.dto.CompanyMemberSummary;
import com.redesignhealth.company.api.dto.CompanySummary;
import com.redesignhealth.company.api.dto.command.CompanyCommand;
import com.redesignhealth.company.api.dto.command.CompanyConflictsCommand;
import com.redesignhealth.company.api.dto.command.CompanyMemberCommand;
import com.redesignhealth.company.api.entity.Company;
import com.redesignhealth.company.api.entity.ref.CompanyRef;
import com.redesignhealth.company.api.entity.ref.PersonRef;
import com.redesignhealth.company.api.expansion.Expansion;
import com.redesignhealth.company.api.openapi.IncludeSecurityHeaders;
import com.redesignhealth.company.api.service.CompanyService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.PagedModel;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@IncludeSecurityHeaders
@RequestMapping("/company")
@Tag(name = "Company")
public class CompanyController {

  private final CompanyAssembler companyAssembler;
  private final CompanyMemberAssembler companyMemberAssembler;
  private final CompanyDtoAssembler companyDtoAssembler;
  private final CompanyMemberAuditAssembler companyMemberAuditAssembler;
  private final PagedResourcesAssembler<Company> pagedResourcesAssembler;
  private final PagedResourcesAssembler<CompanyDto> pagedResourcesAssemblerDto;

  private final CompanyService companyService;

  public CompanyController(
      CompanyAssembler companyAssembler,
      PagedResourcesAssembler<Company> pagedResourcesAssembler,
      CompanyService companyService,
      CompanyDtoAssembler companyDtoAssembler,
      PagedResourcesAssembler<CompanyDto> pagedResourcesAssemblerDto,
      CompanyMemberAuditAssembler companyMemberAuditAssembler) {
    this.companyAssembler = companyAssembler;
    this.companyService = companyService;
    this.companyMemberAssembler = new CompanyMemberAssembler();
    this.companyDtoAssembler = companyDtoAssembler;
    this.pagedResourcesAssembler = pagedResourcesAssembler;
    this.pagedResourcesAssemblerDto = pagedResourcesAssemblerDto;
    this.companyMemberAuditAssembler = companyMemberAuditAssembler;
  }

  @GetMapping
  public PagedModel<CompanyDtoSummary> getAll(
      @ParameterObject Pageable pageable, @RequestParam Optional<List<Expansion>> expand) {
    Page<CompanyDto> results = companyService.getList(pageable, expand.orElse(List.of()));
    return pagedResourcesAssemblerDto.toModel(results, companyDtoAssembler);
  }

  @GetMapping(COMPANY_ID)
  @PreAuthorize("@authChecks.isMember(authentication, #apiId, 'ROLE_OP_CO_CONTRACTOR')")
  public CompanyDtoSummary get(
      @ParameterObject CompanyRef apiId, @RequestParam Optional<List<Expansion>> expand) {
    CompanyDto companyDto = companyService.get(apiId, expand.orElse(List.of()));
    return companyDtoAssembler
        .toModel(companyDto)
        .add(linkTo(CompanyController.class).withRel("companies"));
  }

  @Operation(summary = "Create")
  @PreAuthorize("@authChecks.isAdmin(authentication)")
  @PostMapping
  public ResponseEntity<CompanySummary> create(@Valid @RequestBody CompanyCommand command) {
    Company company = companyService.create(command);
    var result = companyAssembler.toModel(company);
    return new ResponseEntity<>(result, CREATED);
  }

  @Operation(summary = "Update")
  @PreAuthorize("@authChecks.isAdmin(authentication)")
  @PutMapping(COMPANY_ID)
  public CompanyDtoSummary update(
      @ParameterObject CompanyRef apiId, @Valid @RequestBody CompanyCommand updates) {
    CompanyDto companyDto = companyService.update(apiId, updates);
    return companyDtoAssembler.toModel(companyDto);
  }

  @PreAuthorize("@authChecks.isMember(authentication, #apiId, 'ROLE_OP_CO_CONTRACTOR')")
  @GetMapping(COMPANY_ID + "/members")
  public CollectionModel<CompanyMemberSummary> getMembers(@ParameterObject CompanyRef apiId) {
    var members = companyService.getMembers(apiId);
    return companyMemberAssembler
        .toCollectionModel(members)
        .add(linkTo(CompanyController.class).slash(apiId).withRel("company"));
  }

  @Operation(summary = "Add a user")
  @PreAuthorize("@authChecks.isAdmin(authentication)")
  @PutMapping(COMPANY_ID + "/member" + EMAIL)
  public EntityModel<Map<Object, Object>> addPerson(
      @ParameterObject CompanyRef apiId,
      @ParameterObject PersonRef email,
      @Valid @RequestBody CompanyMemberCommand companyMemberCommand) {
    companyService.addMember(apiId, email, companyMemberCommand);

    return EntityModel.of(Map.of())
        .add(linkTo(CompanyController.class).slash(apiId).slash("members").withRel("members"))
        .add(linkTo(CompanyController.class).slash(apiId).withRel("company"));
  }

  @Operation(summary = "Add Conflicts")
  @PreAuthorize("@authChecks.isMember(authentication, #apiId, 'ROLE_OP_CO_CONTRACTOR')")
  @PutMapping(COMPANY_ID + "/conflicts")
  public EntityModel<Map<Object, Object>> addConflicts(
      @ParameterObject CompanyRef apiId,
      @Valid @RequestBody CompanyConflictsCommand companyConflictsCommand) {
    companyService.upsertConflicts(apiId, companyConflictsCommand);

    return EntityModel.of(Map.of())
        .add(linkTo(CompanyController.class).slash(apiId).slash("conflicts").withRel("conflicts"))
        .add(linkTo(CompanyController.class).slash(apiId).withRel("companies"));
  }

  @Operation(summary = "Return Conflicts")
  @PreAuthorize("@authChecks.isMember(authentication, #apiId, 'ROLE_OP_CO_CONTRACTOR')")
  @GetMapping(COMPANY_ID + "/conflicts")
  public CollectionModel<CompanyDtoSummary> getConflicts(@ParameterObject CompanyRef apiId) {
    var conflicts = companyService.getConflicts(apiId);
    return companyDtoAssembler
        .toCollectionModel(conflicts)
        .add(linkTo(CompanyController.class).slash(apiId).withRel("company"));
  }

  @Operation(summary = "Remove a user")
  @PreAuthorize("@authChecks.isAdmin(authentication)")
  @DeleteMapping(COMPANY_ID + "/member" + EMAIL)
  public EntityModel<Map<Object, Object>> removePerson(
      @ParameterObject CompanyRef apiId, @ParameterObject PersonRef email) {
    companyService.removeMember(apiId, email);

    return EntityModel.of(Map.of())
        .add(linkTo(CompanyController.class).slash(apiId).slash("members").withRel("members"))
        .add(linkTo(CompanyController.class).slash(apiId).withRel("company"));
  }

  @PreAuthorize("@authChecks.isAdmin(authentication)")
  @DeleteMapping(COMPANY_ID)
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public ResponseEntity<Void> delete(@ParameterObject CompanyRef apiId) {
    companyService.delete(apiId);

    return new ResponseEntity<>(HttpStatus.NO_CONTENT);
  }
}
