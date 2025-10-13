package com.redesignhealth.company.api.controller;

import static com.redesignhealth.company.api.controller.util.Paths.CATEGORY_ID;
import static org.springframework.http.HttpStatus.CREATED;

import com.redesignhealth.company.api.client.search.command.SearchCommand;
import com.redesignhealth.company.api.dto.CategorySummary;
import com.redesignhealth.company.api.dto.command.CategoryCommand;
import com.redesignhealth.company.api.entity.ref.CategoryRef;
import com.redesignhealth.company.api.expansion.Expansion;
import com.redesignhealth.company.api.openapi.IncludeSecurityHeaders;
import com.redesignhealth.company.api.service.CategoryService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import java.util.Optional;
import org.springdoc.core.annotations.ParameterObject;
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
@RequestMapping("/categories")
@Tag(name = "Categories")
public class CategoryController {
  private final CategoryService categoryService;

  public CategoryController(CategoryService categoryService) {
    this.categoryService = categoryService;
  }

  @GetMapping
  @PreAuthorize("@authChecks.hasRoleOrHigher(authentication, 'ROLE_OP_CO_USER')")
  public List<CategorySummary> getAll(
      @RequestParam Optional<String> q,
      @RequestParam Optional<List<String>> filter,
      @RequestParam Optional<List<Expansion>> expand) {
    var sanitizedFilters =
        filter.orElse(List.of()).stream().map(SearchCommand::convertQueryParam).toList();
    return categoryService.getAll(q.orElse(null), sanitizedFilters, expand.orElse(List.of()));
  }

  @GetMapping(CATEGORY_ID)
  @PreAuthorize("@authChecks.hasRoleOrHigher(authentication, 'ROLE_OP_CO_USER')")
  public CategorySummary get(@ParameterObject CategoryRef apiId) {
    return categoryService.get(apiId);
  }

  @PostMapping
  @PreAuthorize("@authChecks.isAdmin(authentication)")
  public ResponseEntity<CategorySummary> create(@Valid @RequestBody CategoryCommand command) {
    var result = categoryService.create(command);
    return new ResponseEntity<>(result, CREATED);
  }

  @PutMapping(CATEGORY_ID)
  @PreAuthorize("@authChecks.isAdmin(authentication)")
  public CategorySummary update(
      @ParameterObject CategoryRef apiId, @Valid @RequestBody CategoryCommand command) {
    return categoryService.update(apiId, command);
  }

  @DeleteMapping(CATEGORY_ID)
  @PreAuthorize("@authChecks.isAdmin(authentication)")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public ResponseEntity<Void> delete(@ParameterObject CategoryRef apiId) {
    categoryService.delete(apiId);
    return new ResponseEntity<>(HttpStatus.NO_CONTENT);
  }
}
