package com.redesignhealth.company.api.controller;

import static com.redesignhealth.company.api.client.search.entity.ResearchExternalContentDoc.NOTE_TAKER_FIELD;
import static com.redesignhealth.company.api.scaffolding.DocUtils.additionalTagsField;
import static com.redesignhealth.company.api.scaffolding.DocUtils.attachmentsField;
import static com.redesignhealth.company.api.scaffolding.DocUtils.companiesField;
import static com.redesignhealth.company.api.scaffolding.DocUtils.companyIdsField;
import static com.redesignhealth.company.api.scaffolding.DocUtils.createdField;
import static com.redesignhealth.company.api.scaffolding.DocUtils.filterQueryParameter;
import static com.redesignhealth.company.api.scaffolding.DocUtils.idField;
import static com.redesignhealth.company.api.scaffolding.DocUtils.isAttachmentsDisclaimerAcceptedField;
import static com.redesignhealth.company.api.scaffolding.DocUtils.keyField;
import static com.redesignhealth.company.api.scaffolding.DocUtils.linksField;
import static com.redesignhealth.company.api.scaffolding.DocUtils.optionsField;
import static com.redesignhealth.company.api.scaffolding.DocUtils.pageFields;
import static com.redesignhealth.company.api.scaffolding.DocUtils.pageQueryParameter;
import static com.redesignhealth.company.api.scaffolding.DocUtils.qQueryParameter;
import static com.redesignhealth.company.api.scaffolding.DocUtils.sizeQueryParameter;
import static com.redesignhealth.company.api.scaffolding.DocUtils.sortQueryParameter;
import static com.redesignhealth.company.api.scaffolding.DocUtils.stakeholdersField;
import static com.redesignhealth.company.api.scaffolding.DocUtils.taxonomyTag1Field;
import static com.redesignhealth.company.api.scaffolding.DocUtils.taxonomyTag2Field;
import static com.redesignhealth.company.api.scaffolding.DocUtils.taxonomyTag3Field;
import static com.redesignhealth.company.api.scaffolding.Fixtures.testCompany;
import static com.redesignhealth.company.api.scaffolding.Fixtures.testCompanyRef;
import static com.redesignhealth.company.api.scaffolding.Fixtures.testResearchExternalContentDoc;
import static com.redesignhealth.company.api.service.ResearchArticleService.VALID_SEARCH_FILTERS;
import static org.hamcrest.Matchers.hasItem;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.mockito.AdditionalAnswers.returnsFirstArg;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.restdocs.mockmvc.MockMvcRestDocumentation.document;
import static org.springframework.restdocs.payload.PayloadDocumentation.fieldWithPath;
import static org.springframework.restdocs.payload.PayloadDocumentation.requestFields;
import static org.springframework.restdocs.payload.PayloadDocumentation.responseFields;
import static org.springframework.restdocs.payload.PayloadDocumentation.subsectionWithPath;
import static org.springframework.restdocs.request.RequestDocumentation.queryParameters;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.redesignhealth.company.api.client.search.SearchClient;
import com.redesignhealth.company.api.client.search.command.SearchCommand;
import com.redesignhealth.company.api.client.search.command.SearchFilterOptionsCommand;
import com.redesignhealth.company.api.client.search.command.SearchIndex;
import com.redesignhealth.company.api.client.search.entity.FilterOptions;
import com.redesignhealth.company.api.client.search.entity.ResearchExternalContentDoc;
import com.redesignhealth.company.api.client.search.entity.SearchResult;
import com.redesignhealth.company.api.client.search.entity.Term;
import com.redesignhealth.company.api.entity.ResearchArticle;
import com.redesignhealth.company.api.entity.request.RoleAuthority;
import com.redesignhealth.company.api.property.ResearchArticleEntityConverter;
import com.redesignhealth.company.api.repository.CompanyRepository;
import com.redesignhealth.company.api.repository.ResearchArticleRepository;
import com.redesignhealth.company.api.scaffolding.CommonTestConfig;
import com.redesignhealth.company.api.scaffolding.DocUtils;
import com.redesignhealth.company.api.scaffolding.WithRedesignUser;
import com.redesignhealth.company.api.service.ResearchArticleService;
import com.redesignhealth.company.api.taxonomy.CompanyTaxonomy;
import java.util.Collections;
import java.util.List;
import java.util.Set;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.restdocs.AutoConfigureRestDocs;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.MediaType;
import org.springframework.restdocs.payload.FieldDescriptor;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(ResearchArticleController.class)
@Import({CommonTestConfig.class})
@AutoConfigureRestDocs("target/generated-snippets/research-article")
public class ResearchArticleControllerTests {

