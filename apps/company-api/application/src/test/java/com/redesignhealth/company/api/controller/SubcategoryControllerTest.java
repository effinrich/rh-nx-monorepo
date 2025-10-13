package com.redesignhealth.company.api.controller;

import static com.redesignhealth.company.api.entity.request.RoleAuthority.ROLE_RH_ADMIN;
import static org.hamcrest.Matchers.is;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.redesignhealth.company.api.entity.Category;
import com.redesignhealth.company.api.entity.Subcategory;
import com.redesignhealth.company.api.entity.ref.CategoryRef;
import com.redesignhealth.company.api.entity.ref.SubcategoryRef;
import com.redesignhealth.company.api.exception.CategoryNotFoundException;
import com.redesignhealth.company.api.exception.SubcategoryNotFoundException;
import com.redesignhealth.company.api.repository.SubcategoryRepository;
import com.redesignhealth.company.api.scaffolding.CommonTestConfig;
import com.redesignhealth.company.api.scaffolding.WithRedesignUser;
import com.redesignhealth.company.api.service.CategoryService;
import com.redesignhealth.company.api.service.SubcategoryService;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.restdocs.AutoConfigureRestDocs;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.bind.MethodArgumentNotValidException;

@WebMvcTest(SubcategoryController.class)
@Import({CommonTestConfig.class})
@AutoConfigureRestDocs("target/generated-snippets/subcategory")
public class SubcategoryControllerTest {
  @Autowired private MockMvc mockMvc;

  @MockBean private SubcategoryRepository subcategoryRepository;

  @MockBean private CategoryService categoryService;

  @TestConfiguration
  static class TestConfig {
    @Bean
    public SubcategoryService subcategoryService(
        SubcategoryRepository subcategoryRepository, CategoryService categoryService) {
      return new SubcategoryService(subcategoryRepository, categoryService);
    }
  }

  @Test
  @WithRedesignUser(role = ROLE_RH_ADMIN)
  public void TestGetAll_Category_Doesnt_Exist() throws Exception {
    var categoryId = "category_ref";
    doThrow(new CategoryNotFoundException())
        .when(categoryService)
        .getByApiId(CategoryRef.of(categoryId));
    mockMvc
        .perform(get("/categories/{apiId}/subcategories", categoryId))
        .andExpect(status().isNotFound())
        .andExpect(
            (result) ->
                assertTrue(result.getResolvedException() instanceof CategoryNotFoundException));
  }

  @Test
  @WithRedesignUser(role = ROLE_RH_ADMIN)
  public void TestGetAll_Only_Data_In_Subcategory_Entity_not_q() throws Exception {
    var categoryId = "category_ref";
    var subcategoryId = "subcategory_id";
    var subcategoryRef = SubcategoryRef.of(subcategoryId);
    var categoryRef = CategoryRef.of(categoryId);
    var category = Category.from(categoryRef);
    var subcategory = Subcategory.of(category, subcategoryRef);
    subcategory.setName("name");
    when(categoryService.getByApiId(categoryRef)).thenReturn(category);
    when(subcategoryRepository.findByCategory(category)).thenReturn(List.of(subcategory));
    mockMvc
        .perform(get("/categories/{categoryId}/subcategories", categoryId))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.[0].category.apiId", is("category_ref")))
        .andExpect(jsonPath("$.[0].apiId", is("subcategory_id")))
        .andExpect(jsonPath("$.[0].name", is("name")));
  }

  @Test
  @WithRedesignUser(role = ROLE_RH_ADMIN)
  public void TestGetAll_Only_Data_In_Subcategory_Entity_with_q() throws Exception {
    var q = "blah";
    var categoryId = "category_ref";
    var subcategoryId = "subcategory_id";
    var subcategoryRef = SubcategoryRef.of(subcategoryId);
    var categoryRef = CategoryRef.of(categoryId);
    var category = Category.from(categoryRef);
    var subcategory = Subcategory.of(category, subcategoryRef);
    subcategory.setName("name");
    when(categoryService.getByApiId(categoryRef)).thenReturn(category);
    when(subcategoryRepository.findByNameContainingAndCategory(q, category))
        .thenReturn(List.of(subcategory));
    mockMvc
        .perform(get("/categories/{categoryId}/subcategories?q=blah", categoryId))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.[0].category.apiId", is("category_ref")))
        .andExpect(jsonPath("$.[0].apiId", is("subcategory_id")))
        .andExpect(jsonPath("$.[0].name", is("name")));
  }

