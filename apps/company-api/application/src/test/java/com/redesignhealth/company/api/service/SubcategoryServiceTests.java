package com.redesignhealth.company.api.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.when;

import com.redesignhealth.company.api.dto.CategorySummary;
import com.redesignhealth.company.api.dto.SubcategorySummary;
import com.redesignhealth.company.api.dto.command.CategoryCommand;
import com.redesignhealth.company.api.entity.Category;
import com.redesignhealth.company.api.entity.Subcategory;
import com.redesignhealth.company.api.entity.ref.CategoryRef;
import com.redesignhealth.company.api.entity.ref.SubcategoryRef;
import com.redesignhealth.company.api.exception.CategoryNotFoundException;
import com.redesignhealth.company.api.exception.InvalidFieldException;
import com.redesignhealth.company.api.exception.dto.FieldErrorType;
import com.redesignhealth.company.api.repository.SubcategoryRepository;
import com.redesignhealth.company.api.service.helper.BuilderForException;
import java.util.List;
import java.util.Set;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
public class SubcategoryServiceTests {
  @Mock private SubcategoryRepository subcategoryRepository;
  @Mock private CategoryService categoryService;

  private SubcategoryService subcategoryService;

  @BeforeEach
  public void setup() {
    subcategoryService = new SubcategoryService(subcategoryRepository, categoryService);
  }

  @Test
  public void testProcessSubcategories_Should_Fail_If_ApiId_Null_And_Name_Exists() {
    testApiIdBlankNameExistentFail(null);
  }

  @Test
  public void testProcessSubcategories_Should_Fail_If_ApiId_Empty_And_Name_Exists() {
    testApiIdBlankNameExistentFail("");
  }

  @Test
  public void
      testProcessSubcategories_Should_Fail_If_Category_ApiId_Empty_And_Category_Name_Empty() {
    testCategoryApiIdAndCategoryNameBlank("", "");
  }

  @Test
  public void
      testProcessSubcategories_Should_Fail_If_Category_ApiId_Null_And_Category_Name_Empty() {
    testCategoryApiIdAndCategoryNameBlank(null, "");
  }

  @Test
  public void
      testProcessSubcategories_Should_Fail_If_Category_ApiId_Empty_And_Category_Name_null() {
    testCategoryApiIdAndCategoryNameBlank("", null);
  }

  @Test
  public void testProcessSubcategories_Should_Fail_If_Category_ApiId_Null_And_Category_Name_null() {
    testCategoryApiIdAndCategoryNameBlank(null, null);
  }

  @Test
  public void testProcessSubcategories_Create_Subcategory_Ok() {
    var categoryName = "category";
    var subcategory_id = "subcategory_id";
    var name = "subcategory";
    var categoryRef = CategoryRef.of("category_id");
    var category = Category.from(categoryRef);
    category.setName(categoryName);
    var categorySummary = CategorySummary.from(category);
    var subcategorySummary = SubcategorySummary.from(categorySummary, null, name);
    when(categoryService.getByApiId(any(CategoryRef.class))).thenReturn(category);
    var subcategoryRef = SubcategoryRef.of(subcategory_id);
    var subcategory = Subcategory.of(category, subcategoryRef);
    subcategory.setName(name);
    when(subcategoryRepository.findByApiIdIn(any(List.class))).thenReturn(Set.of(subcategory));
    var response = subcategoryService.processSubcategories(List.of(subcategorySummary));
    assertEquals(1, response.size());
    for (Subcategory value : response) {
      assertEquals("category_id", value.getCategory().getApiId().value());
      assertEquals("category", value.getCategory().getName());
      assertEquals("subcategory_id", value.getApiId().value());
      assertEquals("subcategory", value.getName());
    }
  }

