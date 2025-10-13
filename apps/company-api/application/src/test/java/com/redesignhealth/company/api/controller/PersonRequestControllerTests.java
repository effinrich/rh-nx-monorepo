package com.redesignhealth.company.api.controller;

import static org.hamcrest.Matchers.is;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.AdditionalAnswers.returnsFirstArg;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.redesignhealth.company.api.assembler.PersonRequestAssembler;
import com.redesignhealth.company.api.assembler.jira.JiraLinkGenerator;
import com.redesignhealth.company.api.client.jira.JiraClient;
import com.redesignhealth.company.api.dto.command.PersonRequestCommand;
import com.redesignhealth.company.api.entity.Company;
import com.redesignhealth.company.api.entity.PersonRequest;
import com.redesignhealth.company.api.entity.ref.CompanyRef;
import com.redesignhealth.company.api.entity.request.RoleAuthority;
import com.redesignhealth.company.api.exception.InvalidFieldException;
import com.redesignhealth.company.api.property.JiraRequestProperties;
import com.redesignhealth.company.api.property.JiraRequestProperties.User;
import com.redesignhealth.company.api.repository.CompanyRepository;
import com.redesignhealth.company.api.repository.PersonRequestRepository;
import com.redesignhealth.company.api.scaffolding.CommonTestConfig;
import com.redesignhealth.company.api.scaffolding.WithRedesignUser;
import com.redesignhealth.company.api.service.PersonRequestService;
import com.redesignhealth.jira.rest.client.model.CreatedIssue;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import reactor.core.publisher.Mono;

@WebMvcTest(PersonRequestController.class)
@Import({CommonTestConfig.class})
public class PersonRequestControllerTests {
  @Autowired private MockMvc mockMvc;
  @Autowired private ObjectMapper mapper;
  @MockBean private JiraClient jiraClient;
  @MockBean private JiraRequestProperties jiraRequestProperties;
  @MockBean private CompanyRepository companyRepository;
  @MockBean private PersonRequestRepository personRequestRepository;

  @TestConfiguration
  static class TestConfig {
    @Bean
    public PersonRequestAssembler personRequestSummaryAssembler(
        JiraLinkGenerator jiraLinkGenerator) {
      return new PersonRequestAssembler(jiraLinkGenerator);
    }

    @Bean
    public PersonRequestService personRequestService(
        JiraClient jiraClient,
        JiraRequestProperties jiraRequestProperties,
        CompanyRepository companyRepository,
        PersonRequestRepository personRequestRepository) {
      return new PersonRequestService(
          jiraClient, jiraRequestProperties, companyRepository, personRequestRepository);
    }
  }

  @Test
  public void test401() throws Exception {
    mockMvc.perform(post("/person-request")).andExpect(status().isUnauthorized());
  }

  @Test
  @WithRedesignUser(role = RoleAuthority.ROLE_RH_ADMIN)
  public void testRequestPerson_handlesUnknownCompany() throws Exception {
    var companiesRequested = List.of("unknown-company", "ever-body");
    var command =
        PersonRequestCommand.builder("test@redesignhealth.com")
            .companies(companiesRequested)
            .build();

    when(companyRepository.findAllByApiIdIn(
            companiesRequested.stream().map(CompanyRef::of).collect(Collectors.toSet())))
        .thenReturn(Set.of(Company.from(CompanyRef.of("ever-body"))));

    mockMvc
        .perform(
            post("/person-request")
                .contentType(MediaType.APPLICATION_JSON)
                .content(mapper.writeValueAsBytes(command)))
        .andExpect(status().isUnprocessableEntity())
        .andExpect(
            result ->
                assertEquals(InvalidFieldException.class, result.getResolvedException().getClass()))
        .andExpect(
            result ->
                assertEquals("Invalid field values", result.getResolvedException().getMessage()));
  }

  @Test
  @WithRedesignUser(role = RoleAuthority.ROLE_RH_ADMIN)
  public void testRequestPerson_success() throws Exception {
    var companiesRequested = List.of("ever-body");
    var rolesRequested = List.of(RoleAuthority.ROLE_RH_ADMIN);
    var command =
        PersonRequestCommand.builder("test@redesignhealth.com")
            .companies(companiesRequested)
            .roles(rolesRequested)
            .build();

    when(companyRepository.findAllByApiIdIn(
            companiesRequested.stream().map(CompanyRef::of).collect(Collectors.toSet())))
        .thenReturn(Set.of(Company.from(CompanyRef.of("ever-body"))));
    when(jiraRequestProperties.getUser())
        .thenReturn(new User("12345", new JiraRequestProperties.Issue("1234", Map.of())));
    var createdIssueMock = Mockito.mock(CreatedIssue.class);
    when(createdIssueMock.getKey()).thenReturn("TICKET-1");
    when(jiraClient.createIssue(any())).thenReturn(Mono.just(createdIssueMock));
    when(personRequestRepository.save(any(PersonRequest.class))).then(returnsFirstArg());
    mockMvc
        .perform(
            post("/person-request")
                .contentType(MediaType.APPLICATION_JSON)
                .content(mapper.writeValueAsBytes(command)))
        .andExpect(status().isCreated())
        .andExpect(jsonPath("$.links[0].rel", is("jiraTicket")))
        .andExpect(
            jsonPath(
                "$.links[0].href", is("https://redesignhealth.atlassian.net/browse/TICKET-1")));
  }
}
