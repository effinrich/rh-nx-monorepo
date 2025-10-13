package com.redesignhealth.company.api.controller;

import static com.redesignhealth.company.api.entity.FormDefinition.Type.*;
import static com.redesignhealth.company.api.entity.request.RoleAuthority.*;
import static com.redesignhealth.company.api.entity.request.RoleAuthority.ROLE_RH_ADMIN;
import static com.redesignhealth.company.api.expansion.Expansion.FORMS;
import static com.redesignhealth.company.api.scaffolding.DocUtils.*;
import static com.redesignhealth.company.api.scaffolding.Fixtures.*;
import static org.hamcrest.Matchers.*;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.Mockito.when;
import static org.springframework.restdocs.hypermedia.HypermediaDocumentation.linkWithRel;
import static org.springframework.restdocs.hypermedia.HypermediaDocumentation.links;
import static org.springframework.restdocs.mockmvc.MockMvcRestDocumentation.document;
import static org.springframework.restdocs.payload.PayloadDocumentation.*;
import static org.springframework.restdocs.request.RequestDocumentation.queryParameters;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.redesignhealth.company.api.assembler.InfraRequestAssembler;
import com.redesignhealth.company.api.assembler.jira.JiraLinkGenerator;
import com.redesignhealth.company.api.client.jira.JiraClient;
import com.redesignhealth.company.api.entity.request.*;
import com.redesignhealth.company.api.exception.InfraRequestAlreadySubmittedException;
import com.redesignhealth.company.api.exception.RequiredFormsMissingException;
import com.redesignhealth.company.api.exception.UnknownCompanyException;
import com.redesignhealth.company.api.property.JiraRequestProperties;
import com.redesignhealth.company.api.repository.CompanyRepository;
import com.redesignhealth.company.api.repository.FormDefinitionRepository;
import com.redesignhealth.company.api.repository.InfraRequestRepository;
import com.redesignhealth.company.api.repository.RequestFormRepository;
import com.redesignhealth.company.api.scaffolding.CommonTestConfig;
import com.redesignhealth.company.api.scaffolding.WithRedesignUser;
import com.redesignhealth.company.api.service.InfraRequestService;
import com.redesignhealth.company.api.template.TemplateGenerator;
import com.redesignhealth.jira.rest.client.model.CreatedIssue;
import java.util.List;
import java.util.Map;
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
import org.springframework.http.MediaType;
import org.springframework.restdocs.hypermedia.LinkDescriptor;
import org.springframework.restdocs.payload.FieldDescriptor;
import org.springframework.test.web.servlet.MockMvc;
import reactor.core.publisher.Mono;

@WebMvcTest(InfraRequestController.class)
@Import({CommonTestConfig.class})
@AutoConfigureRestDocs("target/generated-snippets/infrastructure-request")
public class InfraRequestControllerTests {
  @Autowired private MockMvc mockMvc;
  @Autowired private ObjectMapper mapper;
  @MockBean private InfraRequestRepository infraRequestRepository;
  @MockBean private RequestFormRepository requestFormRepository;
  @MockBean private JiraClient jiraClient;
  @MockBean private JiraRequestProperties jiraRequestProperties;
  @MockBean private CompanyRepository companyRepository;
  @MockBean private TemplateGenerator templateGenerator;

  @MockBean private FormDefinitionRepository formDefinitionRepository;

  @TestConfiguration
  static class TestConfig {
    @Bean
    public InfraRequestAssembler infraRequestSummaryAssembler(JiraLinkGenerator jiraLinkGenerator) {
      return new InfraRequestAssembler(jiraLinkGenerator);
    }

    @Bean
    public InfraRequestService infraRequestService(
        InfraRequestRepository infraRequestRepository,
        RequestFormRepository requestFormRepository,
        CompanyRepository companyRepository,
        JiraClient jiraClient,
        JiraRequestProperties jiraRequestProperties,
        TemplateGenerator templateGenerator,
        FormDefinitionRepository formDefinitionRepository) {
      return new InfraRequestService(
          infraRequestRepository,
          requestFormRepository,
          companyRepository,
          jiraClient,
          jiraRequestProperties,
          templateGenerator,
          "https://host/endpoint/{companyId}/id",
          1,
          formDefinitionRepository);
    }
  }

  @Test
  public void test401() throws Exception {
    mockMvc.perform(get("/infra-request")).andExpect(status().isUnauthorized());
  }

  @Test
  @WithRedesignUser(role = ROLE_RH_ADMIN)
  public void testGetRequest_404() throws Exception {
    mockMvc
        .perform(get("/infra-request/{companyId}", testCompanyRef()))
        .andExpect(status().isNotFound());
  }

