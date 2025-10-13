package com.redesignhealth.company.api.service;

import com.redesignhealth.company.api.dto.CategorySummary;
import com.redesignhealth.company.api.dto.SubcategorySummary;
import com.redesignhealth.company.api.dto.command.CategoryCommand;
import com.redesignhealth.company.api.dto.command.SubcategoryCommand;
import com.redesignhealth.company.api.entity.Category;
import com.redesignhealth.company.api.entity.Subcategory;
import com.redesignhealth.company.api.entity.id.ApiIdGenerator;
import com.redesignhealth.company.api.entity.ref.CategoryRef;
import com.redesignhealth.company.api.entity.ref.SubcategoryRef;
import com.redesignhealth.company.api.exception.SubcategoryNotFoundException;
import com.redesignhealth.company.api.exception.dto.FieldErrorType;
import com.redesignhealth.company.api.repository.SubcategoryRepository;
import com.redesignhealth.company.api.service.helper.BuilderForException;
import jakarta.annotation.Nullable;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.Set;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.exception.ConstraintViolationException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class SubcategoryService {
  private final SubcategoryRepository subcategoryRepository;
  private final CategoryService categoryService;
  private final Random rand;

  public SubcategoryService(
      SubcategoryRepository subcategoryRepository, CategoryService categoryService) {
    this.subcategoryRepository = subcategoryRepository;
    this.categoryService = categoryService;
    rand = new Random();
  }

  public SubcategorySummary create(CategoryRef categoryRef, SubcategoryCommand command) {
    var category = categoryService.getByApiId(categoryRef);
    SubcategoryRef newId = null;
    while (newId == null) {
      SubcategoryRef potential = SubcategoryRef.of(ApiIdGenerator.generate());
      if (!subcategoryRepository.existsByApiId(potential)) {
        newId = potential;
      } else {
        log.warn("ID: \"{}\" collision detected when creating subcategory", potential);
      }
    }
    var newSubcategory = Subcategory.of(category, newId);
    return save(category, newSubcategory, command);
  }

  public SubcategorySummary update(SubcategoryRef apiId, SubcategoryCommand command) {
    var subcategory =
        subcategoryRepository
            .findSubcategoryByApiId(apiId)
            .orElseThrow(SubcategoryNotFoundException::new);
    return save(subcategory.getCategory(), subcategory, command);
  }

  public void delete(SubcategoryRef apiId) {
    var subcategory =
        subcategoryRepository
            .findSubcategoryByApiId(apiId)
            .orElseThrow(SubcategoryNotFoundException::new);
    subcategoryRepository.delete(subcategory);
  }

  public SubcategorySummary get(SubcategoryRef apiId) {
    var subcategory =
        subcategoryRepository
            .findSubcategoryByApiId(apiId)
            .orElseThrow(SubcategoryNotFoundException::new);
    return SubcategorySummary.from(
        CategorySummary.from(subcategory.getCategory()),
        subcategory.getApiId().value(),
        subcategory.getName());
  }

  public List<SubcategorySummary> getAll(CategoryRef categoryRef, @Nullable String q) {
    var category = categoryService.getByApiId(categoryRef);
    var subcategoryList =
        (q != null)
            ? subcategoryRepository.findByNameContainingAndCategory(q, category)
            : subcategoryRepository.findByCategory(category);
    return new ArrayList<>(
        subcategoryList.stream()
            .map(
                x ->
                    SubcategorySummary.from(
                        CategorySummary.from(category), x.getApiId().value(), x.getName()))
            .toList());
  }

  public Set<Subcategory> processSubcategories(List<SubcategorySummary> subcategories) {
    List<SubcategorySummary> processed = new ArrayList<>();
    int position = 0;
    for (SubcategorySummary subcategorySummary : subcategories) {
      CategorySummary categorySummary = subcategorySummary.getCategory();
      if (subcategorySummary.getCategory().getApiId() == null
          || subcategorySummary.getCategory().getApiId().isEmpty()) {
        checkForName(
            subcategorySummary.getCategory().getName(),
            "subcategories[" + position + "].Category.name");
        var categoryCommand = CategoryCommand.of(subcategorySummary.getCategory().getName());
        categorySummary = categoryService.create(categoryCommand);
      } else {
        if (subcategorySummary.getApiId() != null && !subcategorySummary.getApiId().isEmpty()) {
          var category =
              categoryService.getByApiId(
                  CategoryRef.of(subcategorySummary.getCategory().getApiId()));
          if (subcategoryRepository.findByCategory(category).stream()
                  .filter(x -> x.getApiId().value().equals(subcategorySummary.getApiId()))
                  .toList()
                  .size()
              == 0)
            BuilderForException.buildInvalidFieldException(
                "subcategories[" + position + "].apiId-> Category.apiId",
                subcategorySummary.getApiId(),
                FieldErrorType.NOT_BELONG);
        }
      }
      if (subcategorySummary.getName() == null && subcategorySummary.getApiId() == null)
        subcategorySummary.setName(categorySummary.getName() + "_" + Math.abs(rand.nextInt()));
      checkForName(subcategorySummary.getName(), "subcategories[" + position + "].name");
      SubcategorySummary subcategorySummaryNew =
          SubcategorySummary.from(
              categorySummary, subcategorySummary.getApiId(), subcategorySummary.getName());
      if (subcategorySummaryNew.getApiId() == null || subcategorySummaryNew.getApiId().isEmpty()) {
        var subcategoryCommand = new SubcategoryCommand();
        subcategoryCommand.setName(subcategorySummaryNew.getName());
        subcategorySummaryNew =
            create(CategoryRef.of(categorySummary.getApiId()), subcategoryCommand);
      } else {
        if (!subcategoryRepository.existsByApiId(
            SubcategoryRef.of(subcategorySummaryNew.getApiId())))
          BuilderForException.buildInvalidFieldException(
              "subcategories[" + position + "].apiId",
              subcategorySummaryNew.getApiId(),
              FieldErrorType.EXISTS);
      }
      processed.add(subcategorySummaryNew);
      ++position;
    }
    var subcategoryRefs = processed.stream().map(x -> SubcategoryRef.of(x.getApiId())).toList();
    return getSubCategoriesByIds(subcategoryRefs);
  }

  private Set<Subcategory> getSubCategoriesByIds(List<SubcategoryRef> apiIds) {
    return subcategoryRepository.findByApiIdIn(apiIds);
  }

  private SubcategorySummary save(
      Category category, Subcategory subcategory, SubcategoryCommand command) {
    try {
      subcategory.setName(command.getName());
      subcategoryRepository.saveAndFlush(subcategory);
      return SubcategorySummary.from(
          CategorySummary.from(category), subcategory.getApiId().value(), subcategory.getName());
    } catch (DataIntegrityViolationException e) {
      log.warn("Unable to save subcategory", e);
      if (e.getCause() instanceof ConstraintViolationException) {
        BuilderForException.buildInvalidFieldException(
            "Subcategory.name", subcategory.getName(), FieldErrorType.UNIQUE);
      }
      throw e;
    }
  }

  private void checkForName(String value, String fieldName) {
    if (value == null)
      BuilderForException.buildInvalidFieldException(fieldName, null, FieldErrorType.NOT_NULL);
    if (value.isEmpty())
      BuilderForException.buildInvalidFieldException(fieldName, value, FieldErrorType.NOT_EMPTY);
  }
}
