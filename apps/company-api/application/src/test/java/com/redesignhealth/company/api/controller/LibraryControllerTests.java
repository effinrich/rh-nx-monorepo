package com.redesignhealth.company.api.controller;

import static com.redesignhealth.company.api.scaffolding.DocUtils.expandQueryParameter;
import static com.redesignhealth.company.api.scaffolding.DocUtils.linksField;
import static com.redesignhealth.company.api.scaffolding.DocUtils.pageFields;
import static com.redesignhealth.company.api.scaffolding.DocUtils.pageQueryParameter;
import static com.redesignhealth.company.api.scaffolding.DocUtils.parentIdField;
import static com.redesignhealth.company.api.scaffolding.DocUtils.remoteContentIdField;
import static com.redesignhealth.company.api.scaffolding.DocUtils.remoteContentSourceField;
import static com.redesignhealth.company.api.scaffolding.DocUtils.selfLink;
import static com.redesignhealth.company.api.scaffolding.DocUtils.sizeQueryParameter;
import static com.redesignhealth.company.api.scaffolding.DocUtils.sortQueryParameter;
import static com.redesignhealth.company.api.scaffolding.Fixtures.TEST_LIBRARY_CONTENT_ID;
import static com.redesignhealth.company.api.scaffolding.Fixtures.testLibrary;
import static com.redesignhealth.company.api.scaffolding.Fixtures.testLibraryContent;
import static com.redesignhealth.company.api.scaffolding.Fixtures.testLibraryRef;
import static com.redesignhealth.company.api.scaffolding.Fixtures.testPersonRef;
import static com.redesignhealth.company.api.scaffolding.Fixtures.testTopic;
import static org.hamcrest.Matchers.is;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;
import static org.springframework.restdocs.hypermedia.HypermediaDocumentation.linkWithRel;
import static org.springframework.restdocs.hypermedia.HypermediaDocumentation.links;
import static org.springframework.restdocs.mockmvc.MockMvcRestDocumentation.document;
import static org.springframework.restdocs.payload.PayloadDocumentation.fieldWithPath;
import static org.springframework.restdocs.payload.PayloadDocumentation.requestFields;
import static org.springframework.restdocs.payload.PayloadDocumentation.responseFields;
import static org.springframework.restdocs.payload.PayloadDocumentation.subsectionWithPath;
import static org.springframework.restdocs.request.RequestDocumentation.parameterWithName;
import static org.springframework.restdocs.request.RequestDocumentation.queryParameters;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.util.MimeTypeUtils.TEXT_HTML;
import static org.springframework.util.MimeTypeUtils.TEXT_PLAIN;

import com.redesignhealth.company.api.assembler.LibraryContentAssembler;
import com.redesignhealth.company.api.assembler.TopicAssembler;
import com.redesignhealth.company.api.assembler.google.GoogleDocsLinkGenerator;
import com.redesignhealth.company.api.client.email.EmailSender;
import com.redesignhealth.company.api.client.file.GoogleDriveClient;
import com.redesignhealth.company.api.client.file.GoogleDriveLambdaClient;
import com.redesignhealth.company.api.client.file.MkDocsLambdaClient;
import com.redesignhealth.company.api.client.file.RemoteFileClient;
import com.redesignhealth.company.api.client.search.SearchClient;
import com.redesignhealth.company.api.client.search.command.SearchCommand;
import com.redesignhealth.company.api.client.search.command.SearchGetCommand;
import com.redesignhealth.company.api.client.search.command.SearchIndex;
import com.redesignhealth.company.api.client.search.entity.LibraryContentSearchDoc;
import com.redesignhealth.company.api.client.search.entity.SearchResult;
import com.redesignhealth.company.api.document.Topic;
import com.redesignhealth.company.api.dto.enums.RemoteContentSource;
import com.redesignhealth.company.api.dto.enums.TopicType;
import com.redesignhealth.company.api.entity.library.Library;
import com.redesignhealth.company.api.entity.ref.ContentRef;
import com.redesignhealth.company.api.entity.request.RoleAuthority;
import com.redesignhealth.company.api.expansion.Expansion;
import com.redesignhealth.company.api.repository.ContentRepository;
import com.redesignhealth.company.api.repository.LibraryRepository;
import com.redesignhealth.company.api.scaffolding.CommonTestConfig;
import com.redesignhealth.company.api.scaffolding.DocUtils;
import com.redesignhealth.company.api.scaffolding.WithRedesignUser;
import com.redesignhealth.company.api.service.LibraryContentService;
import com.redesignhealth.company.api.service.LibraryService;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;
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
import org.springframework.restdocs.hypermedia.LinkDescriptor;
import org.springframework.restdocs.payload.FieldDescriptor;
import org.springframework.restdocs.request.ParameterDescriptor;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(LibraryController.class)
@Import({CommonTestConfig.class})
@AutoConfigureRestDocs("target/generated-snippets/library")
class LibraryControllerTests {

