package com.redesignhealth.company.api.controller;

import static com.redesignhealth.company.api.scaffolding.DocUtils.expandQueryParameter;
import static com.redesignhealth.company.api.scaffolding.DocUtils.getPossibleValues;
import static com.redesignhealth.company.api.scaffolding.DocUtils.linksField;
import static com.redesignhealth.company.api.scaffolding.DocUtils.orderIdField;
import static com.redesignhealth.company.api.scaffolding.DocUtils.pageFields;
import static com.redesignhealth.company.api.scaffolding.DocUtils.pageQueryParameter;
import static com.redesignhealth.company.api.scaffolding.DocUtils.parentIdField;
import static com.redesignhealth.company.api.scaffolding.DocUtils.remoteContentIdField;
import static com.redesignhealth.company.api.scaffolding.DocUtils.remoteContentSourceField;
import static com.redesignhealth.company.api.scaffolding.DocUtils.selfLink;
import static com.redesignhealth.company.api.scaffolding.DocUtils.sizeQueryParameter;
import static com.redesignhealth.company.api.scaffolding.Fixtures.TEST_ID;
import static com.redesignhealth.company.api.scaffolding.Fixtures.TEST_LIBRARY_CONTENT_ID;
import static com.redesignhealth.company.api.scaffolding.Fixtures.testLibrary;
import static com.redesignhealth.company.api.scaffolding.Fixtures.testLibraryContent;
import static com.redesignhealth.company.api.scaffolding.Fixtures.testPersonRef;
import static org.hamcrest.Matchers.is;
import static org.mockito.AdditionalAnswers.returnsFirstArg;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.restdocs.hypermedia.HypermediaDocumentation.linkWithRel;
import static org.springframework.restdocs.hypermedia.HypermediaDocumentation.links;
import static org.springframework.restdocs.mockmvc.MockMvcRestDocumentation.document;
import static org.springframework.restdocs.mockmvc.RestDocumentationRequestBuilders.post;
import static org.springframework.restdocs.payload.PayloadDocumentation.fieldWithPath;
import static org.springframework.restdocs.payload.PayloadDocumentation.requestFields;
import static org.springframework.restdocs.payload.PayloadDocumentation.responseFields;
import static org.springframework.restdocs.payload.PayloadDocumentation.subsectionWithPath;
import static org.springframework.restdocs.request.RequestDocumentation.parameterWithName;
import static org.springframework.restdocs.request.RequestDocumentation.queryParameters;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.redesignhealth.company.api.assembler.LibraryContentAssembler;
import com.redesignhealth.company.api.assembler.google.GoogleDocsLinkGenerator;
import com.redesignhealth.company.api.client.email.EmailSender;
import com.redesignhealth.company.api.client.file.GoogleDriveClient;
import com.redesignhealth.company.api.client.file.GoogleDriveLambdaClient;
import com.redesignhealth.company.api.client.file.MkDocsLambdaClient;
import com.redesignhealth.company.api.client.file.RemoteFileClient;
import com.redesignhealth.company.api.client.search.SearchClient;
import com.redesignhealth.company.api.client.search.command.SearchCommand;
import com.redesignhealth.company.api.client.search.command.SearchIndex;
import com.redesignhealth.company.api.client.search.entity.LibraryContentSearchDoc;
import com.redesignhealth.company.api.client.search.entity.SearchResult;
import com.redesignhealth.company.api.dto.enums.LibraryContentType;
import com.redesignhealth.company.api.dto.enums.RemoteContentSource;
import com.redesignhealth.company.api.entity.library.LibraryContent;
import com.redesignhealth.company.api.entity.ref.ContentRef;
import com.redesignhealth.company.api.entity.ref.LibraryRef;
import com.redesignhealth.company.api.entity.request.RoleAuthority;
import com.redesignhealth.company.api.expansion.Expansion;
import com.redesignhealth.company.api.repository.ContentRepository;
import com.redesignhealth.company.api.repository.LibraryRepository;
import com.redesignhealth.company.api.scaffolding.CommonTestConfig;
import com.redesignhealth.company.api.scaffolding.DocUtils;
import com.redesignhealth.company.api.scaffolding.WithRedesignUser;
import com.redesignhealth.company.api.service.LibraryContentService;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import org.junit.jupiter.api.BeforeEach;
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
import org.springframework.http.MediaType;
import org.springframework.restdocs.hypermedia.LinkDescriptor;
import org.springframework.restdocs.payload.FieldDescriptor;
import org.springframework.restdocs.request.ParameterDescriptor;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.util.MimeTypeUtils;

