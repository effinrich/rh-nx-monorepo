package com.redesignhealth.company.api.controller;

import static com.redesignhealth.company.api.client.search.entity.ExpertNoteSearchDoc.INTERVIEWEE_NAME_FIELD;
import static com.redesignhealth.company.api.client.search.entity.ExpertNoteSearchDoc.STAKEHOLDERS_FIELD;
import static com.redesignhealth.company.api.scaffolding.DocUtils.canAccessField;
import static com.redesignhealth.company.api.scaffolding.DocUtils.companiesField;
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
import static com.redesignhealth.company.api.scaffolding.DocUtils.stakeholdersField;
import static com.redesignhealth.company.api.scaffolding.DocUtils.taxonomyTag1Field;
import static com.redesignhealth.company.api.scaffolding.DocUtils.taxonomyTag2Field;
import static com.redesignhealth.company.api.scaffolding.DocUtils.taxonomyTag3Field;
import static com.redesignhealth.company.api.scaffolding.Fixtures.testCompany;
import static com.redesignhealth.company.api.scaffolding.Fixtures.testCompanyRef;
import static com.redesignhealth.company.api.scaffolding.Fixtures.testExpertCallSearchDoc;
import static com.redesignhealth.company.api.scaffolding.Fixtures.testExpertNote;
import static com.redesignhealth.company.api.scaffolding.Fixtures.testExpertNoteRef;
import static com.redesignhealth.company.api.scaffolding.Fixtures.testHighlightedText;
import static com.redesignhealth.company.api.scaffolding.Fixtures.testPersonRef;
import static com.redesignhealth.company.api.service.ExpertNoteService.VALID_SEARCH_FILTERS;
import static org.hamcrest.Matchers.hasItem;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyCollection;
import static org.mockito.ArgumentMatchers.anySet;
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
import com.redesignhealth.company.api.client.search.entity.ExpertNoteSearchDoc;
import com.redesignhealth.company.api.client.search.entity.FilterOptions;
import com.redesignhealth.company.api.client.search.entity.SearchResult;
import com.redesignhealth.company.api.client.search.entity.Term;
import com.redesignhealth.company.api.conflicts.ConflictsEngine;
import com.redesignhealth.company.api.entity.request.RoleAuthority;
import com.redesignhealth.company.api.expansion.Expansion;
import com.redesignhealth.company.api.property.ExpertNoteEntityConverter;
import com.redesignhealth.company.api.repository.CompanyRepository;
import com.redesignhealth.company.api.repository.ExpertNoteRepository;
import com.redesignhealth.company.api.repository.PersonRepository;
import com.redesignhealth.company.api.scaffolding.CommonTestConfig;
import com.redesignhealth.company.api.scaffolding.WithRedesignUser;
import com.redesignhealth.company.api.service.ExpertNoteService;
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

@WebMvcTest(ExpertNoteController.class)
@Import({CommonTestConfig.class})
@AutoConfigureRestDocs("target/generated-snippets/expert-note")
class ExpertNoteControllerTests {
  @Autowired private MockMvc mockMvc;
  @MockBean private SearchClient searchClient;
  @MockBean private CompanyRepository companyRepository;
  @MockBean private PersonRepository personRepository;
  @MockBean private ConflictsEngine conflictsEngine;
  @MockBean private ExpertNoteRepository expertNoteRepository;
  @MockBean private GoogleDriveClient googleDriveClient;

  @TestConfiguration
  static class TestConfig {
    @Bean
    public ExpertNoteService expertNoteService(
        SearchClient searchClient,
        ExpertNoteEntityConverter expertNoteEntityConverter,
        CompanyRepository companyRepository,
        PersonRepository personRepository,
        ConflictsEngine conflictsEngine,
        CompanyTaxonomy companyTaxonomy,
        ExpertNoteRepository expertNoteRepository,
        GoogleDriveClient googleDriveClient) {
      return new ExpertNoteService(
          searchClient,
          expertNoteEntityConverter,
          companyRepository,
          personRepository,
          conflictsEngine,
          companyTaxonomy,
          googleDriveClient,
          expertNoteRepository);
    }
  }