  @Autowired private MockMvc mockMvc;

  @MockBean private SearchClient searchService;

  @MockBean private GoogleDriveClient googleDriveClient;

  @MockBean private GoogleDriveLambdaClient googleDriveLambdaClient;

  @MockBean private MkDocsLambdaClient mkDocsLambdaClient;

  @MockBean private LibraryRepository libraryRepository;
  @MockBean private ContentRepository contentRepository;

  @MockBean private EmailSender emailSender;

  private static final ContentRef TEST_PARENT_ID = ContentRef.of("m4asd123");
  private static final Library library = Library.from(testLibraryRef());

  @TestConfiguration
  static class TestConfig {
    @Bean
    public TopicAssembler topicAssembler() {
      return new TopicAssembler(new GoogleDocsLinkGenerator("https://example.com"));
    }

    @Bean
    public LibraryContentAssembler libraryContentAssembler() {
      return new LibraryContentAssembler(new GoogleDocsLinkGenerator("https://example.com"));
    }

    @Bean
    public Map<RemoteContentSource, RemoteFileClient> remoteFileClients(
        GoogleDriveLambdaClient googleDriveLambdaClient, MkDocsLambdaClient mkDocsLambdaClient) {
      return Map.of(
          RemoteContentSource.GOOGLE_DRIVE,
          googleDriveLambdaClient,
          RemoteContentSource.MKDOCS,
          mkDocsLambdaClient);
    }

    @Bean
    public LibraryService libraryService(
        SearchClient searchClient,
        GoogleDriveClient googleDriveClient,
        Map<RemoteContentSource, RemoteFileClient> remoteFileClients,
        LibraryRepository libraryRepository) {
      return new LibraryService(
          searchClient, googleDriveClient, remoteFileClients, libraryRepository);
    }

    @Bean
    public LibraryContentService libraryContentService(
        ContentRepository contentRepository,
        SearchClient searchClient,
        Map<RemoteContentSource, RemoteFileClient> remoteFileClients,
        LibraryRepository libraryRepository,
        GoogleDriveClient googleDriveClient,
        EmailSender emailSender) {
      return new LibraryContentService(
          contentRepository,
          searchClient,
          libraryRepository,
          remoteFileClients,
          googleDriveClient,
          emailSender,
          List.of(testPersonRef().getEmail()));
    }
  }

