package com.redesignhealth.company.api.controller;

import static com.redesignhealth.company.api.entity.FormDefinition.Type.PRIVACY_QUESTIONNAIRE;
import static com.redesignhealth.company.api.scaffolding.DocUtils.linksField;
import static com.redesignhealth.company.api.scaffolding.DocUtils.selfLink;
import static com.redesignhealth.company.api.scaffolding.Fixtures.mapper;
import static com.redesignhealth.company.api.scaffolding.Fixtures.testFormDefinition;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.AdditionalAnswers.returnsFirstArg;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.restdocs.hypermedia.HypermediaDocumentation.links;
import static org.springframework.restdocs.mockmvc.MockMvcRestDocumentation.document;
import static org.springframework.restdocs.payload.PayloadDocumentation.responseFields;
import static org.springframework.restdocs.payload.PayloadDocumentation.subsectionWithPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.redesignhealth.company.api.entity.FormDefinition;
import com.redesignhealth.company.api.entity.request.RoleAuthority;
import com.redesignhealth.company.api.repository.FormDefinitionRepository;
import com.redesignhealth.company.api.scaffolding.CommonTestConfig;
import com.redesignhealth.company.api.scaffolding.WithRedesignUser;
import com.redesignhealth.company.api.service.FormDefinitionService;
import java.util.Optional;
import org.hamcrest.Matchers;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.restdocs.AutoConfigureRestDocs;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.restdocs.payload.FieldDescriptor;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

@WebMvcTest(FormDefinitionController.class)
@Import({CommonTestConfig.class})
@AutoConfigureRestDocs("target/generated-snippets/form-definition")
public class FormDefinitionControllerTests {

  @Autowired MockMvc mockMvc;

  @MockBean FormDefinitionRepository formDefinitionRepository;

  @TestConfiguration
  static class TestConfig {
    @Bean
    public FormDefinitionService formDefinitionService(
        FormDefinitionRepository formDefinitionRepository) {
      return new FormDefinitionService(formDefinitionRepository);
    }
  }

  @Test
  @WithRedesignUser
  void testGet_returnsDefinition() throws Exception {
    var definition = testFormDefinition(PRIVACY_QUESTIONNAIRE);
    when(formDefinitionRepository.findByType(PRIVACY_QUESTIONNAIRE))
        .thenReturn(Optional.of(definition));
    mockMvc
        .perform(MockMvcRequestBuilders.get("/form-definition/{type}", PRIVACY_QUESTIONNAIRE))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.schema", Matchers.notNullValue()))
        .andDo(
            document(
                "get",
                responseFields(typeField(), schemaField(), linksField()),
                links(selfLink())));
  }

  @Test
  @WithRedesignUser
  void testGet_returns404() throws Exception {
    var definition = testFormDefinition(PRIVACY_QUESTIONNAIRE);
    when(formDefinitionRepository.findByType(PRIVACY_QUESTIONNAIRE)).thenReturn(Optional.empty());
    mockMvc
        .perform(MockMvcRequestBuilders.get("/form-definition/{type}", PRIVACY_QUESTIONNAIRE))
        .andExpect(status().isNotFound())
        .andExpect(
            (result) ->
                assertEquals(
                    "Form definition does not exist.", result.getResolvedException().getMessage()));
  }

  @Test
  @WithRedesignUser(role = RoleAuthority.ROLE_RH_ADMIN)
  void testPut_addsDefinition() throws Exception {
    when(formDefinitionRepository.findByType(PRIVACY_QUESTIONNAIRE)).thenReturn(Optional.empty());
    when(formDefinitionRepository.save(any(FormDefinition.class))).then(returnsFirstArg());
    mockMvc
        .perform(
            MockMvcRequestBuilders.put("/form-definition/{type}", PRIVACY_QUESTIONNAIRE)
                .contentType(MediaType.APPLICATION_JSON)
                .content(mapper.writeValueAsString(testFormDefinition(PRIVACY_QUESTIONNAIRE))))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.schema", Matchers.notNullValue()))
        .andDo(
            document(
                "update",
                responseFields(typeField(), schemaField(), linksField()),
                links(selfLink())));
  }

  private static FieldDescriptor typeField() {
    return subsectionWithPath("type").description("A form identifier.");
  }

  private static FieldDescriptor schemaField() {
    return subsectionWithPath("schema")
        .description("A form schema. Must conform to Form meta-schema.");
  }
}
