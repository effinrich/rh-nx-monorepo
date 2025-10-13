package com.redesignhealth.company.api.service;

import static com.redesignhealth.company.api.util.SpecificationUtil.searchAndFilter;

import com.redesignhealth.company.api.dto.CategorySummary;
import com.redesignhealth.company.api.dto.SearchFilter;
import com.redesignhealth.company.api.dto.command.CategoryCommand;
import com.redesignhealth.company.api.entity.Category;
import com.redesignhealth.company.api.entity.id.ApiIdGenerator;
import com.redesignhealth.company.api.entity.ref.CategoryRef;
import com.redesignhealth.company.api.exception.CategoryNotFoundException;
import com.redesignhealth.company.api.exception.UnsupportedExpansionException;
import com.redesignhealth.company.api.exception.dto.FieldErrorType;
import com.redesignhealth.company.api.expansion.Expansion;
import com.redesignhealth.company.api.repository.CategoryRepository;
import com.redesignhealth.company.api.service.helper.BuilderForException;
import jakarta.annotation.Nullable;
import jakarta.transaction.Transactional;
import java.util.List;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.Hibernate;
import org.hibernate.exception.ConstraintViolationException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class CategoryService {
  private static final Logger logger = LoggerFactory.getLogger(CompanyService.class);
  private final CategoryRepository categoryRepository;

  private static final List<String> SEARCHABLE_COLUMNS = List.of("name");

  public CategoryService(CategoryRepository categoryRepository) {
    this.categoryRepository = categoryRepository;
  }

  public CategorySummary create(CategoryCommand command) {
    CategoryRef newId = null;
    while (newId == null) {
      CategoryRef potential = CategoryRef.of(ApiIdGenerator.generate());
      if (!categoryRepository.existsByApiId(potential)) {
        newId = potential;
      } else {
        logger.warn("ID: \"{}\" collision detected when creating category", potential);
      }
    }
    var newCategory = Category.from(newId);
    return save(newCategory, command);
  }

  public CategorySummary update(CategoryRef apiId, CategoryCommand command) {
    var category =
        categoryRepository.findCategoryByApiId(apiId).orElseThrow(CategoryNotFoundException::new);
    return save(category, command);
  }

  public void delete(CategoryRef apiId) {
    var category =
        categoryRepository.findCategoryByApiId(apiId).orElseThrow(CategoryNotFoundException::new);
    categoryRepository.delete(category);
  }

  public CategorySummary get(CategoryRef apiId) {
    return CategorySummary.from(getByApiId(apiId));
  }

  @Transactional
  public List<CategorySummary> getAll(
      @Nullable String q, List<SearchFilter> filters, List<Expansion> expansions) {
    var expansion = initializeExpansion(expansions);
    var listCategories =
        categoryRepository.findAll(searchAndFilter(q, SEARCHABLE_COLUMNS, filters));
    if (expansion != null) {
      listCategories.forEach(x -> Hibernate.initialize(x.getSubcategories()));
    }
    return listCategories.stream().map(CategorySummary::from).toList();
  }

  public Category getByApiId(CategoryRef apiId) {
    return categoryRepository
        .findCategoryByApiId(apiId)
        .orElseThrow(CategoryNotFoundException::new);
  }

  private CategorySummary save(Category category, CategoryCommand command) {
    try {
      category.setName(command.getName());
      categoryRepository.saveAndFlush(category);
      return CategorySummary.from(category);
    } catch (DataIntegrityViolationException e) {
      logger.warn("Unable to save category", e);
      if (e.getCause() instanceof ConstraintViolationException) {
        BuilderForException.buildInvalidFieldException(
            "Category.name", category.getName(), FieldErrorType.UNIQUE);
      }
      throw e;
    }
  }

  private Expansion initializeExpansion(List<Expansion> expansions) {
    Expansion expansion = null;
    if (expansions.size() > 0) {
      expansion = expansions.get(0);
      if (!expansion.equals(Expansion.SUBCATEGORIES))
        throw new UnsupportedExpansionException(expansion);
    }
    return expansion;
  }
}