  @Test
  @WithRedesignUser(role = RoleAuthority.ROLE_OP_CO_USER)
  public void testSearchTopics_success() throws Exception {
    var command =
        SearchCommand.builder()
            .index(SearchIndex.TOPIC)
            .query("Text")
            .searchFilters(List.of("category,Company Foundations"))
            .build();
    var pageable = PageRequest.of(0, 20);
    when(searchService.search(command, pageable, Topic.class))
        .thenReturn(new PageImpl<>(List.of(SearchResult.of(testTopic())), pageable, 1));
    mockMvc
        .perform(
            get("/library/topic/search?size=20&page=0&q=Text&filter=category,Company Foundations"))
        .andExpect(status().isOk())
        .andDo(
            document(
                "search",
                queryParameters(
                    qQueryParameter(),
                    filterQueryParameter(),
                    sizeQueryParameter(),
                    pageQueryParameter()),
                responseFields(
                        subsectionWithPath("content").description("List of topics"), linksField())
                    .andWithPrefix(
                        "content[].",
                        titleField(),
                        descriptionField(),
                        categoryField(),
                        typeField(),
                        linksField().ignored())
                    .andWithPrefix("page.", pageFields())));
  }

  @Test
  @WithRedesignUser(role = RoleAuthority.ROLE_RH_ADMIN)
  public void testUpsertTopic_success() throws Exception {
    var topic = testTopic();
    when(googleDriveLambdaClient.getDocument(topic.getId(), TEXT_PLAIN))
        .thenReturn("Text Representation\nOf Document");

    mockMvc
        .perform(
            put("/library/topic/{id}", topic.getId())
                .content(
                    """
          {
            "title": "Best Practices for Maintaining Your Cap Table Post Financing",
            "description": "Describes the best practices for maintaining a capitalization table.",
            "category": "Company Foundations",
            "type": "ARTICLE"
          }
        """)
                .contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isOk())
        .andExpect(
            jsonPath("$.title", is("Best Practices for Maintaining Your Cap Table Post Financing")))
        .andExpect(
            jsonPath(
                "$.description",
                is("Describes the best practices for maintaining a capitalization table.")))
        .andExpect(jsonPath("$.category", is("Company Foundations")))
        .andExpect(jsonPath("$.links[0].rel", is("self")))
        .andExpect(jsonPath("$.links[0].href", is("http://localhost:8080/library/1")))
        .andExpect(jsonPath("$.links[1].rel", is("googleDocs")))
        .andExpect(jsonPath("$.links[1].href", is("https://example.com/document/d/1")))
        .andDo(
            document(
                "upsert",
                requestFields(titleField(), descriptionField(), categoryField(), typeField()),
                responseFields(
                    idField(),
                    titleField(),
                    descriptionField(),
                    categoryField(),
                    typeField(),
                    contentField(),
                    linksField()),
                links(selfLink(), googleDocsLink())));
  }

  @Test
  @WithRedesignUser(role = RoleAuthority.ROLE_OP_CO_USER)
  public void testGetTopic_success() throws Exception {
    var topic = testTopic();
    when(googleDriveLambdaClient.getDocument(topic.getId(), TEXT_HTML))
        .thenReturn("<h1>HTML Representation of document</h1>");
    when(searchService.get(
            SearchGetCommand.builder().documentId(topic.getId()).index(SearchIndex.TOPIC).build(),
            Topic.class))
        .thenReturn(Optional.of(SearchResult.of(topic)));
    mockMvc
        .perform(get("/library/topic/{id}", topic.getId()))
        .andExpect(status().isOk())
        .andExpect(
            jsonPath("$.title", is("Best Practices for Maintaining Your Cap Table Post Financing")))
        .andExpect(
            jsonPath(
                "$.description",
                is("Describes the best practices for maintaining a capitalization table.")))
        .andExpect(jsonPath("$.category", is("Company Foundations")))
        .andExpect(jsonPath("$.links[0].rel", is("self")))
        .andExpect(jsonPath("$.links[0].href", is("http://localhost:8080/library/1")))
        .andExpect(jsonPath("$.links[1].rel", is("googleDocs")))
        .andExpect(jsonPath("$.links[1].href", is("https://example.com/document/d/1")))
        .andDo(
            document(
                "get",
                responseFields(
                    idField(),
                    titleField(),
                    descriptionField(),
                    categoryField(),
                    typeField(),
                    contentField(),
                    linksField()),
                links(selfLink(), googleDocsLink())));
  }

