package com.redesignhealth.company.api.controller;

import static com.redesignhealth.company.api.entity.request.RoleAuthority.ROLE_OP_CO_CONTRACTOR;
import static com.redesignhealth.company.api.entity.request.RoleAuthority.ROLE_OP_CO_USER;
import static com.redesignhealth.company.api.entity.request.RoleAuthority.ROLE_RH_ADMIN;
import static com.redesignhealth.company.api.entity.request.RoleAuthority.ROLE_RH_USER;
import static com.redesignhealth.company.api.expansion.Expansion.MEMBER_OF;
import static com.redesignhealth.company.api.scaffolding.DocUtils.createdByField;
import static com.redesignhealth.company.api.scaffolding.DocUtils.createdField;
import static com.redesignhealth.company.api.scaffolding.DocUtils.expandQueryParameter;
import static com.redesignhealth.company.api.scaffolding.DocUtils.lastModifiedField;
import static com.redesignhealth.company.api.scaffolding.DocUtils.lastModifiedFieldBy;
import static com.redesignhealth.company.api.scaffolding.DocUtils.linksField;
import static com.redesignhealth.company.api.scaffolding.DocUtils.memberOfField;
import static com.redesignhealth.company.api.scaffolding.DocUtils.pageFields;
import static com.redesignhealth.company.api.scaffolding.DocUtils.pageQueryParameter;
import static com.redesignhealth.company.api.scaffolding.DocUtils.roleField;
import static com.redesignhealth.company.api.scaffolding.DocUtils.rolesField;
import static com.redesignhealth.company.api.scaffolding.DocUtils.selfLink;
import static com.redesignhealth.company.api.scaffolding.DocUtils.sizeQueryParameter;
import static com.redesignhealth.company.api.scaffolding.DocUtils.sortQueryParameter;
import static com.redesignhealth.company.api.scaffolding.DocUtils.statusesField;
import static com.redesignhealth.company.api.scaffolding.Fixtures.TEST_COMPANY_ID;
import static com.redesignhealth.company.api.scaffolding.Fixtures.testCompany;
import static com.redesignhealth.company.api.scaffolding.Fixtures.testCompanyRef;
import static com.redesignhealth.company.api.scaffolding.Fixtures.testPerson;
import static com.redesignhealth.company.api.scaffolding.Fixtures.testPersonRef;
import static org.hamcrest.Matchers.is;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.restdocs.hypermedia.HypermediaDocumentation.links;
import static org.springframework.restdocs.mockmvc.MockMvcRestDocumentation.document;
import static org.springframework.restdocs.payload.PayloadDocumentation.fieldWithPath;
import static org.springframework.restdocs.payload.PayloadDocumentation.requestFields;
import static org.springframework.restdocs.payload.PayloadDocumentation.responseFields;
import static org.springframework.restdocs.payload.PayloadDocumentation.subsectionWithPath;
import static org.springframework.restdocs.request.RequestDocumentation.queryParameters;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.redesignhealth.company.api.assembler.CompanyMemberAuditAssembler;
import com.redesignhealth.company.api.client.email.EmailSender;
import com.redesignhealth.company.api.dto.enums.CompanyMemberAuditOperation;
import com.redesignhealth.company.api.dto.enums.CompanyMemberStatus;
import com.redesignhealth.company.api.entity.CompanyMember;
import com.redesignhealth.company.api.entity.CompanyMemberAudit;
import com.redesignhealth.company.api.entity.ref.PersonRef;
import com.redesignhealth.company.api.exception.PersonNotFoundException;
import com.redesignhealth.company.api.exception.RoleNotFoundException;
import com.redesignhealth.company.api.expansion.Expansion;
import com.redesignhealth.company.api.repository.CompanyMemberAuditRepository;
import com.redesignhealth.company.api.repository.CompanyRepository;
import com.redesignhealth.company.api.repository.PersonRepository;
import com.redesignhealth.company.api.scaffolding.CommonTestConfig;
import com.redesignhealth.company.api.scaffolding.WithRedesignUser;
import com.redesignhealth.company.api.service.PersonService;
import java.net.URI;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import org.hibernate.exception.ConstraintViolationException;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.restdocs.AutoConfigureRestDocs;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.restdocs.payload.FieldDescriptor;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(PersonController.class)
@Import({CommonTestConfig.class})
@AutoConfigureRestDocs("target/generated-snippets/person")
public class PersonControllerTests {
  @Autowired private MockMvc mockMvc;
  @MockBean private PersonRepository personRepository;
  @MockBean private EmailSender emailSender;

