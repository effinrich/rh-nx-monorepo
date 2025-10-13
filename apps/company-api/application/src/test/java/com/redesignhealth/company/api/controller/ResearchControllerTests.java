package com.redesignhealth.company.api.controller;

import static com.redesignhealth.company.api.client.search.entity.ResearchSearchDoc.AUTHORS_FIELD;
import static com.redesignhealth.company.api.client.search.entity.ResearchSearchDoc.SPRINT_NAME_FIELD;
import static com.redesignhealth.company.api.scaffolding.DocUtils.canAccessField;
import static com.redesignhealth.company.api.scaffolding.DocUtils.createdField;
import static com.redesignhealth.company.api.scaffolding.DocUtils.expandQueryParameter;
import static com.redesignhealth.company.api.scaffolding.DocUtils.filterQueryParameter;
import static com.redesignhealth.company.api.scaffolding.DocUtils.highlightedTextField;
import static com.redesignhealth.company.api.scaffolding.DocUtils.idField;
import static com.redesignhealth.company.api.scaffolding.DocUtils.keyField;
import static com.redesignhealth.company.api.scaffolding.DocUtils.linksField;
import static com.redesignhealth.company.api.scaffolding.DocUtils.optionsField;
import static com.redesignhealth.company.api.scaffolding.DocUtils.pageFields;
import static com.redesignhealth.company.api.scaffolding.DocUtils.pageQueryParameter;
import static com.redesignhealth.company.api.scaffolding.DocUtils.qQueryParameter;
import static com.redesignhealth.company.api.scaffolding.DocUtils.sizeQueryParameter;
import static com.redesignhealth.company.api.scaffolding.DocUtils.sortQueryParameter;
import static com.redesignhealth.company.api.scaffolding.DocUtils.taxonomyTag1Field;
import static com.redesignhealth.company.api.scaffolding.DocUtils.taxonomyTag2Field;
import static com.redesignhealth.company.api.scaffolding.DocUtils.taxonomyTag3Field;
import static com.redesignhealth.company.api.scaffolding.Fixtures.testCompany;
import static com.redesignhealth.company.api.scaffolding.Fixtures.testCompanyRef;
import static com.redesignhealth.company.api.scaffolding.Fixtures.testHighlightedText;
import static com.redesignhealth.company.api.scaffolding.Fixtures.testPersonRef;
import static com.redesignhealth.company.api.scaffolding.Fixtures.testResearch;
import static com.redesignhealth.company.api.scaffolding.Fixtures.testResearchRef;
import static com.redesignhealth.company.api.scaffolding.Fixtures.testResearchSearchDoc;
import static com.redesignhealth.company.api.service.ResearchService.VALID_SEARCH_FILTERS;
import static org.hamcrest.Matchers.hasItem;
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
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.redesignhealth.company.api.client.file.GoogleDriveClient;
import com.redesignhealth.company.api.client.search.SearchClient;
import com.redesignhealth.company.api.client.search.command.SearchCommand;
import com.redesignhealth.company.api.client.search.command.SearchFilterOptionsCommand;
import com.redesignhealth.company.api.client.search.command.SearchIndex;
import com.redesignhealth.company.api.client.search.entity.FilterOptions;
import com.redesignhealth.company.api.client.search.entity.ResearchSearchDoc;
import com.redesignhealth.company.api.client.search.entity.SearchResult;
import com.redesignhealth.company.api.client.search.entity.Term;
import com.redesignhealth.company.api.conflicts.ConflictsEngine;
import com.redesignhealth.company.api.entity.Person;
import com.redesignhealth.company.api.entity.ref.PersonRef;
import com.redesignhealth.company.api.entity.request.RoleAuthority;
import com.redesignhealth.company.api.entity.research.Research;
import com.redesignhealth.company.api.expansion.Expansion;
import com.redesignhealth.company.api.property.ResearchEntityConverter;
import com.redesignhealth.company.api.repository.CompanyRepository;
import com.redesignhealth.company.api.repository.PersonRepository;
import com.redesignhealth.company.api.repository.ResearchRepository;
import com.redesignhealth.company.api.scaffolding.CommonTestConfig;
import com.redesignhealth.company.api.scaffolding.WithRedesignUser;
import com.redesignhealth.company.api.service.ResearchService;
import com.redesignhealth.company.api.taxonomy.CompanyTaxonomy;
import java.util.List;
import java.util.Optional;
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