@WebMvcTest(LibraryContentController.class)
@Import({CommonTestConfig.class})
@AutoConfigureRestDocs("target/generated-snippets/library-content")
public class LibraryContentControllerTests {
  @Autowired private MockMvc mockMvc;

  @MockBean private SearchClient searchService;

  @MockBean private ContentRepository contentRepository;
  @MockBean private LibraryRepository libraryRepository;

  @MockBean private GoogleDriveClient googleDriveClient;
  @MockBean private GoogleDriveLambdaClient googleDriveLambdaClient;
  @MockBean private MkDocsLambdaClient mkDocsLambdaClient;

  @MockBean private EmailSender emailSender;

  private static final ContentRef TEST_PARENT_ID = ContentRef.of("m4asd123");

  @TestConfiguration
  static class TestConfig {
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

    @Bean
    public LibraryContentAssembler topicAssembler() {
      return new LibraryContentAssembler(new GoogleDocsLinkGenerator("https://example.com"));
    }
  }

  @BeforeEach
  public void setup() {
    when(contentRepository.save(any())).then(returnsFirstArg());
  }

  @Test
  @WithRedesignUser(role = RoleAuthority.ROLE_RH_ADMIN)
  public void testCreateContent_verifyParentExists() throws Exception {
    var content = testLibraryContent(TEST_PARENT_ID);
    when(contentRepository.findByApiId(TEST_PARENT_ID)).thenReturn(Optional.empty());

    mockMvc
        .perform(
            post("/library-content")
                .content(
                    """
      {
        "title": "New Title",
        "type": "ARTICLE",
        "parentId": "%s"
      }
      """
                        .formatted(TEST_PARENT_ID))
                .contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isUnprocessableEntity())
        .andExpect(jsonPath("$.message", is("Invalid field values")))
        .andExpect(jsonPath("$.errors[0].name", is("parentId")))
        .andExpect(jsonPath("$.errors[0].rejectedValue", is(TEST_PARENT_ID.value())))
        .andExpect(jsonPath("$.errors[0].description", is("must exist")));
  }

  @Test
  @WithRedesignUser(role = RoleAuthority.ROLE_RH_ADMIN)
  public void testCreateContent_success() throws Exception {
    var content = testLibraryContent(TEST_PARENT_ID);
    when(contentRepository.findByApiId(TEST_PARENT_ID))
        .thenReturn(Optional.of(LibraryContent.from(TEST_PARENT_ID)));
    when(contentRepository.save(any())).then(returnsFirstArg());
    when(libraryRepository.findByApiId(LibraryRef.of(TEST_ID)))
        .thenReturn(Optional.of(testLibrary()));

    mockMvc
        .perform(
            post("/library-content")
                .content(
                    """
        {
          "title": "Best Practices for Maintaining Your Cap Table Post Financing",
          "description": "Describes the best practices for maintaining a capitalization table.",
          "type": "ARTICLE",
          "remoteContentSource": "GOOGLE_DRIVE",
          "remoteContentId": "REDACTED",
          "parentId": "%s",
          "libraryId": "%s",
          "orderId": 100
        }
        """
                        .formatted(TEST_PARENT_ID, TEST_ID))
                .contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isCreated())
        .andDo(
            document(
                "create",
                requestFields(
                    titleField(),
                    descriptionField(),
                    typeField(),
                    remoteContentIdField(),
                    remoteContentSourceField(),
                    parentIdField(),
                    libraryIdField(),
                    orderIdField()),
                responseFields(
                    idField(),
                    titleField(),
                    descriptionField(),
                    typeField(),
                    remoteContentIdField(),
                    remoteContentSourceField(),
                    parentIdField(),
                    linksField(),
                    orderIdField()),
                links(selfLink(), googleDocsLink())));
  }

