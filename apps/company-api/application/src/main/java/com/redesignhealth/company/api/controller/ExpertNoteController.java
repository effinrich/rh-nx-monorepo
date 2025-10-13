package com.redesignhealth.company.api.controller;

import static com.redesignhealth.company.api.controller.util.Paths.EXPERT_NOTE_ID;
import static org.springframework.http.HttpStatus.CREATED;
import static org.springframework.http.HttpStatus.NO_CONTENT;

import com.redesignhealth.company.api.assembler.ExpertNoteAssembler;
import com.redesignhealth.company.api.dto.ExpertNoteSummary;
import com.redesignhealth.company.api.dto.FilterOptionsSummary;
import com.redesignhealth.company.api.dto.command.ExpertNoteCommand;
import com.redesignhealth.company.api.entity.ExpertNote;
import com.redesignhealth.company.api.entity.ref.ExpertNoteRef;
import com.redesignhealth.company.api.expansion.Expansion;
import com.redesignhealth.company.api.openapi.IncludeSecurityHeaders;
import com.redesignhealth.company.api.service.ExpertNoteService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import java.util.Optional;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.PagedModel;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@IncludeSecurityHeaders
@Tag(name = "Expert Notes")
@RequestMapping("/expert-note")
public class ExpertNoteController {

  private final ExpertNoteService expertNoteService;
  private final ExpertNoteAssembler expertNoteAssembler;
  private final PagedResourcesAssembler<ExpertNote> pagedResourcesAssembler;

  public ExpertNoteController(
      ExpertNoteService expertNoteService,
      PagedResourcesAssembler<ExpertNote> pagedResourcesAssembler) {
    this.expertNoteService = expertNoteService;
    this.pagedResourcesAssembler = pagedResourcesAssembler;
    this.expertNoteAssembler = new ExpertNoteAssembler();
  }

  @GetMapping
  @PreAuthorize("@authChecks.hasRoleOrHigher(authentication, 'ROLE_OP_CO_USER')")
  public PagedModel<ExpertNoteSummary> query(
      @RequestParam Optional<String> q,
      @RequestParam Optional<List<String>> filter,
      @ParameterObject Pageable pageable,
      @RequestParam Optional<List<Expansion>> expand) {
    return pagedResourcesAssembler.toModel(
        expertNoteService.query(
            q.orElse(null), filter.orElse(List.of()), pageable, expand.orElse(List.of())),
        expertNoteAssembler);
  }

  @PostMapping
  @PreAuthorize("@authChecks.hasRoleOrHigher(authentication, 'ROLE_RH_USER')")
  @ResponseStatus(CREATED)
  public ResponseEntity<ExpertNoteSummary> create(@Valid @RequestBody ExpertNoteCommand command) {
    return new ResponseEntity<>(
        expertNoteAssembler.toModel(expertNoteService.create(command)), CREATED);
  }

  @GetMapping("/filters")
  @PreAuthorize("@authChecks.hasRoleOrHigher(authentication, 'ROLE_RH_USER')")
  public CollectionModel<FilterOptionsSummary> getFilters() {
    return CollectionModel.of(
        expertNoteService.getFilters().stream().map(FilterOptionsSummary::from).toList());
  }

  @GetMapping(EXPERT_NOTE_ID)
  @PreAuthorize("@authChecks.hasRoleOrHigher(authentication, 'ROLE_OP_CO_USER')")
  public ExpertNoteSummary get(@ParameterObject ExpertNoteRef expertNoteId) {
    return expertNoteAssembler.toModel(expertNoteService.get(expertNoteId));
  }

  @DeleteMapping(EXPERT_NOTE_ID)
  @PreAuthorize("@authChecks.isAdmin(authentication)")
  @ResponseStatus(NO_CONTENT)
  public ResponseEntity<Void> delete(@ParameterObject ExpertNoteRef expertNoteId) {
    expertNoteService.delete(expertNoteId);
    return ResponseEntity.status(NO_CONTENT).build();
  }
}