@WebMvcTest(ResearchController.class)
@Import({CommonTestConfig.class})
@AutoConfigureRestDocs("target/generated-snippets/research")
class ResearchControllerTests {

  @Autowired private MockMvc mockMvc;
  @MockBean private SearchClient searchClient;
  @MockBean private PersonRepository personRepository;
  @MockBean private CompanyRepository companyRepository;
  @MockBean private ConflictsEngine conflictEngine;
  @MockBean private GoogleDriveClient googleDriveClient;
  @MockBean private ResearchRepository researchRepository;

  @TestConfiguration
  static class TestConfig {
    @Bean
    public ResearchService researchService(
        SearchClient searchClient,
        ConflictsEngine conflictsEngine,
        CompanyRepository companyRepository,
        ResearchEntityConverter researchEntityFields,
        GoogleDriveClient googleDriveClient,
        PersonRepository personRepository,
        CompanyTaxonomy companyTaxonomy,
        ResearchRepository researchRepository) {
      return new ResearchService(
          searchClient,
          conflictsEngine,
          companyRepository,
          researchEntityFields,
          personRepository,
          googleDriveClient,
          companyTaxonomy,
          researchRepository);
    }
  }

  @Test
  @WithRedesignUser(role = RoleAuthority.ROLE_OP_CO_USER, email = "new@redesignhealth.com")
  public void testQuery_returnsResults_No_Owner_No_Conflict() throws Exception {
    var command =
        SearchCommand.builder()
            .index(SearchIndex.RESEARCH)
            .query("Text")
            .searchFilters(List.of(AUTHORS_FIELD + ".name,Terra"))
            .fields(ResearchService.FIELDS_TO_SEARCH)
            .highlight(true)
            .build();
    var pageable = PageRequest.of(0, 20, Sort.by(SPRINT_NAME_FIELD));
    when(searchClient.search(command, pageable, ResearchSearchDoc.class))
        .thenReturn(
            new PageImpl<>(
                List.of(
                    SearchResult.of(testResearchSearchDoc(), testHighlightedText(), "documentId")),
                pageable,
                1));
    when(personRepository.findByEmail(PersonRef.of("new@redesignhealth.com")))
        .thenReturn(Optional.of(Person.from(PersonRef.of("new@redesignhealth.com"))));
    when(companyRepository.findAllByApiIdIn(Set.of(testCompanyRef())))
        .thenReturn(Set.of(testCompany()));
    mockMvc
        .perform(
            get(
                "/research?page=0&size=20&sort=title,asc&q=Text&filter=authors,Terra&expand=highlightedText"))
        .andExpect(status().isOk())
        .andDo(
            document(
                "query",
                queryParameters(
                    filterQueryParameter(),
                    pageQueryParameter(),
                    qQueryParameter(),
                    sizeQueryParameter(),
                    sortQueryParameter(),
                    expandQueryParameter(Expansion.HIGHLIGHTED_TEXT)),
                responseFields(linksField())
                    .andWithPrefix("page.", pageFields())
                    .andWithPrefix(
                        "content[].",
                        idField(),
                        titleField(),
                        authorsField(),
                        createdField(),
                        entityField(),
                        objectivesField(),
                        servicesField(),
                        methodsField(),
                        sampleSizeField(),
                        segmentsField(),
                        supportingFilesField(),
                        canAccessField(),
                        companyField(),
                        teamRoleField(),
                        specializedMethodsField(),
                        additionalSegmentsField(),
                        taxonomyTag1Field(),
                        taxonomyTag2Field(),
                        taxonomyTag3Field(),
                        highlightedTextField(),
                        linksField().ignored())));
  }

