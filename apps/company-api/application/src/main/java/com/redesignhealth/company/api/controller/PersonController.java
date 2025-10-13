package com.redesignhealth.company.api.controller;

import static com.redesignhealth.company.api.controller.util.Paths.*;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.http.HttpStatus.CREATED;

import com.redesignhealth.company.api.assembler.CompanyMemberAuditAssembler;
import com.redesignhealth.company.api.assembler.PersonAssembler;
import com.redesignhealth.company.api.dto.CompanyMemberAuditSummary;
import com.redesignhealth.company.api.dto.PersonSummary;
import com.redesignhealth.company.api.dto.command.CreatePersonCommand;
import com.redesignhealth.company.api.dto.command.PersonCommand;
import com.redesignhealth.company.api.entity.Person;
import com.redesignhealth.company.api.entity.ref.PersonRef;
import com.redesignhealth.company.api.entity.request.RoleAuthority;
import com.redesignhealth.company.api.exception.RoleNotFoundException;
import com.redesignhealth.company.api.expansion.Expansion;
import com.redesignhealth.company.api.openapi.IncludeSecurityHeaders;
import com.redesignhealth.company.api.service.PersonService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.PagedModel;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@IncludeSecurityHeaders
@RequestMapping("/person")
@Tag(name = "Person", description = "User access and settings")
public class PersonController {
  private final PersonAssembler personAssembler;
  private final PagedResourcesAssembler<Person> pagedResourcesAssembler;
  private final PersonService personService;
  private final CompanyMemberAuditAssembler companyMemberAuditAssembler;

  public PersonController(
      PagedResourcesAssembler<Person> pagedResourcesAssembler,
      PersonService personService,
      CompanyMemberAuditAssembler companyMemberAuditAssembler) {
    this.personAssembler = new PersonAssembler();
    this.pagedResourcesAssembler = pagedResourcesAssembler;
    this.personService = personService;
    this.companyMemberAuditAssembler = companyMemberAuditAssembler;
  }

  @GetMapping
  @PreAuthorize("@authChecks.hasRoleOrHigher(authentication, 'ROLE_RH_USER')")
  public PagedModel<PersonSummary> getAll(
      @ParameterObject Pageable pageable, @RequestParam Optional<List<Expansion>> expand) {
    Page<Person> results = personService.getList(pageable, expand.orElse(List.of()));

    return pagedResourcesAssembler.toModel(results, personAssembler);
  }

  @GetMapping(EMAIL)
  @PreAuthorize("@authChecks.hasRoleOrHigher(authentication, 'ROLE_OP_CO_USER')")
  public PersonSummary getOne(
      @ParameterObject PersonRef email, @RequestParam Optional<List<Expansion>> expand) {
    var person = personService.get(email, expand.orElse(List.of()));
    return personAssembler.toModel(person);
  }

  @PostMapping
  @PreAuthorize("@authChecks.isAdmin(authentication)")
  public ResponseEntity<PersonSummary> create(@Valid @RequestBody CreatePersonCommand command) {
    var result = personAssembler.toModel(personService.create(command));
    return new ResponseEntity<>(result, CREATED);
  }

  @Operation(summary = "Create or update")
  @PreAuthorize("@authChecks.isAdmin(authentication)")
  @PutMapping(EMAIL)
  public PersonSummary update(
      @ParameterObject PersonRef email, @RequestBody PersonCommand updates) {
    return personAssembler.toModel(personService.update(email, updates));
  }

  @Operation(summary = "Add a role")
  @PreAuthorize("@authChecks.isAdmin(authentication)")
  @PutMapping(EMAIL + "/role/{authority}")
  public EntityModel<Map<Object, Object>> addRole(
      @ParameterObject PersonRef email,
      @Schema(implementation = RoleAuthority.class) @PathVariable("authority") String authority) {

    personService.addRole(email, convertAuthority(authority));
    return EntityModel.of(Map.of())
        .add(linkTo(PersonController.class).slash(email).withRel("person"));
  }

  @Operation(summary = "Remove a role")
  @PreAuthorize("@authChecks.isAdmin(authentication)")
  @DeleteMapping(EMAIL + "/role/{authority}")
  public EntityModel<Map<Object, Object>> removeRole(
      @ParameterObject PersonRef email,
      @Schema(implementation = RoleAuthority.class) @PathVariable("authority") String authority) {
    convertAuthority(authority);
    personService.removeRole(email);
    return EntityModel.of(Map.of())
        .add(linkTo(PersonController.class).slash(email).withRel("person"));
  }

  @PreAuthorize("@authChecks.isAdmin(authentication)")
  @DeleteMapping(EMAIL)
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public ResponseEntity<Void> delete(@ParameterObject PersonRef email) {
    personService.delete(email);
    return new ResponseEntity<>(HttpStatus.NO_CONTENT);
  }

  @GetMapping(EMAIL + "/changes")
  public CompanyMemberAuditSummary getMembersChange(@ParameterObject PersonRef email) {
    var memberChanges = personService.getMemberChanges(email);
    return companyMemberAuditAssembler.toModel(memberChanges);
  }

  private RoleAuthority convertAuthority(String authority) {
    try {
      return RoleAuthority.valueOf(authority);
    } catch (IllegalArgumentException e) {
      throw new RoleNotFoundException();
    }
  }
}