  @Test
  @WithRedesignUser(role = RoleAuthority.ROLE_RH_ADMIN)
  public void testGetTopic_handleMissing() throws Exception {
    var topic = testTopic();
    when(searchService.get(
            SearchGetCommand.builder().index(SearchIndex.TOPIC).documentId(topic.getId()).build(),
            Topic.class))
        .thenReturn(Optional.empty());
    mockMvc
        .perform(get("/library/topic/{id}", topic.getId()))
        .andExpect(status().isNotFound())
        .andExpect(
            (result) ->
                assertEquals("Topic does not exist.", result.getResolvedException().getMessage()));
  }

  @Test
  @WithRedesignUser(role = RoleAuthority.ROLE_RH_ADMIN)
  public void testGetLibraries_success() throws Exception {
    var pageable = PageRequest.of(0, 20, Sort.Direction.ASC, "displayName");
    when(libraryRepository.findAll(pageable))
        .thenReturn(new PageImpl<>(List.of(testLibrary()), pageable, 1));
    mockMvc
        .perform(get("/library?page=0&size=20&sort=displayName,asc"))
        .andExpect(status().isOk())
        .andDo(
            document(
                "query",
                queryParameters(pageQueryParameter(), sizeQueryParameter(), sortQueryParameter()),
                responseFields(
                        subsectionWithPath("content").description("List of libraries"),
                        linksField())
                    .andWithPrefix(
                        "content[].", DocUtils.idField(), displayNameField(), linksField())
                    .andWithPrefix("page.", pageFields())));
  }

  @Test
  @WithRedesignUser(role = RoleAuthority.ROLE_RH_ADMIN)
  public void testGetLibrary_success() throws Exception {
    var libraryData = testLibrary();
    when(libraryRepository.findByApiId(library.getApiId())).thenReturn(Optional.of(libraryData));
    mockMvc
        .perform(get("/library/{libraryId}", library.getApiId().value()))
        .andExpect(status().isOk())
        .andDo(document("library-id", responseFields(idField(), displayNameField(), linksField())));
  }

  @Test
  @WithRedesignUser(role = RoleAuthority.ROLE_RH_ADMIN)
  public void testGetLibrary_NotFound() throws Exception {
    when(libraryRepository.findByApiId(library.getApiId())).thenReturn(Optional.empty());
    mockMvc
        .perform(get("/library/{libraryId}", library.getApiId().value()))
        .andExpect(status().isNotFound());
  }

  @Test
  @WithRedesignUser(role = RoleAuthority.ROLE_RH_ADMIN)
  public void testCreateLibrary_success() throws Exception {
    mockMvc
        .perform(
            post("/library")
                .contentType(MediaType.APPLICATION_JSON)
                .content(
                    """
        {
          "displayName": "Developer Documentation"
        }
      """))
        .andExpect(status().isCreated())
        .andExpect(jsonPath("$.displayName", is("Developer Documentation")))
        .andDo(
            document(
                "create",
                requestFields(displayNameField()),
                responseFields(DocUtils.idField(), displayNameField(), linksField()),
                links(selfLink())));
  }

  @Test
  @WithRedesignUser(role = RoleAuthority.ROLE_RH_ADMIN)
  public void testCreateLibrary_displayNameRequired() throws Exception {
    mockMvc
        .perform(post("/library").contentType(MediaType.APPLICATION_JSON).content("{}"))
        .andExpect(status().isUnprocessableEntity())
        .andExpect(jsonPath("$.errors[0].name", is("displayName")))
        .andExpect(jsonPath("$.errors[0].description", is("must not be blank")));
  }

  @Test
  @WithRedesignUser(role = RoleAuthority.ROLE_OP_CO_USER)
  public void testGetContentByLibrary_LibraryNotFound() throws Exception {
    when(libraryRepository.existsByApiId(library.getApiId())).thenReturn(false);

    mockMvc
        .perform(get("/library/{libraryId}/content?page=0&size=20", library.getApiId().value()))
        .andExpect(status().isNotFound());
  }