  @Test
  @WithRedesignUser(role = RoleAuthority.ROLE_RH_USER)
  public void testCreate_success() throws Exception {
    when(personRepository.existsByEmail(testPersonRef())).thenReturn(true);
    when(companyRepository.existsByApiId(testCompanyRef())).thenReturn(true);
    when(companyRepository.findByApiId((testCompanyRef()))).thenReturn(Optional.of(testCompany()));
    when(researchRepository.save(any(Research.class))).then(returnsFirstArg());
    mockMvc
        .perform(
            post("/research")
                .contentType(MediaType.APPLICATION_JSON)
                .content(
                    """
                     {
                       "title": "Shinra User Research",
                       "authors": [
                         "%s"
                       ],
                       "companyId": "%s",
                       "objectives": "Free Form Text",
                       "services": [
                         "Concept Test"
                       ],
                       "segments": [
                         "Government"
                       ],
                       "methods": ["Survey"],
                       "supportingFiles": [
                         {
                           "href": "https://example.com",
                           "name": "report_url"
                         }
                       ],
                       "sampleSize": 100,
                       "teamRole": "In-house",
                       "additionalSegments": [
                         "GenZ"
                       ],
                       "specializedMethods": [
                         "Q-sort Exercise"
                       ]
                     }
                  """
                        .formatted(testPersonRef(), testCompanyRef())))
        .andExpect(status().isCreated())
        .andDo(
            document(
                "create",
                requestFields(
                    titleField(),
                    authorsField(),
                    objectivesField(),
                    servicesField(),
                    segmentsField(),
                    methodsField(),
                    supportingFilesField(),
                    sampleSizeField(),
                    teamRoleField(),
                    additionalSegmentsField(),
                    specializedMethodsField(),
                    companyIdField()),
                responseFields(
                    idField(),
                    linksField(),
                    titleField(),
                    authorsField(),
                    companyField(),
                    entityField(),
                    specializedMethodsField(),
                    objectivesField(),
                    servicesField(),
                    methodsField(),
                    sampleSizeField(),
                    segmentsField(),
                    supportingFilesField(),
                    canAccessField(),
                    teamRoleField(),
                    taxonomyTag1Field(),
                    taxonomyTag2Field(),
                    taxonomyTag3Field(),
                    additionalSegmentsField(),
                    linksField().ignored())));
  }

  @Test
  @WithRedesignUser(role = RoleAuthority.ROLE_RH_USER)
  public void testCreate_requiredFieldsMissing() throws Exception {
    when(personRepository.existsByEmail(testPersonRef())).thenReturn(true);
    when(companyRepository.existsByApiId(testCompanyRef())).thenReturn(true);

    mockMvc
        .perform(
            post("/research")
                .contentType(MediaType.APPLICATION_JSON)
                .content(
                    """
               {}
          """
                        .formatted(testPersonRef(), testCompanyRef())))
        .andExpect(status().isUnprocessableEntity())
        .andExpect(jsonPath("$.errors[*].name", hasItem("objectives")))
        .andExpect(jsonPath("$.errors[*].name", hasItem("authors")))
        .andExpect(jsonPath("$.errors[*].name", hasItem("title")))
        .andExpect(jsonPath("$.errors[*].name", hasItem("segments")))
        .andExpect(jsonPath("$.errors[*].name", hasItem("services")))
        .andExpect(jsonPath("$.errors[*].name", hasItem("companyId")))
        .andExpect(jsonPath("$.errors[*].name", hasItem("methods")))
        .andExpect(jsonPath("$.errors[*].name", hasItem("supportingFiles")));
  }

