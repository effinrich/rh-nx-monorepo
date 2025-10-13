package com.redesignhealth.company.api.controller;

import static com.redesignhealth.company.api.entity.request.RoleAuthority.ROLE_RH_ADMIN;
import static com.redesignhealth.company.api.scaffolding.DocUtils.expandQueryParameter;
import static org.hamcrest.Matchers.is;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.when;
import static org.springframework.restdocs.mockmvc.MockMvcRestDocumentation.document;
import static org.springframework.restdocs.payload.PayloadDocumentation.fieldWithPath;
import static org.springframework.restdocs.payload.PayloadDocumentation.requestFields;
import static org.springframework.restdocs.payload.PayloadDocumentation.responseFields;
import static org.springframework.restdocs.payload.PayloadDocumentation.subsectionWithPath;
import static org.springframework.restdocs.request.RequestDocumentation.parameterWithName;
import static org.springframework.restdocs.request.RequestDocumentation.queryParameters;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.redesignhealth.company.api.dto.command.CategoryCommand;
import com.redesignhealth.company.api.entity.Category;
import com.redesignhealth.company.api.entity.Subcategory;
import com.redesignhealth.company.api.entity.ref.CategoryRef;
import com.redesignhealth.company.api.entity.ref.SubcategoryRef;
import com.redesignhealth.company.api.exception.CategoryNotFoundException;
import com.redesignhealth.company.api.expansion.Expansion;
import com.redesignhealth.company.api.repository.CategoryRepository;
import com.redesignhealth.company.api.scaffolding.CommonTestConfig;
import com.redesignhealth.company.api.scaffolding.WithRedesignUser;
import com.redesignhealth.company.api.service.CategoryService;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentMatchers;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.restdocs.AutoConfigureRestDocs;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.MediaType;
import org.springframework.restdocs.payload.FieldDescriptor;
import org.springframework.restdocs.request.ParameterDescriptor;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.bind.MethodArgumentNotValidException;

@WebMvcTest(CategoryController.class)
@Import({CommonTestConfig.class})
@AutoConfigureRestDocs("target/generated-snippets/category")
public class CategoryControllerTests {
  @Autowired private MockMvc mockMvc;
  @Autowired private ObjectMapper mapper;
  @MockBean private CategoryRepository categoryRepository;

  @TestConfiguration
  static class TestConfig {
    @Bean
    public CategoryService categoryService(CategoryRepository categoryRepository) {
      return new CategoryService(categoryRepository);
    }
  }