  @Autowired private MockMvc mockMvc;

  @MockBean private ResearchArticleRepository researchArticleRepository;
  @MockBean private CompanyRepository companyRepository;

  @MockBean private SearchClient searchClient;

  @TestConfiguration
  static class TestConfig {
    @Bean
    public ResearchArticleService researchArticleService(
        ResearchArticleRepository researchArticleRepository,
        CompanyRepository companyRepository,
        CompanyTaxonomy companyTaxonomy,
        SearchClient searchClient,
        ResearchArticleEntityConverter researchArticleEntityConverter) {
      return new ResearchArticleService(
          researchArticleRepository,
          companyRepository,
          companyTaxonomy,
          searchClient,
          researchArticleEntityConverter);
    }
  }

  @Test
  @WithRedesignUser(role = RoleAuthority.ROLE_RH_USER)
  public void testCreate_success() throws Exception {
    when(companyRepository.findAllByApiIdIn(List.of(testCompanyRef())))
        .thenReturn(Set.of(testCompany()));
    when(researchArticleRepository.save(any(ResearchArticle.class))).then(returnsFirstArg());
    mockMvc
        .perform(
            post("/research-article")
                .contentType(MediaType.APPLICATION_JSON)
                .content(
                    """
        {
          "title": "Shinra Research",
          "type": "Article/Publication",
          "articleHref": "https://example.com",
          "stakeholders": [
            "Patient"
          ],
          "companyIds": [
            "%s"
          ],
          "additionalTags": [
            "New"
          ],
          "attachments": [
            {
              "name": "article.pdf",
              "href": "https://example.com"
            }
          ],
          "isAttachmentDisclaimerAccepted": true
        }
      """
                        .formatted(testCompanyRef())))
        .andExpect(status().isCreated())
        .andExpect(jsonPath("$.title", is("Shinra Research")))
        .andExpect(jsonPath("$.type", is("Article/Publication")))
        .andExpect(jsonPath("$.articleHref", is("https://example.com")))
        .andExpect(jsonPath("$.stakeholders[0]", is("Patient")))
        .andExpect(jsonPath("$.companies[0].name", is("Springtide")))
        .andExpect(jsonPath("$.additionalTags[0]", is("New")))
        .andExpect(jsonPath("$.attachments[0].name", is("article.pdf")))
        .andExpect(jsonPath("$.taxonomyTag1[0]", is("Care Delivery")))
        .andExpect(jsonPath("$.taxonomyTag2[0]", is("Clinical Operations")))
        .andExpect(jsonPath("$.taxonomyTag3[0]", is("Care Team Coordination")))
        .andDo(
            document(
                "create",
                requestFields(
                    titleField(),
                    typeField(),
                    articleHrefField(),
                    stakeholdersField(),
                    companyIdsField(),
                    additionalTagsField(),
                    attachmentsField(),
                    isAttachmentsDisclaimerAcceptedField()),
                responseFields(
                    idField(),
                    titleField(),
                    typeField(),
                    articleHrefField(),
                    stakeholdersField(),
                    companiesField(),
                    additionalTagsField(),
                    attachmentsField(),
                    taxonomyTag1Field(),
                    taxonomyTag2Field(),
                    taxonomyTag3Field(),
                    isAttachmentsDisclaimerAcceptedField(),
                    linksField())));
  }

  @Test
  @WithRedesignUser(role = RoleAuthority.ROLE_RH_USER)
  public void testCreate_unknownCompany() throws Exception {
    when(companyRepository.findAllByApiIdIn(List.of(testCompanyRef())))
        .thenReturn(Collections.emptySet());
    when(researchArticleRepository.save(any(ResearchArticle.class))).then(returnsFirstArg());
    mockMvc
        .perform(
            post("/research-article")
                .contentType(MediaType.APPLICATION_JSON)
                .content(
                    """
        {
          "title": "Shinra Research",
          "type": "Article/Publication",
          "articleHref": "https://example.com",
          "stakeholders": [
            "Patient"
          ],
          "companyIds": ["1jlaksd1", "G2F3asd"],
          "additionalTags": [
            "New"
          ],
          "attachments": [
            {
              "name": "article.pdf",
              "href": "https://example.com"
            }
          ],
          "isAttachmentDisclaimerAccepted": true
        }
      """))
        .andExpect(status().isUnprocessableEntity())
        .andExpect(status().isUnprocessableEntity())
        .andExpect(jsonPath("$.errors[0].name", is("companyIds")))
        .andExpect(jsonPath("$.errors[0].rejectedValue", is("1jlaksd1,G2F3asd")))
        .andExpect(jsonPath("$.errors[0].description", is("must exist")));
  }