  @Test
  @WithRedesignUser(role = RoleAuthority.ROLE_RH_USER)
  public void testCreate_unknownAuthor() throws Exception {
    when(personRepository.existsByEmail(testPersonRef())).thenReturn(false);
    when(companyRepository.existsByApiId(testCompanyRef())).thenReturn(true);

    mockMvc
        .perform(
            post("/research")
                .contentType(MediaType.APPLICATION_JSON)
                .content(
                    """
               {
                 "title": "Shinra User Research",
                 "authors": ["%s"],
                 "companyId": "%s",
                 "objectives": "Free Form Text",
                 "services": ["Concept Test"],
                 "segments": ["Government"],
                 "methods": ["Survey"],
                 "supportingFiles": [{ "name":"report_url", "href": "https://example.com" }]
               }
          """
                        .formatted(testPersonRef(), testCompanyRef())))
        .andExpect(status().isUnprocessableEntity())
        .andExpect(jsonPath("$.errors[0].name", is("authors")))
        .andExpect(jsonPath("$.errors[0].rejectedValue", is(testPersonRef().value())))
        .andExpect(jsonPath("$.errors[0].description", is("must exist")));
  }

  @Test
  @WithRedesignUser(role = RoleAuthority.ROLE_RH_USER)
  public void testCreate_unknownCompany() throws Exception {
    when(personRepository.existsByEmail(testPersonRef())).thenReturn(true);
    when(companyRepository.existsByApiId(testCompanyRef())).thenReturn(false);

    mockMvc
        .perform(
            post("/research")
                .contentType(MediaType.APPLICATION_JSON)
                .content(
                    """
               {
                 "title": "Shinra User Research",
                 "authors": ["%s"],
                 "companyId": "%s",
                 "objectives": "Free Form Text",
                 "services": ["Concept Test"],
                 "segments": ["Government"],
                 "methods": ["Survey"],
                 "supportingFiles": [{ "name":"report_url", "href": "https://example.com" }]
               }
          """
                        .formatted(testPersonRef(), testCompanyRef())))
        .andExpect(status().isUnprocessableEntity())
        .andExpect(jsonPath("$.errors[0].name", is("companyId")))
        .andExpect(jsonPath("$.errors[0].rejectedValue", is(testCompanyRef().value())))
        .andExpect(jsonPath("$.errors[0].description", is("must exist")));
  }

  @Test
  @WithRedesignUser(role = RoleAuthority.ROLE_RH_USER)
  public void testCreate_missingReport() throws Exception {
    when(personRepository.existsByEmail(testPersonRef())).thenReturn(true);
    when(companyRepository.existsByApiId(testCompanyRef())).thenReturn(true);

    mockMvc
        .perform(
            post("/research")
                .contentType(MediaType.APPLICATION_JSON)
                .content(
                    """
       {
         "title": "Shinra User Research",
         "authors": ["%s"],
         "companyId": "%s",
         "objectives": "Free Form Text",
         "services": ["Concept Test"],
         "segments": ["Government"],
         "methods": ["Survey"],
         "supportingFiles": [{ "href": "https://example.com" }]
       }
  """
                        .formatted(testPersonRef(), testCompanyRef())))
        .andExpect(status().isUnprocessableEntity())
        .andExpect(jsonPath("$.errors[0].name", is("supportingFiles")))
        .andExpect(jsonPath("$.errors[0].description", is("must contain 'report_url'")));
  }

  @Test
  @WithRedesignUser(role = RoleAuthority.ROLE_OP_CO_USER)
  public void testFilters_returnsResults() throws Exception {
    var filterOption =
        FilterOptions.builder()
            .field("services")
            .terms(List.of(Term.of("General insights", 10)))
            .build();

    var command =
        SearchFilterOptionsCommand.builder()
            .index(SearchIndex.RESEARCH)
            .fields(VALID_SEARCH_FILTERS)
            .build();

    when(searchClient.getFilterOptions(command)).thenReturn(List.of(filterOption));

    mockMvc
        .perform(get("/research/filters"))
        .andExpect(status().isOk())
        .andDo(
            document(
                "filters",
                responseFields(
                        linksField(), subsectionWithPath("content").description("List of filters"))
                    .andWithPrefix("content[].", keyField(), optionsField())));
  }