  @MockBean private CompanyMemberAuditRepository companyMemberAuditRepository;

  @MockBean private CompanyRepository companyRepository;

  private final PersonRef personRef = testPersonRef();

  @TestConfiguration
  static class TestConfig {
    @Bean
    CompanyMemberAuditAssembler companyMemberAuditAssembler() {
      return new CompanyMemberAuditAssembler();
    }

    @Bean
    public PersonService personService(
        PersonRepository personRepository,
        EmailSender emailSender,
        CompanyMemberAuditRepository companyMemberAuditRepository) {
      return new PersonService(
          personRepository,
          emailSender,
          companyMemberAuditRepository,
          URI.create("https://example.com"),
          URI.create("Https://example.com"));
    }
  }

  @Test
  public void test401() throws Exception {
    mockMvc.perform(get("/person")).andExpect(status().isUnauthorized());
  }

  @Test
  @WithRedesignUser(role = ROLE_RH_USER)
  public void testList_returns() throws Exception {
    var person = testPerson(ROLE_RH_ADMIN);
    person.setMemberOf(
        Set.of(new CompanyMember(testCompany(), person, CompanyMemberStatus.ACTIVE)));
    when(personRepository.findAll(Mockito.any(Pageable.class), any()))
        .thenReturn(new PageImpl<>(List.of(person)));
    mockMvc
        .perform(get("/person?expand=memberOf&size=20&page=0&sort=created,desc"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.content[0].email", is("test@redesignhealth.com")))
        .andDo(
            document(
                "list",
                queryParameters(
                    expandQueryParameter(Expansion.MEMBERS),
                    sortQueryParameter(),
                    sizeQueryParameter(),
                    pageQueryParameter()),
                responseFields(
                        subsectionWithPath("content").description("List of people"), linksField())
                    .andWithPrefix(
                        "content[].",
                        emailField(),
                        givenNameField(),
                        familyNameField(),
                        memberOfField(),
                        rolesField(),
                        createdField(),
                        lastModifiedField(),
                        ceoInfoField(),
                        statusesField(),
                        linksField().ignored())
                    .andWithPrefix("page.", pageFields())));
  }

  @Test
  @WithRedesignUser(role = ROLE_RH_ADMIN)
  public void testGetOne_returns404ForUnknown() throws Exception {
    mockMvc
        .perform(get("/person/{email}", "unknown@redesignhealth.com"))
        .andExpect(status().isNotFound())
        .andExpect(
            (result) ->
                assertTrue(result.getResolvedException() instanceof PersonNotFoundException));
  }

  @Test
  @WithRedesignUser(role = ROLE_RH_ADMIN)
  public void testGetOne_returnsPerson() throws Exception {
    var person = testPerson(ROLE_OP_CO_USER);
    person.setMemberOf(
        Set.of(new CompanyMember(testCompany(), person, CompanyMemberStatus.ACTIVE)));
    when(personRepository.findByEmail(personRef, MEMBER_OF)).thenReturn(Optional.of(person));

    mockMvc
        .perform(get("/person/{email}?expand=memberOf", personRef))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.email", is("test@redesignhealth.com")))
        .andExpect(jsonPath("$.givenName", is("Terra")))
        .andExpect(jsonPath("$.familyName", is("Branford")))
        .andExpect(jsonPath("$.roles[0].authority", is("ROLE_OP_CO_USER")))
        .andExpect(jsonPath("$.roles[0].displayName", is("Company User")))
        .andExpect(jsonPath("$.created", is("1970-01-01T00:00:00Z")))
        .andExpect(jsonPath("$.lastModified", is("1970-01-01T00:00:00Z")))
        .andDo(
            document(
                "get",
                queryParameters(expandQueryParameter(MEMBER_OF)),
                responseFields(
                    emailField(),
                    givenNameField(),
                    familyNameField(),
                    memberOfField(),
                    statusesField(),
                    rolesField(),
                    roleField(),
                    createdField(),
                    lastModifiedField(),
                    ceoInfoField(),
                    statusesField(),
                    linksField()),
                links(selfLink())));
  }

  @Test
  @WithRedesignUser(role = ROLE_OP_CO_USER, email = "test@redesignhealth.com")
  public void testGetOne_As_OP_CO_USER_Receives_OK_If_Email_Is_Equals_To_Requester()
      throws Exception {
    var person = testPerson(ROLE_OP_CO_USER);
    person.setMemberOf(
        Set.of(new CompanyMember(testCompany(), person, CompanyMemberStatus.ACTIVE)));
    when(personRepository.findByEmail(personRef, MEMBER_OF)).thenReturn(Optional.of(person));

    mockMvc.perform(get("/person/{email}?expand=memberOf", personRef)).andExpect(status().isOk());
  }

  @Test
  @WithRedesignUser(role = ROLE_OP_CO_USER, email = "test2t@redesignhealth.com")
  public void testGetOne_As_OP_CO_USER_Receives_OK_If_Email_Is_Not_Equals_To_Requester()
      throws Exception {
    var person = testPerson(ROLE_OP_CO_USER);
    person.setMemberOf(
        Set.of(new CompanyMember(testCompany(), person, CompanyMemberStatus.ACTIVE)));
    when(personRepository.findByEmail(personRef, MEMBER_OF)).thenReturn(Optional.of(person));

    mockMvc
        .perform(get("/person/{email}?expand=memberOf", personRef))
        .andExpect(status().isForbidden());
  }

  @Test
  @WithRedesignUser(role = ROLE_RH_ADMIN)
  public void testCreate_returnsPerson() throws Exception {
    mockMvc
        .perform(
            post("/person")
                .contentType(MediaType.APPLICATION_JSON)
                .content(
                    """
                        {
                          "givenName":"Terra",
                          "familyName": "Branford",
                          "email":  "test@redesignhealth.com",
                          "role": "ROLE_RH_USER"
                        }
                    """))
        .andExpect(status().isCreated())
        .andExpect(jsonPath("$.email", is("test@redesignhealth.com")))
        .andExpect(jsonPath("$.givenName", is("Terra")))
        .andExpect(jsonPath("$.familyName", is("Branford")))
        .andExpect(jsonPath("$.role.authority", is("ROLE_RH_USER")))
        .andDo(
            document(
                "create",
                requestFields(givenNameField(), familyNameField(), emailField(), roleField()),
                responseFields(
                    emailField(),
                    givenNameField(),
                    familyNameField(),
                    rolesField(),
                    roleField(),
                    memberOfField(),
                    statusesField(),
                    ceoInfoField(),
                    linksField()),
                links(selfLink())));

    verify(emailSender).sendPersonAdded(any(), any(), any());
  }

  @Test
  @WithRedesignUser(role = ROLE_RH_ADMIN)
  public void testCreate_handlesEmailUniqueness() throws Exception {
    // email already exists in database
    var uniqueViolation = Mockito.mock(ConstraintViolationException.class);
    var baseException = new DataIntegrityViolationException("Error", uniqueViolation);
    when(personRepository.save(any())).thenThrow(baseException);

    mockMvc
        .perform(
            post("/person")
                .contentType(MediaType.APPLICATION_JSON)
                .content(
                    "{\"givenName\":\"Terra\", \"familyName\": \"Branford\", \"email\":  \"test@redesignhealth.com\"}"))
        .andExpect(status().isUnprocessableEntity())
        .andExpect(jsonPath("$.message", is("Invalid field values")))
        .andExpect(jsonPath("$.errors[0].name", is("email")))
        .andExpect(jsonPath("$.errors[0].rejectedValue", is("test@redesignhealth.com")))
        .andExpect(jsonPath("$.errors[0].description", is("must be unique")));
  }

  @Test
  @WithRedesignUser(role = ROLE_RH_ADMIN)
  public void testCreate_handlesEmailRequired() throws Exception {

    mockMvc
        .perform(
            post("/person")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"givenName\":\"Terra\", \"familyName\": \"Branford\"}"))
        .andExpect(status().isUnprocessableEntity())
        .andExpect(jsonPath("$.message", is("Invalid field values")))
        .andExpect(jsonPath("$.errors[0].name", is("email")))
        .andExpect(jsonPath("$.errors[0].description", is("must not be blank")));
  }

  @Test
  @WithRedesignUser(role = ROLE_RH_ADMIN)
  public void testUpdateOne_returnsPerson() throws Exception {
    // person already exists in database
    when(personRepository.findByEmail(personRef)).thenReturn(Optional.of(testPerson()));

    mockMvc
        .perform(
            put("/person/{email}", personRef)
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"givenName\":\"Terra\", \"familyName\": \"Branford\"}"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.email", is("test@redesignhealth.com")))
        .andExpect(jsonPath("$.givenName", is("Terra")))
        .andExpect(jsonPath("$.familyName", is("Branford")))
        .andDo(
            document(
                "update",
                requestFields(givenNameField(), familyNameField()),
                responseFields(
                    emailField(),
                    givenNameField(),
                    familyNameField(),
                    rolesField(),
                    createdField(),
                    ceoInfoField(),
                    lastModifiedField(),
                    linksField()),
                links(selfLink())));

    verify(emailSender, never()).sendPersonAdded(any(), any(), any());
  }

  @Test
  @WithRedesignUser(role = ROLE_RH_ADMIN)
  public void testUpdateOne_createsPerson() throws Exception {
    // person doesn't exist in database
    when(personRepository.findByEmail(personRef)).thenReturn(Optional.empty());

    mockMvc
        .perform(
            put("/person/{email}", personRef)
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"givenName\":\"Terra\", \"familyName\": \"Branford\"}"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.email", is("test@redesignhealth.com")))
        .andExpect(jsonPath("$.givenName", is("Terra")))
        .andExpect(jsonPath("$.familyName", is("Branford")));

    verify(emailSender).sendPersonAdded(any(), any(), any());
  }

  @Test
  @WithRedesignUser(role = ROLE_RH_ADMIN)
  public void testAddRole_404UnknownPerson() throws Exception {
    mockMvc
        .perform(
            put("/person/{email}/role/{authority}", "unknown@redesignhealth.com", ROLE_RH_ADMIN))
        .andExpect(status().isNotFound())
        .andExpect(
            (result) ->
                assertTrue(result.getResolvedException() instanceof PersonNotFoundException));
  }

  @Test
  @WithRedesignUser(role = ROLE_RH_ADMIN)
  public void testAddRole_404UnknownRole() throws Exception {
    when(personRepository.findByEmail(personRef)).thenReturn(Optional.of(testPerson()));

    mockMvc
        .perform(put("/person/{email}/role/{role}", personRef, "ROLE_UNKNOWN"))
        .andExpect(status().isNotFound())
        .andExpect(
            (result) -> assertTrue(result.getResolvedException() instanceof RoleNotFoundException));
  }

  @Test
  @WithRedesignUser(role = ROLE_RH_ADMIN)
  public void testAddRole_success() throws Exception {
    var person = testPerson();
    when(personRepository.findByEmail(personRef)).thenReturn(Optional.of(person));

    mockMvc
        .perform(put("/person/{email}/role/{authority}", personRef, ROLE_RH_USER))
        .andExpect(status().isOk())
        .andDo(document("add-role"));
  }

  @Test
  @WithRedesignUser(role = ROLE_RH_ADMIN)
  public void testDeleteRole_404UnknownPerson() throws Exception {
    mockMvc
        .perform(
            delete("/person/{email}/role/{authority}", "unknown@redesignhealth.com", ROLE_RH_ADMIN))
        .andExpect(status().isNotFound())
        .andExpect(
            (result) ->
                assertTrue(result.getResolvedException() instanceof PersonNotFoundException));
  }

  @Test
  @WithRedesignUser(role = ROLE_RH_ADMIN)
  public void testDeleteRole_404UnknownRole() throws Exception {
    when(personRepository.findByEmail(personRef)).thenReturn(Optional.of(testPerson()));

    mockMvc
        .perform(delete("/person/{email}/role/{role}", personRef, "ROLE_UNKNOWN"))
        .andExpect(status().isNotFound())
        .andExpect(
            (result) -> assertTrue(result.getResolvedException() instanceof RoleNotFoundException));
  }

  @Test
  @WithRedesignUser(role = ROLE_RH_ADMIN)
  public void testDeleteRole_success() throws Exception {
    var person = testPerson();
    when(personRepository.findByEmail(personRef)).thenReturn(Optional.of(person));

    mockMvc
        .perform(delete("/person/{email}/role/{role}", personRef, ROLE_RH_ADMIN))
        .andExpect(status().isOk())
        .andDo(document("remove-role"));
  }

  @Test
  @WithRedesignUser(role = ROLE_RH_ADMIN)
  public void testDelete_missingPerson() throws Exception {
    when(personRepository.findByEmail(personRef)).thenReturn(Optional.empty());

    mockMvc
        .perform(delete("/person/{email}", "test@redesignhealth.com"))
        .andExpect(status().isNotFound());
  }

  @Test
  @WithRedesignUser(role = ROLE_RH_ADMIN)
  public void testDelete_success() throws Exception {
    when(personRepository.findByEmail(personRef)).thenReturn(Optional.of(testPerson()));

    mockMvc
        .perform(delete("/person/{email}", "test@redesignhealth.com"))
        .andExpect(status().isNoContent())
        .andDo(document("delete"));
  }

  @Test
  @WithRedesignUser(role = ROLE_OP_CO_CONTRACTOR, memberOf = TEST_COMPANY_ID)
  public void testGetMemberChanges_returnsChanges() throws Exception {
    var companyRef = testCompanyRef();
    var person = testPerson(ROLE_RH_ADMIN);
    var email = "test@redesignhealth.com";
    var company = testCompany();
    var companyMemberAudit = new CompanyMemberAudit();
    companyMemberAudit.setMemberOfId(company.getName());
    companyMemberAudit.setMembersId(person.getEmail().getEmail());
    companyMemberAudit.setStatus(CompanyMemberStatus.ACTIVE);
    companyMemberAudit.setOperation(CompanyMemberAuditOperation.INSERT);
    companyMemberAudit.setCreatedBy(email);
    companyMemberAudit.setLastModifiedBy(email);
    companyMemberAudit.setLastModified(Instant.EPOCH);
    companyMemberAudit.setCreated(Instant.EPOCH);

    when(companyRepository.findByApiId(companyRef)).thenReturn(Optional.of(company));
    when(personRepository.findByEmail(PersonRef.of(email))).thenReturn(Optional.of(person));

    when(companyMemberAuditRepository.findCompanyMemberAuditByMembersId(
            person.getEmail().getEmail()))
        .thenReturn(List.of(companyMemberAudit));

    mockMvc
        .perform(get("/person/{email}/changes", email))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.email", is(email)))
        .andDo(
            document(
                "get-member-changes",
                responseFields(emailField(), linksField())
                    .andWithPrefix(
                        "changes[]",
                        companyNameField(),
                        createdField(),
                        lastModifiedField(),
                        createdByField(),
                        lastModifiedFieldBy(),
                        companyMemberStatusField(),
                        companyMemberAuditOperationField())));
  }

  private static FieldDescriptor emailField() {
    return fieldWithPath("email").description("Email address");
  }

  private static FieldDescriptor givenNameField() {
    return fieldWithPath("givenName").description("Also known as first name");
  }

  private static FieldDescriptor familyNameField() {
    return fieldWithPath("familyName").description("Also known as last name");
  }

  private static FieldDescriptor companyNameField() {
    return fieldWithPath("companyName").description("Name of the company");
  }

  private static FieldDescriptor companyMemberStatusField() {
    return fieldWithPath("status").description("status of the companyMember(ACTIVE | INACTIVE)");
  }

  private static FieldDescriptor companyMemberAuditOperationField() {
    return fieldWithPath("operation").description("CUD operation (INSERT | UPDATE | DELETE) ");
  }

  private static FieldDescriptor ceoInfoField() {
    return subsectionWithPath("ceoInfo")
        .description("returns information if the person is CEO or not");
  }

  private static FieldDescriptor statusesField() {
    return subsectionWithPath("statuses")
        .description("Status list for the different companies where the person in member");
  }
}