  @Test
  @WithRedesignUser(role = RoleAuthority.ROLE_OP_CO_USER)
  public void testGetContentByLibrary_success() throws Exception {
    var content = testLibraryContent(TEST_PARENT_ID);
    when(libraryRepository.existsByApiId(library.getApiId())).thenReturn(true);
    when(contentRepository.findByApiId(ContentRef.of(TEST_LIBRARY_CONTENT_ID)))
        .thenReturn(Optional.of(content));
    when(searchService.search(
            SearchCommand.builder()
                .query("text")
                .searchFilters(List.of("type,ARTICLE", "libraryId," + library.getApiId().value()))
                .index(SearchIndex.CONTENT)
                .fields(LibraryContentService.FIELDS_TO_SEARCH)
                .build(),
            PageRequest.ofSize(20),
            LibraryContentSearchDoc.class))
        .thenReturn(
            new PageImpl<>(
                List.of(
                    SearchResult.of(
                        LibraryContentSearchDoc.builder()
                            .id(content.getApiId().value())
                            .build()))));
    when(contentRepository.findByApiIdIn(List.of(content.getApiId()))).thenReturn(Set.of(content));

    mockMvc
        .perform(
            get(
                "/library/{libraryId}/content?page=0&size=20&q=text&filter=type,ARTICLE&expand=children&expand=descendants&expand=ancestors",
                library.getApiId().value()))
        .andExpect(status().isOk())
        .andDo(
            document(
                "query-content",
                queryParameters(
                    pageQueryParameter(),
                    qQueryParameter(),
                    sizeQueryParameter(),
                    filterQueryParameter(),
                    expandQueryParameter(
                        Expansion.CHILDREN, Expansion.DESCENDANTS, Expansion.ANCESTORS)),
                responseFields(linksField())
                    .andWithPrefix("page.", pageFields())
                    .andWithPrefix(
                        "content[].",
                        idField(),
                        titleField(),
                        descriptionField(),
                        typeField(),
                        remoteContentIdField(),
                        remoteContentSourceField(),
                        parentIdField(),
                        DocUtils.orderIdField(),
                        DocUtils.childrenField(),
                        DocUtils.descendantsField(),
                        DocUtils.ancestorsField(),
                        linksField().ignored())));
  }

  private FieldDescriptor idField() {
    return fieldWithPath("id").description("Google Drive Id");
  }

  private LinkDescriptor googleDocsLink() {
    return linkWithRel("googleDocs")
        .description("For testing purposes only. View the Google Doc powering the Topic.");
  }

  private ParameterDescriptor filterQueryParameter() {
    return parameterWithName("filter")
        .description("Format: `?filter=fieldName,value`. Filter results based on a field/value.");
  }

  private ParameterDescriptor qQueryParameter() {
    return parameterWithName("q").description("Full-text search across all fields");
  }

  private FieldDescriptor typeField() {
    var supportedTypes =
        Arrays.stream(TopicType.values()).map(t -> "`" + t + "`").collect(Collectors.joining(", "));
    return subsectionWithPath("type")
        .description(String.format("Topic type. Currently supports: %s", supportedTypes));
  }

  private FieldDescriptor categoryField() {
    return fieldWithPath("category").description("Grouping topic belongs to");
  }

  private FieldDescriptor descriptionField() {
    return fieldWithPath("description").description("Summary of topic");
  }

  private FieldDescriptor titleField() {
    return fieldWithPath("title").description("Title of topic");
  }

  private FieldDescriptor contentField() {
    return fieldWithPath("content").description("Text or HTML representation of document");
  }

  private FieldDescriptor displayNameField() {
    return fieldWithPath("displayName").description("Name of library");
  }
}