  @Test
  @WithRedesignUser(role = RoleAuthority.ROLE_OP_CO_USER)
  public void testGet_success() throws Exception {
    when(researchRepository.findByApiId(testResearchRef())).thenReturn(Optional.of(testResearch()));
    mockMvc
        .perform(get("/research/{researchId}", testResearchRef()))
        .andExpect(status().isOk())
        .andDo(
            document(
                "get",
                responseFields(
                    idField(),
                    linksField(),
                    titleField(),
                    authorsField(),
                    companyField(),
                    entityField(),
                    specializedMethodsField(),
                    objectivesField(),
                    servicesField(),
                    methodsField(),
                    sampleSizeField(),
                    segmentsField(),
                    supportingFilesField(),
                    canAccessField(),
                    teamRoleField(),
                    taxonomyTag1Field(),
                    taxonomyTag2Field(),
                    taxonomyTag3Field(),
                    additionalSegmentsField(),
                    createdField(),
                    linksField().ignored())));
  }

  @Test
  @WithRedesignUser(role = RoleAuthority.ROLE_OP_CO_USER)
  public void testGet_unknownResearch() throws Exception {
    mockMvc
        .perform(get("/research/{researchId}", testResearchRef()))
        .andExpect(status().isNotFound())
        .andExpect(jsonPath("$.message", is("Research does not exist.")));
  }

  @Test
  @WithRedesignUser(role = RoleAuthority.ROLE_RH_ADMIN)
  public void testDelete_success() throws Exception {
    when(researchRepository.findByApiId(testResearchRef())).thenReturn(Optional.of(testResearch()));
    mockMvc
        .perform(delete("/research/{researchId}", testResearchRef()))
        .andExpect(status().isNoContent())
        .andDo(document("delete"));
  }

  @Test
  @WithRedesignUser(role = RoleAuthority.ROLE_RH_ADMIN)
  public void testDelete_unknownResearch() throws Exception {
    mockMvc
        .perform(delete("/research/{researchId}", testResearchRef()))
        .andExpect(status().isNotFound())
        .andExpect(jsonPath("$.message", is("Research does not exist.")));
  }

  private static FieldDescriptor titleField() {
    return fieldWithPath("title").description("Name of report");
  }

  private static FieldDescriptor authorsField() {
    return fieldWithPath("authors").description("Authors of report");
  }

  private static FieldDescriptor entityField() {
    return fieldWithPath("entity").description("Association with company");
  }

  private static FieldDescriptor objectivesField() {
    return fieldWithPath("objectives").description("Goals of the report");
  }

  private static FieldDescriptor servicesField() {
    return fieldWithPath("services").description("User Research (UX) frameworks used");
  }

  private static FieldDescriptor methodsField() {
    return fieldWithPath("methods").description("Survey method used with participants");
  }

  private static FieldDescriptor sampleSizeField() {
    return fieldWithPath("sampleSize").description("Number of participants in research study");
  }

  private static FieldDescriptor segmentsField() {
    return fieldWithPath("segments").description("Segments of participants");
  }

  private static FieldDescriptor supportingFilesField() {
    return subsectionWithPath("supportingFiles")
        .description(
            "Findings and supporting documents from the research sprint. Google Documents and Slides are indexed into our search server.");
  }

  private static FieldDescriptor companyField() {
    return subsectionWithPath("company")
        .description("Company, concept, or theme associated with the research article");
  }

  private static FieldDescriptor teamRoleField() {
    return fieldWithPath("teamRole").description("Which team conducted the research sprint");
  }

  private static FieldDescriptor additionalSegmentsField() {
    return fieldWithPath("additionalSegments")
        .description("Additional segments that apply to the sprint");
  }

  private static FieldDescriptor specializedMethodsField() {
    return fieldWithPath("specializedMethods")
        .description("Specialized methods that apply to the sprint");
  }

  private static FieldDescriptor companyIdField() {
    return fieldWithPath("companyId")
        .description("Associate a company, concept or theme with a piece of research");
  }
}