  @Test
  @WithRedesignUser(role = ROLE_RH_ADMIN)
  public void TestGetAll_Only_Data_In_Category_Entity() throws Exception {
    var category = testCategory();
    when(categoryRepository.findAll(ArgumentMatchers.<Specification<Category>>any()))
        .thenReturn(List.of(category));
    mockMvc
        .perform(get("/categories?q=Text&expand=subcategories"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.[0].apiId", is("category_ref")))
        .andDo(
            document(
                "query",
                queryParameters(queryField(), expandQueryParameter(Expansion.SUBCATEGORIES)),
                responseFields()
                    .andWithPrefix(
                        "[].", apiIdCategoryField(), nameCategoryField(), subcategoriesField())));
  }

  @Test
  @WithRedesignUser(role = ROLE_RH_ADMIN)
  public void TestGetOne_Existent() throws Exception {
    var categoryId = "category_ref";
    var categoryRef = CategoryRef.of(categoryId);
    var category = testCategory();
    ;
    category.setName("infra1");

    when(categoryRepository.findCategoryByApiId(categoryRef)).thenReturn(Optional.of(category));
    mockMvc
        .perform(get("/categories/{apiId}", categoryId))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.apiId", is(categoryId)))
        .andExpect(jsonPath("$.name", is("infra1")))
        .andDo(
            document(
                "get",
                responseFields(apiIdCategoryField(), nameCategoryField(), subcategoriesField())));
  }

  @Test
  @WithRedesignUser(role = ROLE_RH_ADMIN)
  public void TestGetOne_Not_Existent() throws Exception {
    mockMvc
        .perform(get("/categories/category_ref"))
        .andExpect(status().isNotFound())
        .andExpect(
            (result) ->
                assertTrue(result.getResolvedException() instanceof CategoryNotFoundException));
  }

  @Test
  @WithRedesignUser(role = ROLE_RH_ADMIN)
  public void TestUpdate_Ok() throws Exception {
    var categoryId = "category_ref";
    var categoryRef = CategoryRef.of(categoryId);
    var category = testCategory();
    category.setApiId(categoryRef);
    category.setName("infra1");
    var update = CategoryCommand.of("infra2");

    when(categoryRepository.findCategoryByApiId(categoryRef)).thenReturn(Optional.of(category));
    mockMvc
        .perform(
            put("/categories/{apiId}", categoryId)
                .contentType(MediaType.APPLICATION_JSON)
                .content(mapper.writeValueAsString(update)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.apiId", is(categoryId)))
        .andExpect(jsonPath("$.name", is("infra2")))
        .andDo(
            document(
                "update",
                requestFields(nameCategoryField()),
                responseFields(apiIdCategoryField(), nameCategoryField(), subcategoriesField())));
  }

  @Test
  @WithRedesignUser(role = ROLE_RH_ADMIN)
  public void TestUpdate_404() throws Exception {
    var categoryId = "category_ref";
    var update = CategoryCommand.of("infra2");
    mockMvc
        .perform(
            put("/categories/{apiId}", categoryId)
                .contentType(MediaType.APPLICATION_JSON)
                .content(mapper.writeValueAsString(update)))
        .andExpect(status().isNotFound())
        .andExpect(
            (result) ->
                assertTrue(result.getResolvedException() instanceof CategoryNotFoundException));
  }

  @Test
  @WithRedesignUser(role = ROLE_RH_ADMIN)
  public void TestUpdate_422_Null() throws Exception {
    var categoryId = "category_ref";
    var update = new CategoryCommand();

    mockMvc
        .perform(
            put("/categories/{apiId}", categoryId)
                .contentType(MediaType.APPLICATION_JSON)
                .content(mapper.writeValueAsString(update)))
        .andExpect(status().isUnprocessableEntity())
        .andExpect(
            (result) ->
                assertTrue(
                    result.getResolvedException() instanceof MethodArgumentNotValidException));
  }

  @Test
  @WithRedesignUser(role = ROLE_RH_ADMIN)
  public void TestUpdate_422_Blank() throws Exception {
    var categoryId = "category_ref";
    var update = CategoryCommand.of("");
    mockMvc
        .perform(
            put("/categories/{apiId}", categoryId)
                .contentType(MediaType.APPLICATION_JSON)
                .content(mapper.writeValueAsString(update)))
        .andExpect(status().isUnprocessableEntity())
        .andExpect(
            (result) ->
                assertTrue(
                    result.getResolvedException() instanceof MethodArgumentNotValidException));
  }

  @Test
  @WithRedesignUser(role = ROLE_RH_ADMIN)
  public void TestDelete_404() throws Exception {
    var categoryId = "category_ref";
    mockMvc
        .perform(delete("/categories/{apiId}", categoryId))
        .andExpect(status().isNotFound())
        .andExpect(
            (result) ->
                assertTrue(result.getResolvedException() instanceof CategoryNotFoundException));
  }

  @Test
  @WithRedesignUser(role = ROLE_RH_ADMIN)
  public void TestDelete_Ok() throws Exception {
    var categoryId = "category_ref";
    var categoryRef = CategoryRef.of(categoryId);
    var category = Category.from(categoryRef);
    category.setName("infra1");

    when(categoryRepository.findCategoryByApiId(categoryRef)).thenReturn(Optional.of(category));
    mockMvc.perform(delete("/categories/{apiId}", categoryId)).andExpect(status().isNoContent());
  }

  @Test
  @WithRedesignUser(role = ROLE_RH_ADMIN)
  public void TestCreate_Ok() throws Exception {
    var create = CategoryCommand.of("infra2");

    mockMvc
        .perform(
            post("/categories")
                .contentType(MediaType.APPLICATION_JSON)
                .content(mapper.writeValueAsString(create)))
        .andExpect(status().isCreated())
        .andExpect(jsonPath("$.name", is("infra2")))
        .andDo(
            document(
                "create",
                requestFields(nameCategoryField()),
                responseFields(apiIdCategoryField(), nameCategoryField())));
  }

  @Test
  @WithRedesignUser(role = ROLE_RH_ADMIN)
  public void TestCreate_422_Null() throws Exception {
    var create = new CategoryCommand();

    mockMvc
        .perform(
            post("/categories")
                .contentType(MediaType.APPLICATION_JSON)
                .content(mapper.writeValueAsString(create)))
        .andExpect(status().isUnprocessableEntity())
        .andExpect(
            (result) ->
                assertTrue(
                    result.getResolvedException() instanceof MethodArgumentNotValidException));
  }

  @Test
  @WithRedesignUser(role = ROLE_RH_ADMIN)
  public void TestCreate_422_Blank() throws Exception {
    var create = CategoryCommand.of("");

    mockMvc
        .perform(
            post("/categories")
                .contentType(MediaType.APPLICATION_JSON)
                .content(mapper.writeValueAsString(create)))
        .andExpect(status().isUnprocessableEntity())
        .andExpect(
            (result) ->
                assertTrue(
                    result.getResolvedException() instanceof MethodArgumentNotValidException));
  }

  public static FieldDescriptor apiIdCategoryField() {
    return fieldWithPath("apiId").description("Category ApiId base 62");
  }

  public static FieldDescriptor nameCategoryField() {
    return fieldWithPath("name").description("Category name");
  }

  public static ParameterDescriptor queryField() {
    return parameterWithName("q").description("Text used to search the categories");
  }

  private static FieldDescriptor subcategoriesField() {
    return subsectionWithPath("subcategories")
        .description("Subcategory List (requires `?expand=subcategories`)");
  }

  private Category testCategory() {
    var category = Category.from(CategoryRef.of("category_ref"));
    category.setName("categoryName");
    var subcategory = Subcategory.of(category, SubcategoryRef.of("subcategoryRef"));
    category.setSubcategories(Set.of(subcategory));
    return category;
  }
}