  @Test
  @WithRedesignUser(role = RoleAuthority.ROLE_RH_ADMIN)
  public void testUpdateContent_notFound() throws Exception {
    var content = testLibraryContent(null);
    when(contentRepository.findByApiId(content.getApiId())).thenReturn(Optional.empty());

    mockMvc
        .perform(
            put("/library-content/{id}", content.getApiId())
                .content(
                    """
        {
          "title": "New Title",
          "type": "ARTICLE"
        }
        """)
                .contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isNotFound());
  }

  @Test
  @WithRedesignUser(role = RoleAuthority.ROLE_RH_ADMIN)
  public void testUpdateContent_parentCannotReferenceSelf() throws Exception {
    var content = testLibraryContent(null);
    when(contentRepository.findByApiId(content.getApiId())).thenReturn(Optional.of(content));
    mockMvc
        .perform(
            put("/library-content/{id}", content.getApiId())
                .content(
                    """
        {
          "title": "New Title",
          "type": "ARTICLE",
          "parentId": "%s"
        }
        """
                        .formatted(content.getApiId()))
                .contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isUnprocessableEntity())
        .andExpect(jsonPath("$.message", is("Invalid field values")))
        .andExpect(jsonPath("$.errors[0].name", is("parentId")))
        .andExpect(jsonPath("$.errors[0].rejectedValue", is(TEST_LIBRARY_CONTENT_ID)))
        .andExpect(jsonPath("$.errors[0].description", is("must not reference itself")));
  }

  @Test
  @WithRedesignUser(role = RoleAuthority.ROLE_RH_ADMIN)
  public void testUpdateContent_success() throws Exception {
    var content = testLibraryContent(null);
    when(contentRepository.findByApiId(content.getApiId())).thenReturn(Optional.of(content));
    when(contentRepository.findByApiId(TEST_PARENT_ID))
        .thenReturn(Optional.of(LibraryContent.from(TEST_PARENT_ID)));
    when(libraryRepository.findByApiId(LibraryRef.of(TEST_ID)))
        .thenReturn(Optional.of(testLibrary()));
    mockMvc
        .perform(
            put("/library-content/{id}", content.getApiId())
                .content(
                    """
        {
          "title": "Best Practices for Maintaining Your Cap Table Post Financing",
          "description": "Describes the best practices for maintaining a capitalization table.",
          "type": "ARTICLE",
          "remoteContentSource": "GOOGLE_DRIVE",
          "remoteContentId": "REDACTED",
          "parentId": "%s",
          "libraryId": "%s",
          "orderId": 200
        }
        """
                        .formatted(TEST_PARENT_ID, TEST_ID))
                .contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isOk())
        .andDo(
            document(
                "update",
                requestFields(
                    titleField(),
                    descriptionField(),
                    typeField(),
                    remoteContentIdField(),
                    remoteContentSourceField(),
                    parentIdField(),
                    libraryIdField(),
                    orderIdField()),
                responseFields(
                    idField(),
                    titleField(),
                    descriptionField(),
                    typeField(),
                    remoteContentIdField(),
                    remoteContentSourceField(),
                    parentIdField(),
                    linksField(),
                    orderIdField()),
                links(selfLink(), googleDocsLink())));
  }

  @Test
  @WithRedesignUser(role = RoleAuthority.ROLE_RH_ADMIN)
  public void testGetContent_notFound() throws Exception {
    when(contentRepository.findByApiId(ContentRef.of(TEST_LIBRARY_CONTENT_ID)))
        .thenReturn(Optional.empty());
    mockMvc
        .perform(get("/library-content/{id}", TEST_LIBRARY_CONTENT_ID))
        .andExpect(status().isNotFound());
  }

  @Test
  @WithRedesignUser(role = RoleAuthority.ROLE_RH_ADMIN)
  public void testGetContent_success() throws Exception {
    var content = testLibraryContent(TEST_PARENT_ID);
    when(contentRepository.findByApiId(ContentRef.of(TEST_LIBRARY_CONTENT_ID)))
        .thenReturn(Optional.of(content));
    when(googleDriveLambdaClient.getDocument(content.getRemoteContentId(), MimeTypeUtils.TEXT_HTML))
        .thenReturn("<h1>Content</h1>");
    mockMvc
        .perform(
            get(
                "/library-content/{id}?expand=children&expand=descendants&expand=ancestors",
                TEST_LIBRARY_CONTENT_ID))
        .andExpect(status().isOk())
        .andDo(
            document(
                "get",
                queryParameters(
                    expandQueryParameter(
                        Expansion.CHILDREN, Expansion.DESCENDANTS, Expansion.ANCESTORS)),
                responseFields(
                    idField(),
                    titleField(),
                    descriptionField(),
                    typeField(),
                    contentField(),
                    remoteContentSourceField(),
                    remoteContentIdField(),
                    parentIdField(),
                    DocUtils.childrenField(),
                    DocUtils.descendantsField(),
                    DocUtils.ancestorsField(),
                    linksField(),
                    orderIdField()),
                links(selfLink(), googleDocsLink())));
  }