  @Test
  @WithRedesignUser(role = ROLE_RH_ADMIN)
  public void TestGetAll_Only_Data_In_Subcategory_Entity_with_q_no_duplicates() throws Exception {
    var q = "blah";
    var categoryId = "category_ref";
    var subcategoryId = "subcategory_id";
    var subcategoryRef = SubcategoryRef.of(subcategoryId);
    var categoryRef = CategoryRef.of(categoryId);
    var category = Category.from(categoryRef);
    var subcategory = Subcategory.of(category, subcategoryRef);
    subcategory.setName("name");
    when(categoryService.getByApiId(categoryRef)).thenReturn(category);
    when(subcategoryRepository.findByNameContainingAndCategory(q, category))
        .thenReturn(List.of(subcategory));
    mockMvc
        .perform(get("/categories/{categoryId}/subcategories?q=blah", categoryId))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.length()", is(1)));
  }

  @Test
  @WithRedesignUser(role = ROLE_RH_ADMIN)
  public void TestGetAll_Only_Data_In_Subcategory_Entity_with_q_duplicates() throws Exception {
    var q = "blah";
    var categoryId = "category_ref";
    var categoryRef = CategoryRef.of(categoryId);
    var category = Category.from(categoryRef);
    var subcategoryId = "subcategory_id";
    var subcategoryRef = SubcategoryRef.of(subcategoryId);
    var subcategory = Subcategory.of(category, subcategoryRef);
    subcategory.setName("admin tools 2");
    when(categoryService.getByApiId(categoryRef)).thenReturn(category);
    when(subcategoryRepository.findByNameContainingAndCategory(q, category))
        .thenReturn(List.of(subcategory));
    mockMvc
        .perform(get("/categories/{categoryId}/subcategories?q=blah", categoryId))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.length()", is(1)));
    ;
  }

  @Test
  @WithRedesignUser(role = ROLE_RH_ADMIN)
  public void TestGet_Subcategory_Doesnt_Exist() throws Exception {
    var categoryId = "category_ref";
    var subcategoryId = "subcategory_ref";
    mockMvc
        .perform(get("/categories/{apiId}/subcategories/{categoryId}", categoryId, subcategoryId))
        .andExpect(status().isNotFound())
        .andExpect(
            (result) ->
                assertTrue(result.getResolvedException() instanceof SubcategoryNotFoundException));
  }

  @Test
  @WithRedesignUser(role = ROLE_RH_ADMIN)
  public void TestGet_Subcategory_Return_One() throws Exception {
    var categoryId = "category_ref";
    var categoryRef = CategoryRef.of(categoryId);
    var category = Category.from(categoryRef);
    var subcategoryId = "subcategory_ref";
    var subcategoryRef = SubcategoryRef.of(subcategoryId);
    var subcategory = Subcategory.of(category, subcategoryRef);
    subcategory.setName("admin tools 2");
    when(subcategoryRepository.findSubcategoryByApiId(subcategoryRef))
        .thenReturn(Optional.of(subcategory));
    mockMvc
        .perform(get("/categories/{apiId}/subcategories/{categoryId}", categoryId, subcategoryId))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.category.apiId", is("category_ref")))
        .andExpect(jsonPath("$.apiId", is("subcategory_ref")))
        .andExpect(jsonPath("$.name", is("admin tools 2")));
  }

  @Test
  @WithRedesignUser(role = ROLE_RH_ADMIN)
  public void TestUpdate_Ok() throws Exception {
    var categoryId = "category_ref";
    var categoryRef = CategoryRef.of(categoryId);
    var category = Category.from(categoryRef);
    var subcategoryId = "subcategory_ref";
    var subcategoryRef = SubcategoryRef.of(subcategoryId);
    var subcategory = Subcategory.of(category, subcategoryRef);
    subcategory.setName("admin tools 2");
    when(subcategoryRepository.findSubcategoryByApiId(subcategoryRef))
        .thenReturn(Optional.of(subcategory));
    mockMvc
        .perform(
            put("/categories/{apiId}/subcategories/{categoryId}", categoryId, subcategoryId)
                .contentType(MediaType.APPLICATION_JSON)
                .content(
                    """
             {
             "name" : "admin tools 3"
             }
            """))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.category.apiId", is("category_ref")))
        .andExpect(jsonPath("$.apiId", is("subcategory_ref")))
        .andExpect(jsonPath("$.name", is("admin tools 3")));
  }

  @Test
  @WithRedesignUser(role = ROLE_RH_ADMIN)
  public void TestUpdate_404() throws Exception {
    var categoryId = "category_ref";
    var subcategoryId = "subcategory_ref";

    mockMvc
        .perform(
            put("/categories/{apiId}/subcategories/{categoryId}", categoryId, subcategoryId)
                .contentType(MediaType.APPLICATION_JSON)
                .content(
                    """
             {
             "name" : "admin tools 3"
             }
            """))
        .andExpect(status().isNotFound())
        .andExpect(
            (result) ->
                assertTrue(result.getResolvedException() instanceof SubcategoryNotFoundException));
  }