  @Test
  @WithRedesignUser(role = ROLE_OP_CO_CONTRACTOR, memberOf = TEST_COMPANY_ID)
  public void testGetRequest_returnsRequest() throws Exception {
    var company = testCompany();
    var infraRequest =
        InfrastructureRequest.builder(company)
            .status(RequestStatus.PENDING)
            .jiraIssueId("TEST-1")
            .build();
    infraRequest.setForms(Set.of(testRequestForm(PRIVACY_QUESTIONNAIRE)));
    when(infraRequestRepository.findByCompanyApiId(testCompanyRef(), FORMS))
        .thenReturn(Optional.of(infraRequest));

    mockMvc
        .perform(get("/infra-request/{companyId}?expand=forms", company.getApiId()))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.jiraIssueId", is("TEST-1")))
        .andExpect(jsonPath("$.status.value", is("PENDING")))
        .andExpect(jsonPath("$.status.displayName", is("Pending")))
        .andExpect(jsonPath("$.links", hasSize(2)))
        .andExpect(jsonPath("$.links[1].rel", is("jiraTicket")))
        .andExpect(
            jsonPath("$.links[1].href", is("https://redesignhealth.atlassian.net/browse/TEST-1")))
        .andDo(
            document(
                "get",
                queryParameters(expandQueryParameter(FORMS)),
                responseFields(jiraIssueIdField(), statusField(), formsField(), linksField()),
                links(selfLink(), jiraTicketLink())));
  }

  @Test
  @WithRedesignUser(role = ROLE_OP_CO_CONTRACTOR, memberOf = TEST_COMPANY_ID)
  public void testGetRequest_omitsJiraTicketIfMissing() throws Exception {
    var company = testCompany();
    when(infraRequestRepository.findByCompanyApiId(company.getApiId()))
        .thenReturn(
            Optional.of(InfrastructureRequest.builder(testCompany()).jiraIssueId(null).build()));

    mockMvc
        .perform(get("/infra-request/{companyId}", company.getApiId()))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.links", hasSize(1)))
        .andExpect(jsonPath("$.links[0].rel", is("self")));
  }

  @Test
  @WithRedesignUser(role = ROLE_OP_CO_USER, memberOf = TEST_COMPANY_ID)
  public void testUpdateRequest_handlesUnknownCompany() throws Exception {
    mockMvc
        .perform(
            put("/infra-request/{companyId}", TEST_COMPANY_ID)
                .contentType(MediaType.APPLICATION_JSON)
                .content("{}"))
        .andExpect(status().isBadRequest())
        .andExpect(
            (result) ->
                assertTrue(result.getResolvedException() instanceof UnknownCompanyException));
  }