  @Test
  @WithRedesignUser(role = RoleAuthority.ROLE_RH_USER)
  public void testCreate_baseRequiredFields() throws Exception {
    mockMvc
        .perform(
            post("/research-article")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
              {}
        """))
        .andExpect(status().isUnprocessableEntity())
        .andExpect(jsonPath("$.errors[*].name", hasItem("title")))
        .andExpect(jsonPath("$.errors[*].name", hasItem("type")))
        .andExpect(jsonPath("$.errors[*].name", hasItem("companyIds")))
        .andExpect(jsonPath("$.errors[*].name", hasItem("articleHref")));
  }

  @Test
  @WithRedesignUser(role = RoleAuthority.ROLE_RH_USER)
  public void testFilters_returnsResults() throws Exception {
    var filterOption =
        FilterOptions.builder()
            .field(ResearchExternalContentDoc.STAKEHOLDERS_FIELD)
            .terms(List.of(Term.of("Government", 10)))
            .build();
    var command =
        SearchFilterOptionsCommand.builder()
            .index(SearchIndex.RESEARCH_EXTERNAL_CONTENT)
            .fields(VALID_SEARCH_FILTERS)
            .build();
    when(searchClient.getFilterOptions(command)).thenReturn(List.of(filterOption));
    mockMvc
        .perform(get("/research-article/filters"))
        .andExpect(status().isOk())
        .andDo(
            document(
                "filters",
                responseFields(
                        linksField(), subsectionWithPath("content").description("List of filters"))
                    .andWithPrefix("content[].", keyField(), optionsField())));
  }

  @Test
  @WithRedesignUser(role = RoleAuthority.ROLE_RH_USER)
  public void testFilters_returnsNoResults() throws Exception {
    var command =
        SearchFilterOptionsCommand.builder()
            .index(SearchIndex.RESEARCH_EXTERNAL_CONTENT)
            .fields(VALID_SEARCH_FILTERS)
            .build();
    when(searchClient.getFilterOptions(command)).thenReturn(List.of());
    mockMvc
        .perform(get("/research-article/filters"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.content", hasSize(0)));
  }

  @Test
  @WithRedesignUser(role = RoleAuthority.ROLE_RH_USER)
  public void testQuery_returnsResults() throws Exception {
    when(companyRepository.findAllByApiIdIn(Set.of(testCompanyRef())))
        .thenReturn(Set.of(testCompany()));
    var command =
        SearchCommand.builder()
            .index(SearchIndex.RESEARCH_EXTERNAL_CONTENT)
            .query("Text")
            .searchFilters(List.of(NOTE_TAKER_FIELD + ",Terra"))
            .fields(ResearchArticleService.FIELDS_TO_SEARCH)
            .build();
    var pageable = PageRequest.of(0, 20, Sort.by(NOTE_TAKER_FIELD));
    when(searchClient.search(command, pageable, ResearchExternalContentDoc.class))
        .thenReturn(
            new PageImpl<>(
                List.of(SearchResult.of(testResearchExternalContentDoc())), pageable, 1));
    mockMvc
        .perform(
            get(
                "/research-article?page=0&size=20&sort=createdBy,asc&q=Text&filter=createdBy,Terra"))
        .andExpect(status().isOk())
        .andDo(
            document(
                "query",
                queryParameters(
                    filterQueryParameter(),
                    pageQueryParameter(),
                    qQueryParameter(),
                    sizeQueryParameter(),
                    sortQueryParameter()),
                responseFields(linksField())
                    .andWithPrefix("page.", pageFields())
                    .andWithPrefix(
                        "content[].",
                        typeField(),
                        companiesField(),
                        createdField(),
                        additionalTagsField(),
                        attachmentsField(),
                        stakeholdersField(),
                        taxonomyTag1Field(),
                        taxonomyTag2Field(),
                        taxonomyTag3Field(),
                        articleHrefField(),
                        idField(),
                        titleField(),
                        DocUtils.createdByField(),
                        linksField().ignored())));
  }

  private static FieldDescriptor titleField() {
    return fieldWithPath("title").description("Article name");
  }

  private static FieldDescriptor typeField() {
    return fieldWithPath("type").description("Type of article");
  }

  private static FieldDescriptor articleHrefField() {
    return fieldWithPath("articleHref").description("Link to article");
  }
}