  @Test
  @WithRedesignUser(role = RoleAuthority.ROLE_OP_CO_USER)
  public void testQuery_returnsResults() throws Exception {
    when(companyRepository.findAllByApiIdIn(Set.of(testCompanyRef())))
        .thenReturn(Set.of(testCompany()));
    var command =
        SearchCommand.builder()
            .index(SearchIndex.EXPERT_NOTE)
            .query("Text")
            .searchFilters(List.of(INTERVIEWEE_NAME_FIELD + ",Terra"))
            .highlight(true)
            .fields(ExpertNoteService.FIELDS_TO_SEARCH)
            .build();
    var pageable = PageRequest.of(0, 20, Sort.by(INTERVIEWEE_NAME_FIELD));
    when(searchClient.search(command, pageable, ExpertNoteSearchDoc.class))
        .thenReturn(
            new PageImpl<>(
                List.of(
                    SearchResult.of(
                        testExpertCallSearchDoc(), testHighlightedText(), "documentId")),
                pageable,
                1));

    mockMvc
        .perform(
            get(
                "/expert-note?page=0&size=20&sort=intervieweeName,asc&q=Text&filter=intervieweeName,Terra&expand=highlightedText"))
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
                        intervieweeNameField(),
                        intervieweeCompanyField(),
                        typeField(),
                        sourceOfInterviewField(),
                        companiesField(),
                        createdField(),
                        intervieweeEmailField(),
                        linkedInProfileHrefField(),
                        additionalTagsField(),
                        attachmentsField(),
                        stakeholdersField(),
                        noteTakerField(),
                        taxonomyTag1Field(),
                        taxonomyTag2Field(),
                        taxonomyTag3Field(),
                        canAccessField(),
                        idField(),
                        associatedEntitiesField(),
                        highlightedTextField(),
                        linksField().ignored())));
  }

  @Test
  @WithRedesignUser(role = RoleAuthority.ROLE_RH_USER)
  public void testCreate_success() throws Exception {
    when(personRepository.existsByEmail(testPersonRef())).thenReturn(true);
    when(companyRepository.findAllByApiIdIn(anyCollection())).thenReturn(Set.of(testCompany()));
    when(conflictsEngine.hasAccess(testCompanyRef())).thenReturn(true);
    when(googleDriveClient.getDocument(any(), any())).thenReturn("RAW NOTES");
    mockMvc
        .perform(
            post("/expert-note")
                .contentType(MediaType.APPLICATION_JSON)
                .content(
                    """
       {
         "intervieweeName": "Jane Doe",
         "intervieweeCompany": "Dragon Wings",
         "intervieweeEmail": "jane.doe@example.com",
         "type": "Expert Call",
         "sourceOfInterview": "Organically Sourced (Paid)",
         "linkedInProfileHref": "https://example.com",
         "stakeholders": ["Government"],
         "companyIds": ["%s"],
         "additionalTags": ["tag"],
         "noteHref": "https://docs.google.com/document/d/123",
         "attachments": [{ "name": "name.txt", "href": "https://example.com"}],
         "isAttachmentDisclaimerAccepted": true,
         "noteTaker": "test@redesignhealth.com"
       }
       """
                        .formatted(testCompanyRef())))
        .andExpect(status().isCreated())
        .andDo(
            document(
                "create",
                requestFields(
                    intervieweeNameField(),
                    intervieweeCompanyField(),
                    intervieweeEmailField(),
                    typeField(),
                    sourceOfInterviewField(),
                    linkedInProfileHrefField(),
                    stakeholdersField(),
                    companyIdsField(),
                    additionalTagsField(),
                    noteHrefField(),
                    attachmentsField(),
                    isAttachmentDisclaimerAcceptedField(),
                    noteTakerField()),
                responseFields(
                    intervieweeNameField(),
                    intervieweeCompanyField(),
                    typeField(),
                    createdField(),
                    sourceOfInterviewField(),
                    stakeholdersField(),
                    associatedEntitiesField(),
                    companiesField(),
                    intervieweeEmailField(),
                    linkedInProfileHrefField(),
                    additionalTagsField(),
                    attachmentsField(),
                    noteHrefField(),
                    noteRawField(),
                    isAttachmentDisclaimerAcceptedField(),
                    noteTakerField(),
                    taxonomyTag1Field(),
                    taxonomyTag2Field(),
                    taxonomyTag3Field(),
                    canAccessField(),
                    idField(),
                    linksField().ignored())));
  }

  @Test
  @WithRedesignUser(role = RoleAuthority.ROLE_RH_USER)
  public void testCreate_noteHrefRequiredIfNoteRawMissing() throws Exception {
    when(personRepository.existsByEmail(testPersonRef())).thenReturn(true);
    mockMvc
        .perform(
            post("/expert-note")
                .contentType(MediaType.APPLICATION_JSON)
                .content(
                    """
              {
                 "intervieweeName": "Jane Doe",
                 "type": "Expert Call",
                 "sourceOfInterview": "Organically Sourced (Paid)",
                 "companyIds": ["1jlaksd1"],
                 "noteTaker": "test@redesignhealth.com"
              }
        """))
        .andExpect(status().isUnprocessableEntity())
        .andExpect(jsonPath("$.errors[0].name", is("noteHref")))
        .andExpect(jsonPath("$.errors[0].description", is("must not be blank")));
  }

  @Test
  @WithRedesignUser(role = RoleAuthority.ROLE_RH_USER)
  public void testCreate_unknownPerson() throws Exception {
    when(personRepository.findByEmail(testPersonRef())).thenReturn(Optional.empty());
    mockMvc
        .perform(
            post("/expert-note")
                .contentType(MediaType.APPLICATION_JSON)
                .content(
                    """
      {
         "intervieweeName": "Jane Doe",
         "type": "Expert Call",
         "sourceOfInterview": "Organically Sourced (Paid)",
         "companyIds": ["1jlaksd1"],
         "noteTaker": "test@redesignhealth.com",
         "noteHref": "https://example.com"
      }
"""))
        .andExpect(status().isUnprocessableEntity())
        .andExpect(jsonPath("$.errors[0].name", is("noteTaker")))
        .andExpect(jsonPath("$.errors[0].rejectedValue", is("test@redesignhealth.com")))
        .andExpect(jsonPath("$.errors[0].description", is("must exist")));
  }

  @Test
  @WithRedesignUser(role = RoleAuthority.ROLE_RH_USER)
  public void testCreate_unknownCompany() throws Exception {
    when(personRepository.existsByEmail(testPersonRef())).thenReturn(true);
    mockMvc
        .perform(
            post("/expert-note")
                .contentType(MediaType.APPLICATION_JSON)
                .content(
                    """
              {
                 "intervieweeName": "Jane Doe",
                 "type": "Expert Call",
                 "sourceOfInterview": "Organically Sourced (Paid)",
                 "companyIds": ["1jlaksd1", "G2F3asd"],
                 "noteTaker": "test@redesignhealth.com",
                 "noteHref": "https://example.com"
              }
        """))
        .andExpect(status().isUnprocessableEntity())
        .andExpect(jsonPath("$.errors[0].name", is("companyIds")))
        .andExpect(jsonPath("$.errors[0].rejectedValue", is("1jlaksd1,G2F3asd")))
        .andExpect(jsonPath("$.errors[0].description", is("must exist")));
  }

  @Test
  @WithRedesignUser(role = RoleAuthority.ROLE_RH_USER)
  public void testCreate_baseRequiredFields() throws Exception {
    when(personRepository.findByEmail(testPersonRef())).thenReturn(Optional.empty());
    when(companyRepository.findAllByApiIdIn(anySet())).thenReturn(Set.of(testCompany()));
    mockMvc
        .perform(
            post("/expert-note")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
              {}
        """))
        .andExpect(status().isUnprocessableEntity())
        .andExpect(jsonPath("$.errors[*].name", hasItem("type")))
        .andExpect(jsonPath("$.errors[*].name", hasItem("intervieweeName")))
        .andExpect(jsonPath("$.errors[*].name", hasItem("companyIds")))
        .andExpect(jsonPath("$.errors[*].name", hasItem("sourceOfInterview")));
  }

  @Test
  @WithRedesignUser(role = RoleAuthority.ROLE_RH_USER)
  public void testFilters_returnsResults() throws Exception {
    var filterOption =
        FilterOptions.builder()
            .field(STAKEHOLDERS_FIELD)
            .terms(List.of(Term.of("Government", 10)))
            .build();

    var command =
        SearchFilterOptionsCommand.builder()
            .index(SearchIndex.EXPERT_NOTE)
            .fields(VALID_SEARCH_FILTERS)
            .build();

    when(searchClient.getFilterOptions(command)).thenReturn(List.of(filterOption));

    mockMvc
        .perform(get("/expert-note/filters"))
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
            .index(SearchIndex.EXPERT_NOTE)
            .fields(VALID_SEARCH_FILTERS)
            .build();

    when(searchClient.getFilterOptions(command)).thenReturn(List.of());

    mockMvc
        .perform(get("/expert-note/filters"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.content", hasSize(0)));
  }

  @Test
  @WithRedesignUser(role = RoleAuthority.ROLE_OP_CO_USER)
  public void testGet_success() throws Exception {
    when(expertNoteRepository.findByApiId(testExpertNoteRef()))
        .thenReturn(Optional.of(testExpertNote()));
    mockMvc
        .perform(get("/expert-note/{expertNoteId}", testExpertNoteRef()))
        .andExpect(status().isOk())
        .andDo(
            document(
                "get",
                responseFields(
                    intervieweeNameField(),
                    intervieweeCompanyField(),
                    typeField(),
                    createdField(),
                    sourceOfInterviewField(),
                    stakeholdersField(),
                    associatedEntitiesField(),
                    companiesField(),
                    intervieweeEmailField(),
                    linkedInProfileHrefField(),
                    additionalTagsField(),
                    attachmentsField(),
                    noteHrefField(),
                    noteRawField(),
                    isAttachmentDisclaimerAcceptedField(),
                    noteTakerField(),
                    taxonomyTag1Field(),
                    taxonomyTag2Field(),
                    taxonomyTag3Field(),
                    canAccessField(),
                    idField(),
                    linksField().ignored())));
  }

  @Test
  @WithRedesignUser(role = RoleAuthority.ROLE_OP_CO_USER)
  public void testGet_unknownId() throws Exception {
    when(expertNoteRepository.findByApiId(testExpertNoteRef())).thenReturn(Optional.empty());
    mockMvc
        .perform(get("/expert-note/{expertNoteId}", testExpertNoteRef()))
        .andExpect(status().isNotFound())
        .andExpect(jsonPath("$.message", is("Expert Note does not exist.")));
  }

  @Test
  @WithRedesignUser(role = RoleAuthority.ROLE_RH_ADMIN)
  public void testDelete_success() throws Exception {
    when(expertNoteRepository.findByApiId(testExpertNoteRef()))
        .thenReturn(Optional.of(testExpertNote()));
    mockMvc
        .perform(delete("/expert-note/{expertNoteId}", testExpertNoteRef()))
        .andExpect(status().isNoContent())
        .andDo(document("delete"));
  }

  @Test
  @WithRedesignUser(role = RoleAuthority.ROLE_RH_ADMIN)
  public void testDelete_unknownId() throws Exception {
    when(expertNoteRepository.findByApiId(testExpertNoteRef())).thenReturn(Optional.empty());
    mockMvc
        .perform(delete("/expert-note/{expertNoteId}", testExpertNoteRef()))
        .andExpect(status().isNotFound());
  }

  private static FieldDescriptor noteTakerField() {
    return fieldWithPath("noteTaker").description("Person uploading the notes");
  }

  private static FieldDescriptor isAttachmentDisclaimerAcceptedField() {
    return fieldWithPath("isAttachmentDisclaimerAccepted")
        .description("Required if user is uploading a Note with an attachment.");
  }

  private static FieldDescriptor noteHrefField() {
    return fieldWithPath("noteHref")
        .description(
            "Link to Google Drive location of note document; one of Notes URL or Notes is required.");
  }

  private static FieldDescriptor noteRawField() {
    return fieldWithPath("noteRaw")
        .description("Body of notes; one of Notes URL or Notes is required.");
  }

  private static FieldDescriptor intervieweeNameField() {
    return fieldWithPath("intervieweeName").description("The person interviewed");
  }

  private static FieldDescriptor intervieweeCompanyField() {
    return fieldWithPath("intervieweeCompany").description("The company the person works for");
  }

  private static FieldDescriptor typeField() {
    return fieldWithPath("type").description("Interview or article/publication");
  }

  private static FieldDescriptor sourceOfInterviewField() {
    return fieldWithPath("sourceOfInterview").description("Interview or article/publication");
  }

  private static FieldDescriptor intervieweeEmailField() {
    return fieldWithPath("intervieweeEmail").description("Interviewee email address");
  }

  private static FieldDescriptor linkedInProfileHrefField() {
    return fieldWithPath("linkedInProfileHref")
        .description("LinkedIn profile URL of interviewee, if available");
  }

  private static FieldDescriptor additionalTagsField() {
    return fieldWithPath("additionalTags")
        .description(
            "Any additional tags deemed relevant by notetaker pulled from existing list with ability to add new tags ad hoc");
  }

  private static FieldDescriptor attachmentsField() {
    return subsectionWithPath("attachments").description("Attached files");
  }

  private static FieldDescriptor companyIdsField() {
    return fieldWithPath("companyIds").description("Associate OpCos, Concepts, and Themes by id");
  }

  private static FieldDescriptor associatedEntitiesField() {
    return fieldWithPath("associatedEntities")
        .description("Entities associated to the expert note");
  }
}