  @Test
  @WithRedesignUser(role = ROLE_OP_CO_USER, memberOf = TEST_COMPANY_ID)
  public void testUpdateRequest_handlesCreatingRequest() throws Exception {
    var company = testCompany();
    var infraRequest = InfrastructureRequest.builder(company).build();
    when(companyRepository.findByApiId(company.getApiId())).thenReturn(Optional.of(company));

    when(infraRequestRepository.save(infraRequest)).thenReturn(infraRequest);

    // prevents forms from showing up in response
    // this field is normally null due to lazy-load checking in hibernate
    infraRequest.setForms(null);
    mockMvc
        .perform(
            put("/infra-request/{companyId}", TEST_COMPANY_ID)
                .contentType(MediaType.APPLICATION_JSON)
                .content("{ \"status\": \"DONE\" }"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.status.value", is("DONE")))
        .andDo(
            document(
                "update",
                requestFields(statusField()),
                responseFields(statusField(), linksField()),
                links(selfLink())));
  }

  @Test
  @WithRedesignUser(role = ROLE_OP_CO_USER, memberOf = TEST_COMPANY_ID)
  public void testUpdateRequest_handlesExistingRequest() throws Exception {
    var company = testCompany();
    var infraRequest = InfrastructureRequest.builder(company).build();

    // InfraRequest already exists in DB
    when(infraRequestRepository.findByCompanyApiId(company.getApiId()))
        .thenReturn(Optional.of(infraRequest));

    mockMvc
        .perform(
            put("/infra-request/{companyId}", company.getApiId())
                .contentType(MediaType.APPLICATION_JSON)
                .content("{ \"status\": \"DONE\" }"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.status.value", is("DONE")));
  }

  @Test
  @WithRedesignUser(role = ROLE_OP_CO_USER, memberOf = TEST_COMPANY_ID)
  public void testUpdateRequestForm_handlesMissingForm() throws Exception {
    var company = testCompany();
    var infraRequest = InfrastructureRequest.builder(company).build();
    var requestForm = testRequestForm(TECH_STACK);
    infraRequest.setForms(Set.of(requestForm));
    when(infraRequestRepository.findByCompanyApiId(company.getApiId()))
        .thenReturn(Optional.of(infraRequest));
    when(formDefinitionRepository.findByType(TECH_STACK))
        .thenReturn(Optional.of(testFormDefinition(TECH_STACK)));
    when(requestFormRepository.save(requestForm)).thenReturn(requestForm);

    mockMvc
        .perform(
            put("/infra-request/{companyId}/form/{type}", company.getApiId(), TECH_STACK)
                .contentType(MediaType.APPLICATION_JSON)
                .content(
                    """
                  { "form": { "firstName":  "Terra"}, "status": "DRAFT" }
                  """))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.type.value", is("TECH_STACK")))
        .andExpect(jsonPath("$.type.displayName", is("Tech Stack")))
        .andExpect(jsonPath("$.status.value", is("DRAFT")))
        .andExpect(jsonPath("$.status.displayName", is("Draft")))
        .andExpect(jsonPath("$.form", notNullValue()))
        .andDo(
            document(
                "update-form",
                requestFields(formField(), statusField()),
                responseFields(formField(), statusField(), typeField(), linksField())));
  }

  @Test
  @WithRedesignUser(role = ROLE_OP_CO_USER, memberOf = TEST_COMPANY_ID)
  public void testUpdateRequestForm_handlesUnknownForm() throws Exception {
    var company = testCompany();
    var infraRequest = InfrastructureRequest.builder(company).build();
    var requestForm = RequestForm.builder(infraRequest, TECH_STACK).build();

    when(infraRequestRepository.findByCompanyApiId(company.getApiId()))
        .thenReturn(Optional.of(infraRequest));
    when(formDefinitionRepository.findByType(TECH_STACK)).thenReturn(Optional.empty());
    when(requestFormRepository.save(requestForm)).thenReturn(requestForm);

    mockMvc
        .perform(
            put("/infra-request/{companyId}/form/{type}", company.getApiId(), TECH_STACK)
                .contentType(MediaType.APPLICATION_JSON)
                .content("{ \"form\": {} }"))
        .andExpect(status().isBadRequest())
        .andExpect(
            (result) ->
                assertEquals(
                    "Form definition does not exist for TECH_STACK. Please create one before submitting a form.",
                    result.getResolvedException().getMessage()));
  }

  @Test
  @WithRedesignUser(role = ROLE_OP_CO_USER, memberOf = TEST_COMPANY_ID)
  public void testUpdateRequestForm_handlesExistingForm() throws Exception {
    var company = testCompany();
    var infraRequest = InfrastructureRequest.builder(company).build();
    var requestForm = RequestForm.builder(infraRequest, TECH_STACK).build();

    when(infraRequestRepository.findByCompanyApiId(company.getApiId()))
        .thenReturn(Optional.of(infraRequest));
    when(formDefinitionRepository.findByType(TECH_STACK))
        .thenReturn(Optional.of(testFormDefinition(TECH_STACK)));
    // RequestForm already exists in DB
    when(requestFormRepository.findByInfrastructureRequestAndType(infraRequest, TECH_STACK))
        .thenReturn(Optional.of(requestForm));

    when(requestFormRepository.save(requestForm)).thenReturn(requestForm);

    mockMvc
        .perform(
            put("/infra-request/{companyId}/form/{type}", company.getApiId(), TECH_STACK)
                .contentType(MediaType.APPLICATION_JSON)
                .content("{ \"form\": {} }"))
        .andExpect(status().isOk());
  }

  @Test
  @WithRedesignUser(role = ROLE_OP_CO_USER, memberOf = TEST_COMPANY_ID)
  public void testSubmitRequest_missingForms() throws Exception {
    var company = testCompany();
    var infraRequest = InfrastructureRequest.builder(company).build();
    when(infraRequestRepository.findByCompanyApiId(company.getApiId(), FORMS))
        .thenReturn(Optional.of(infraRequest));

    mockMvc
        .perform(post("/infra-request/{companyId}/submit", company.getApiId()))
        .andExpect(status().isBadRequest())
        .andExpect(
            (result) ->
                assertEquals(
                    RequiredFormsMissingException.class, result.getResolvedException().getClass()));
  }

  @Test
  @WithRedesignUser(role = ROLE_OP_CO_USER, memberOf = TEST_COMPANY_ID)
  public void testSubmitRequest_missingCompletedForm() throws Exception {
    var company = testCompany();
    var infraRequest = InfrastructureRequest.builder(company).build();

    var techStackForm =
        RequestForm.builder(infraRequest, TECH_STACK)
            .status(PublicationStatus.COMPLETED)
            .form(mapper.createObjectNode())
            .build();
    var privacyQuestionnaire =
        RequestForm.builder(infraRequest, PRIVACY_QUESTIONNAIRE)
            .status(PublicationStatus.DRAFT)
            .form(mapper.createObjectNode())
            .build();
    infraRequest.setForms(Set.of(techStackForm, privacyQuestionnaire));
    when(infraRequestRepository.findByCompanyApiId(company.getApiId(), FORMS))
        .thenReturn(Optional.of(infraRequest));
    mockMvc
        .perform(post("/infra-request/{companyId}/submit", company.getApiId()))
        .andExpect(status().isBadRequest())
        .andExpect(
            (result) ->
                assertEquals(
                    "Infrastructure request cannot be submitted until the following forms are completed: PRIVACY_QUESTIONNAIRE",
                    result.getResolvedException().getMessage()));
  }

  @Test
  @WithRedesignUser(role = ROLE_OP_CO_USER, memberOf = TEST_COMPANY_ID)
  public void testSubmitRequest_errorIfAlreadySubmitted() throws Exception {
    var company = testCompany();
    var infraRequest = InfrastructureRequest.builder(company).status(RequestStatus.PENDING).build();

    when(infraRequestRepository.findByCompanyApiId(company.getApiId(), FORMS))
        .thenReturn(Optional.of(infraRequest));

    mockMvc
        .perform(post("/infra-request/{companyId}/submit", company.getApiId()))
        .andExpect(status().isBadRequest())
        .andExpect(
            result ->
                assertEquals(
                    InfraRequestAlreadySubmittedException.class,
                    result.getResolvedException().getClass()));
  }

  @Test
  @WithRedesignUser(role = ROLE_OP_CO_USER, memberOf = TEST_COMPANY_ID)
  public void testSubmitRequest_success() throws Exception {
    var company = testCompany();
    var infraRequest = InfrastructureRequest.builder(company).build();
    var techStackForm =
        RequestForm.builder(infraRequest, TECH_STACK)
            .status(PublicationStatus.COMPLETED)
            .form(mapper.createObjectNode())
            .build();
    var privacyQuestionnaire =
        RequestForm.builder(infraRequest, PRIVACY_QUESTIONNAIRE)
            .status(PublicationStatus.COMPLETED)
            .form(mapper.createObjectNode())
            .build();
    infraRequest.setForms(Set.of(techStackForm, privacyQuestionnaire));

    mockProperties();
    when(infraRequestRepository.findByCompanyApiId(company.getApiId(), FORMS))
        .thenReturn(Optional.of(infraRequest));
    when(jiraClient.createIssue(any())).thenReturn(Mono.just(new CreatedIssue()));
    when(jiraClient.attachFilesToIssue(any(), any())).thenReturn(Mono.just(List.of()));
    when(infraRequestRepository.save(infraRequest)).thenReturn(infraRequest);
    when(templateGenerator.createTechStackAttachment(anyList())).thenReturn("GENERATED HTML");
    when(templateGenerator.createPrivacyAttachment(anyList())).thenReturn("GENERATED HTML");

    mockMvc
        .perform(post("/infra-request/{companyId}/submit", company.getApiId()))
        .andExpect(status().isOk())
        .andDo(
            document(
                "submit",
                responseFields(formsField(), statusField(), linksField()),
                links(selfLink())));
  }

  private static FieldDescriptor jiraIssueIdField() {
    return fieldWithPath("jiraIssueId")
        .description("Jira ticket for tracking infrastructure setup.");
  }

  private static FieldDescriptor statusField() {
    return subsectionWithPath("status").description("Current status of request.");
  }

  private static FieldDescriptor typeField() {
    return subsectionWithPath("type").description("A form definition identifier.");
  }

  private static FieldDescriptor formsField() {
    return subsectionWithPath("forms").description("Desired infrastructure information.");
  }

  private static FieldDescriptor formField() {
    return subsectionWithPath("form").description("Data submitted from the form.");
  }

  private static LinkDescriptor jiraTicketLink() {
    return linkWithRel("jiraTicket").description("Link to Jira ticket.");
  }

  private void mockProperties() {
    var issue = new JiraRequestProperties.Issue("1", Map.of());
    when(jiraRequestProperties.getInfrastructure())
        .thenReturn(new JiraRequestProperties.Infrastructure("1", issue, issue, Map.of()));
  }
}