  @Test
  @WithRedesignUser(role = RoleAuthority.ROLE_RH_ADMIN)
  public void testQueryContent_success() throws Exception {
    var content = testLibraryContent(TEST_PARENT_ID);
    when(contentRepository.findByApiId(ContentRef.of(TEST_LIBRARY_CONTENT_ID)))
        .thenReturn(Optional.of(content));
    when(searchService.search(
            SearchCommand.builder()
                .query("text")
                .searchFilters(List.of("type,ARTICLE"))
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
                "/library-content?page=0&size=20&q=text&filter=type,ARTICLE&expand=children&expand=descendants&expand=ancestors"))
        .andExpect(status().isOk())
        .andDo(
            document(
                "query",
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
                        DocUtils.childrenField(),
                        DocUtils.descendantsField(),
                        DocUtils.ancestorsField(),
                        linksField().ignored(),
                        orderIdField().ignored())));
  }

  @Test
  @WithRedesignUser(role = RoleAuthority.ROLE_RH_ADMIN)
  public void testAppendChild_success() throws Exception {
    var content = testLibraryContent(null);
    when(contentRepository.findByApiId(TEST_PARENT_ID))
        .thenReturn(Optional.of(LibraryContent.from(TEST_PARENT_ID)));
    when(contentRepository.findByApiId(ContentRef.of(TEST_LIBRARY_CONTENT_ID)))
        .thenReturn(Optional.of(content));

    mockMvc
        .perform(
            put("/library-content/{id}/child/{childId}", TEST_PARENT_ID, TEST_LIBRARY_CONTENT_ID))
        .andExpect(status().isNoContent())
        .andDo(document("append-child"));
  }

  @Test
  @WithRedesignUser(role = RoleAuthority.ROLE_RH_ADMIN)
  public void testDelete_success() throws Exception {
    var content = testLibraryContent(null);
    when(contentRepository.findByApiId(TEST_PARENT_ID))
        .thenReturn(Optional.of(LibraryContent.from(TEST_PARENT_ID)));
    when(contentRepository.findByApiId(ContentRef.of(TEST_LIBRARY_CONTENT_ID)))
        .thenReturn(Optional.of(content));

    mockMvc
        .perform(delete("/library-content/{id}", TEST_PARENT_ID))
        .andExpect(status().isNoContent())
        .andDo(document("delete"));
  }

  private static FieldDescriptor idField() {
    return fieldWithPath("id").description("Google Drive Id");
  }

  private static LinkDescriptor googleDocsLink() {
    return linkWithRel("googleDocs")
        .description("For testing purposes only. View the Google Doc powering the Topic.");
  }

  private static ParameterDescriptor filterQueryParameter() {
    return parameterWithName("filter")
        .description("Format: `?filter=fieldName,value`. Filter results based on a field/value.");
  }

  private static ParameterDescriptor qQueryParameter() {
    return parameterWithName("q").description("Full-text search across all fields");
  }

  private static FieldDescriptor typeField() {
    return subsectionWithPath("type")
        .description(
            String.format("Topic type. %s", getPossibleValues(LibraryContentType.values())));
  }

  private static FieldDescriptor descriptionField() {
    return fieldWithPath("description").description("Summary of topic");
  }

  private static FieldDescriptor titleField() {
    return fieldWithPath("title").description("Title of topic");
  }

  private static FieldDescriptor contentField() {
    return fieldWithPath("content").description("Text or HTML representation of document");
  }

  private static FieldDescriptor libraryIdField() {
    return fieldWithPath("libraryId").description("Library content belongs to");
  }
}