  @Test
  @WithRedesignUser(role = ROLE_RH_ADMIN)
  public void TestUpdate_422_Null() throws Exception {
    var categoryId = "category_ref";
    var subcategoryId = "subcategory_ref";
    mockMvc
        .perform(
            put("/categories/{apiId}/subcategories/{categoryId}", categoryId, subcategoryId)
                .contentType(MediaType.APPLICATION_JSON)
                .content(
                    """
             {
             "name" : null
             }
            """))
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
    var subcategoryId = "subcategory_ref";
    mockMvc
        .perform(
            put("/categories/{apiId}/subcategories/{categoryId}", categoryId, subcategoryId)
                .contentType(MediaType.APPLICATION_JSON)
                .content(
                    """
             {
             "name" : ""
             }
            """))
        .andExpect(status().isUnprocessableEntity())
        .andExpect(
            (result) ->
                assertTrue(
                    result.getResolvedException() instanceof MethodArgumentNotValidException));
  }

  @Test
  @WithRedesignUser(role = ROLE_RH_ADMIN)
  public void TestDelete_Subcategory_Doesnt_Exist() throws Exception {
    var categoryId = "category_ref";
    var subcategoryId = "subcategory_ref";
    mockMvc
        .perform(
            delete("/categories/{apiId}/subcategories/{categoryId}", categoryId, subcategoryId))
        .andExpect(status().isNotFound())
        .andExpect(
            (result) ->
                assertTrue(result.getResolvedException() instanceof SubcategoryNotFoundException));
  }

  @Test
  @WithRedesignUser(role = ROLE_RH_ADMIN)
  public void TestDelete_Ok() throws Exception {
    var categoryId = "category_ref";
    var categoryRef = CategoryRef.of(categoryId);
    var category = Category.from(categoryRef);
    var subcategoryId = "subcategory_ref";
    var subcategoryRef = SubcategoryRef.of(subcategoryId);
    var subcategory = Subcategory.of(category, subcategoryRef);
    subcategory.setName("admin tools 2");
    when(subcategoryRepository.findSubcategoryByApiId(subcategoryRef))
        .thenReturn(Optional.of(subcategory));
    mockMvc
        .perform(
            delete("/categories/{apiId}/subcategories/{categoryId}", categoryId, subcategoryId))
        .andExpect(status().isNoContent());
  }

  @Test
  @WithRedesignUser(role = ROLE_RH_ADMIN)
  public void TestCreate_Ok() throws Exception {
    var categoryId = "category_ref";
    var categoryRef = CategoryRef.of(categoryId);
    var category = Category.from(categoryRef);
    when(categoryService.getByApiId(categoryRef)).thenReturn(category);
    mockMvc
        .perform(
            post("/categories/{apiId}/subcategories", categoryId)
                .contentType(MediaType.APPLICATION_JSON)
                .content(
                    """
             {
             "name" : "admin tools 3"
             }
            """))
        .andExpect(status().isCreated())
        .andExpect(jsonPath("$.category.apiId", is("category_ref")))
        .andExpect(jsonPath("$.name", is("admin tools 3")));
  }

  @Test
  @WithRedesignUser(role = ROLE_RH_ADMIN)
  public void TestCreate_404() throws Exception {
    var categoryId = "category_ref";
    doThrow(new CategoryNotFoundException())
        .when(categoryService)
        .getByApiId(CategoryRef.of(categoryId));
    mockMvc
        .perform(
            post("/categories/{apiId}/subcategories", categoryId)
                .contentType(MediaType.APPLICATION_JSON)
                .content(
                    """
             {
             "name" : "admin tools 3"
             }
            """))
        .andExpect(status().isNotFound())
        .andExpect(
            (result) ->
                assertTrue(result.getResolvedException() instanceof CategoryNotFoundException));
  }

  @Test
  @WithRedesignUser(role = ROLE_RH_ADMIN)
  public void TestCreate_422_Null() throws Exception {
    var categoryId = "category_ref";
    mockMvc
        .perform(
            post("/categories/{apiId}/subcategories", categoryId)
                .contentType(MediaType.APPLICATION_JSON)
                .content(
                    """
             {
             "name" : null
             }
            """))
        .andExpect(status().isUnprocessableEntity())
        .andExpect(
            (result) ->
                assertTrue(
                    result.getResolvedException() instanceof MethodArgumentNotValidException));
  }

  @Test
  @WithRedesignUser(role = ROLE_RH_ADMIN)
  public void TestCreate_422_Blank() throws Exception {
    var categoryId = "category_ref";
    mockMvc
        .perform(
            post("/categories/{apiId}/subcategories", categoryId)
                .contentType(MediaType.APPLICATION_JSON)
                .content(
                    """
             {
             "name" : ""
             }
            """))
        .andExpect(status().isUnprocessableEntity())
        .andExpect(
            (result) ->
                assertTrue(
                    result.getResolvedException() instanceof MethodArgumentNotValidException));
  }
}