  @Test
  public void testProcessSubcategories_Should_fail_if_category_Not_Found() {
    var subcategory_id = "subcategory_id";
    var name = "subcategory";
    var categoryRef = CategoryRef.of("category_id");
    var category = Category.from(categoryRef);
    category.setName("category");
    var subcategorySummary =
        SubcategorySummary.from(CategorySummary.from(category), subcategory_id, name);
    doThrow(new CategoryNotFoundException()).when(categoryService).getByApiId(eq(categoryRef));
    assertThrows(
        CategoryNotFoundException.class,
        () -> subcategoryService.processSubcategories(List.of(subcategorySummary)));
  }

  @Test
  public void testProcessSubcategories_Should_fail_if_Subcategory_Not_Found() {
    var subcategory_id = "subcategory_id";
    var name = "subcategory";
    var categoryRef = CategoryRef.of("category_id");
    var category = Category.from(categoryRef);
    category.setName("category");
    var subcategorySummary =
        SubcategorySummary.from(CategorySummary.from(category), subcategory_id, name);
    when(categoryService.getByApiId(any(CategoryRef.class))).thenReturn(category);
    var subcategoryRef = SubcategoryRef.of(subcategory_id);
    var subcategory = Subcategory.of(category, subcategoryRef);
    subcategory.setName(name);
    when(subcategoryRepository.findByCategory(eq(category))).thenReturn(List.of(subcategory));
    when(subcategoryRepository.existsByApiId(eq(subcategoryRef))).thenReturn(false);
    assertThrows(
        InvalidFieldException.class,
        () -> subcategoryService.processSubcategories(List.of(subcategorySummary)));
  }

  @Test
  public void testProcessSubcategories_Should_fail_if_Subcategory_Not_Belong_To_Category() {
    var subcategory_id = "subcategory_id";
    var name = "subcategory";
    var categoryRef = CategoryRef.of("category_id");
    var category = Category.from(categoryRef);
    category.setName("category");
    var subcategorySummary =
        SubcategorySummary.from(CategorySummary.from(category), subcategory_id, name);
    when(categoryService.getByApiId(any(CategoryRef.class))).thenReturn(category);
    var subcategoryRef = SubcategoryRef.of(subcategory_id);
    var subcategory = Subcategory.of(category, subcategoryRef);
    subcategory.setName(name);
    when(subcategoryRepository.findByCategory(eq(category))).thenReturn(List.of());
    assertThrows(
        InvalidFieldException.class,
        () -> subcategoryService.processSubcategories(List.of(subcategorySummary)));
  }

  private void testCategoryApiIdAndCategoryNameBlank(String categoryApiId, String categoryName) {
    var subcategory_id = "subcategory_id";
    var name = "subcategory";
    var category = Category.from(CategoryRef.of(categoryApiId));
    category.setName(categoryName);
    var subcategorySummary =
        SubcategorySummary.from(CategorySummary.from(category), subcategory_id, name);
    assertThrows(
        InvalidFieldException.class,
        () -> subcategoryService.processSubcategories(List.of(subcategorySummary)));
  }

  private void testApiIdBlankNameExistentFail(String apiId) {
    var categoryName = "category";
    var subcategory_id = "subcategory_id";
    var name = "subcategory";
    var category = Category.from(CategoryRef.of(apiId));
    category.setName(categoryName);
    var subcategorySummary =
        SubcategorySummary.from(CategorySummary.from(category), subcategory_id, name);
    doThrow(builder(subcategory_id, name, FieldErrorType.UNIQUE))
        .when(categoryService)
        .create(any(CategoryCommand.class));
    assertThrows(
        InvalidFieldException.class,
        () -> subcategoryService.processSubcategories(List.of(subcategorySummary)));
  }

  private InvalidFieldException builder(
      String value, String fieldName, FieldErrorType fieldErrorType) {
    try {
      BuilderForException.buildInvalidFieldException(value, fieldName, fieldErrorType);
    } catch (InvalidFieldException ex) {
      return ex;
    }
    return null;
  }
}
