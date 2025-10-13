package com.redesignhealth.company.api.controller;

import static org.springframework.http.HttpStatus.CREATED;

import com.redesignhealth.company.api.assembler.ResearchArticleAssembler;
import com.redesignhealth.company.api.dto.FilterOptionsSummary;
import com.redesignhealth.company.api.dto.ResearchArticleSummary;
import com.redesignhealth.company.api.dto.command.ResearchArticleCommand;
import com.redesignhealth.company.api.entity.ResearchArticle;
import com.redesignhealth.company.api.openapi.IncludeSecurityHeaders;
import com.redesignhealth.company.api.service.ResearchArticleService;
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
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@IncludeSecurityHeaders
@Tag(name = "Research Article")
@RequestMapping("/research-article")
public class ResearchArticleController {
  private final ResearchArticleAssembler researchArticleAssembler;
  private final ResearchArticleService researchArticleService;
  private final PagedResourcesAssembler<ResearchArticle> pagedResourcesAssembler;

  public ResearchArticleController(
      ResearchArticleService researchArticleService,
      PagedResourcesAssembler<ResearchArticle> pagedResourcesAssembler) {
    this.researchArticleAssembler = new ResearchArticleAssembler();
    this.researchArticleService = researchArticleService;
    this.pagedResourcesAssembler = pagedResourcesAssembler;
  }

  @PostMapping
  @PreAuthorize("@authChecks.hasRoleOrHigher(authentication, 'ROLE_RH_USER')")
  public ResponseEntity<ResearchArticleSummary> create(
      @Valid @RequestBody ResearchArticleCommand command) {
    var result = researchArticleAssembler.toModel(researchArticleService.create(command));
    return new ResponseEntity<>(result, CREATED);
  }

  @GetMapping("/filters")
  @PreAuthorize("@authChecks.hasRoleOrHigher(authentication, 'ROLE_RH_USER')")
  public CollectionModel<FilterOptionsSummary> getFilters() {
    return CollectionModel.of(
        researchArticleService.getFilters().stream().map(FilterOptionsSummary::from).toList());
  }

  @GetMapping
  @PreAuthorize("@authChecks.hasRoleOrHigher(authentication, 'ROLE_RH_USER')")
  public PagedModel<ResearchArticleSummary> query(
      @RequestParam Optional<String> q,
      @RequestParam Optional<List<String>> filter,
      @ParameterObject Pageable pageable) {
    return pagedResourcesAssembler.toModel(
        researchArticleService.query(q.orElse(null), filter.orElse(List.of()), pageable),
        researchArticleAssembler);
  }
}
