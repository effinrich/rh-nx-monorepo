package com.redesignhealth.company.api.controller;

import static com.redesignhealth.company.api.controller.util.Paths.CATEGORY_ID;
import static com.redesignhealth.company.api.controller.util.Paths.SUB_CATEGORY_ID;
import static org.springframework.http.HttpStatus.CREATED;

import com.redesignhealth.company.api.dto.SubcategorySummary;
import com.redesignhealth.company.api.dto.command.SubcategoryCommand;
import com.redesignhealth.company.api.entity.ref.CategoryRef;
import com.redesignhealth.company.api.entity.ref.SubcategoryRef;
import com.redesignhealth.company.api.openapi.IncludeSecurityHeaders;
import com.redesignhealth.company.api.service.SubcategoryService;
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
@RequestMapping("/categories" + CATEGORY_ID + "/subcategories")
@Tag(name = "Categories")
public class SubcategoryController {
  private final SubcategoryService subcategoryService;

  public SubcategoryController(SubcategoryService subcategoryService) {
    this.subcategoryService = subcategoryService;
  }

  @GetMapping
  @PreAuthorize("@authChecks.isAdmin(authentication)")
  public List<SubcategorySummary> getAll(
      @ParameterObject CategoryRef categoryId, @RequestParam Optional<String> q) {
    return subcategoryService.getAll(categoryId, q.orElse(null));
  }

  @GetMapping(SUB_CATEGORY_ID)
  @PreAuthorize("@authChecks.isAdmin(authentication)")
  public SubcategorySummary get(
      @ParameterObject CategoryRef categoryId, @ParameterObject SubcategoryRef subcategoryId) {
    return subcategoryService.get(subcategoryId);
  }

  @PostMapping
  @PreAuthorize("@authChecks.isAdmin(authentication)")
  public ResponseEntity<SubcategorySummary> create(
      @ParameterObject CategoryRef categoryId, @Valid @RequestBody SubcategoryCommand command) {
    var result = subcategoryService.create(categoryId, command);
    return new ResponseEntity<>(result, CREATED);
  }

  @PutMapping(SUB_CATEGORY_ID)
  @PreAuthorize("@authChecks.isAdmin(authentication)")
  public SubcategorySummary update(
      @ParameterObject CategoryRef categoryId,
      @ParameterObject SubcategoryRef subcategoryId,
      @Valid @RequestBody SubcategoryCommand command) {
    return subcategoryService.update(subcategoryId, command);
  }

  @DeleteMapping(SUB_CATEGORY_ID)
  @PreAuthorize("@authChecks.isAdmin(authentication)")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public ResponseEntity<Void> delete(
      @ParameterObject CategoryRef categoryId, @ParameterObject SubcategoryRef subcategoryId) {
    subcategoryService.delete(subcategoryId);
    return new ResponseEntity<>(HttpStatus.NO_CONTENT);
  }
}
