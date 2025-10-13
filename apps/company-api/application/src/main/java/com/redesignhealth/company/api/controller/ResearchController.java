package com.redesignhealth.company.api.controller;

import static com.redesignhealth.company.api.controller.util.Paths.RESEARCH_ID;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;
import static org.springframework.http.HttpStatus.CREATED;
import static org.springframework.http.HttpStatus.NO_CONTENT;

import com.redesignhealth.company.api.assembler.ResearchAssembler;
import com.redesignhealth.company.api.dto.FilterOptionsSummary;
import com.redesignhealth.company.api.dto.ResearchSummary;
import com.redesignhealth.company.api.dto.command.ResearchCommand;
import com.redesignhealth.company.api.entity.ref.ResearchRef;
import com.redesignhealth.company.api.entity.research.Research;
import com.redesignhealth.company.api.expansion.Expansion;
import com.redesignhealth.company.api.openapi.IncludeSecurityHeaders;
import com.redesignhealth.company.api.service.ResearchService;
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
@Tag(name = "Research")
@RequestMapping("/research")
public class ResearchController {

  private final PagedResourcesAssembler<Research> pagedResourcesAssembler;
  private final ResearchAssembler researchAssembler;
  private final ResearchService researchService;

  public ResearchController(
      PagedResourcesAssembler<Research> pagedResourcesAssembler, ResearchService researchService) {
    this.pagedResourcesAssembler = pagedResourcesAssembler;
    this.researchAssembler = new ResearchAssembler();
    this.researchService = researchService;
  }

  @GetMapping
  @PreAuthorize("@authChecks.hasRoleOrHigher(authentication, 'ROLE_OP_CO_USER')")
  public PagedModel<ResearchSummary> query(
      @RequestParam Optional<String> q,
      @RequestParam Optional<List<String>> filter,
      @ParameterObject Pageable pageable,
      @RequestParam Optional<List<Expansion>> expand) {
    return pagedResourcesAssembler.toModel(
        researchService.query(
            q.orElse(null), filter.orElse(List.of()), pageable, expand.orElse(List.of())),
        researchAssembler);
  }

  @PostMapping
  @ResponseStatus(CREATED)
  @PreAuthorize("@authChecks.hasRoleOrHigher(authentication, 'ROLE_RH_USER')")
  public ResponseEntity<ResearchSummary> create(@Valid @RequestBody ResearchCommand command) {
    var result = researchAssembler.toModel(researchService.create(command));
    return new ResponseEntity<>(result, CREATED);
  }

  @GetMapping("filters")
  @PreAuthorize("@authChecks.hasRoleOrHigher(authentication, 'ROLE_OP_CO_USER')")
  public CollectionModel<FilterOptionsSummary> getFilters() {
    return CollectionModel.of(
            researchService.getFilters().stream().map(FilterOptionsSummary::from).toList())
        .add(linkTo(ResearchController.class).slash("research").withRel("research"))
        .add(linkTo(methodOn(ResearchController.class).getFilters()).withRel("self"));
  }

  @DeleteMapping(RESEARCH_ID)
  @PreAuthorize("@authChecks.isAdmin(authentication)")
  @ResponseStatus(NO_CONTENT)
  public ResponseEntity<Void> delete(@ParameterObject ResearchRef researchId) {
    researchService.delete(researchId);
    return ResponseEntity.status(NO_CONTENT).build();
  }

  @GetMapping(RESEARCH_ID)
  @PreAuthorize("@authChecks.hasRoleOrHigher(authentication, 'ROLE_OP_CO_USER')")
  public ResearchSummary get(@ParameterObject ResearchRef researchId) {
    return researchAssembler.toModel(researchService.get(researchId));
  }
}
