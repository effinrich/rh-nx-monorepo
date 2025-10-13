package com.redesignhealth.company.api.controller;

import static com.redesignhealth.company.api.scaffolding.DocUtils.expandQueryParameter;
import static com.redesignhealth.company.api.scaffolding.DocUtils.filterQueryParameter;
import static com.redesignhealth.company.api.scaffolding.DocUtils.idField;
import static com.redesignhealth.company.api.scaffolding.DocUtils.linksField;
import static com.redesignhealth.company.api.scaffolding.DocUtils.nameField;
import static com.redesignhealth.company.api.scaffolding.DocUtils.nameVendorField;
import static com.redesignhealth.company.api.scaffolding.DocUtils.qQueryParameter;
import static com.redesignhealth.company.api.scaffolding.DocUtils.subcategoriesField;
import static com.redesignhealth.company.api.scaffolding.Fixtures.TEST_COMPANY_ID;
import static com.redesignhealth.company.api.scaffolding.Fixtures.TEST_PERSON_EMAIL;
import static com.redesignhealth.company.api.scaffolding.Fixtures.testCompany;
import static com.redesignhealth.company.api.scaffolding.Fixtures.testCompanyRef;
import static com.redesignhealth.company.api.scaffolding.Fixtures.testCompanyVendor;
import static com.redesignhealth.company.api.scaffolding.Fixtures.testPerson;
import static com.redesignhealth.company.api.scaffolding.Fixtures.testPersonRef;
import static com.redesignhealth.company.api.scaffolding.Fixtures.testVendor;
import static org.hamcrest.Matchers.is;
import static org.mockito.AdditionalAnswers.returnsFirstArg;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyList;
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
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.redesignhealth.company.api.client.email.EmailSender;
import com.redesignhealth.company.api.entity.request.RoleAuthority;
import com.redesignhealth.company.api.expansion.Expansion;
import com.redesignhealth.company.api.repository.CompanyRepository;
import com.redesignhealth.company.api.repository.CompanyVendorRepository;
import com.redesignhealth.company.api.repository.PersonRepository;
import com.redesignhealth.company.api.scaffolding.CommonTestConfig;
import com.redesignhealth.company.api.scaffolding.WithRedesignUser;
import com.redesignhealth.company.api.service.CompanyVendorService;
import com.redesignhealth.company.api.service.SubcategoryService;
import com.redesignhealth.company.api.service.VendorService;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.restdocs.AutoConfigureRestDocs;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.MediaType;
import org.springframework.restdocs.payload.FieldDescriptor;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(CompanyVendorController.class)
@Import({CommonTestConfig.class})
@AutoConfigureRestDocs("target/generated-snippets/company-vendor")
public class CompanyVendorControllerTests {

  @Autowired private MockMvc mockMvc;

  @MockBean private CompanyVendorRepository companyVendorRepository;

  @MockBean private CompanyRepository companyRepository;

  @MockBean private VendorService vendorService;

  @MockBean private SubcategoryService subcategoryService;

  @MockBean private PersonRepository personRepository;

  @TestConfiguration
  static class TestConfig {
    @Bean
    public CompanyVendorService companyVendorService(
        CompanyVendorRepository companyVendorRepository,
        CompanyRepository companyRepository,
        VendorService vendorService,
        SubcategoryService subcategoryService,
        PersonRepository personRepository) {
      return new CompanyVendorService(
          companyVendorRepository,
          companyRepository,
          vendorService,
          subcategoryService,
          personRepository,
          Mockito.mock(EmailSender.class),
          List.of());
    }
  }

  @Test
  @WithRedesignUser(role = RoleAuthority.ROLE_OP_CO_USER, memberOf = TEST_COMPANY_ID)
  public void testGetAll_is_okay() throws Exception {
    var company = testCompany();
    when(companyRepository.findByApiId(company.getApiId())).thenReturn(Optional.of(company));
    when(companyVendorRepository.findAllByCompany(
            company, PageRequest.of(0, 2000, Sort.by(Sort.Order.asc("vendor.name")))))
        .thenReturn(List.of(testCompanyVendor()));
    mockMvc
        .perform(
            get(
                "/company/{companyId}/vendor?q=Text&filter=category,Infrastructure&expand=contacts",
                testCompanyRef()))
        .andExpect(status().isOk())
        .andDo(
            document(
                "query",
                queryParameters(
                    expandQueryParameter(Expansion.CONTACTS),
                    filterQueryParameter(),
                    qQueryParameter()),
                responseFields(linksField())
                    .andWithPrefix(
                        "content[].",
                        idField(),
                        nameVendorField(),
                        contactsFields(),
                        startDateField(),
                        endDateField(),
                        engagementStatusField(),
                        linksField())
                    .andWithPrefix("content[].subcategories[].", subcategoriesField())));
  }

  @Test
  @WithRedesignUser(role = RoleAuthority.ROLE_OP_CO_USER, memberOf = TEST_COMPANY_ID)
  public void testGetAll_404_company_not_found() throws Exception {
    var company = testCompany();
    when(companyRepository.findByApiId(company.getApiId())).thenReturn(Optional.empty());
    mockMvc
        .perform(get("/company/{companyId}/vendor", testCompanyRef()))
        .andExpect(status().isNotFound())
        .andExpect(jsonPath("$.message", is("Company does not exist.")));
  }

  @Test
  @WithRedesignUser(role = RoleAuthority.ROLE_OP_CO_USER, memberOf = TEST_COMPANY_ID)
  public void testGetOne_is_okay() throws Exception {
    var companyVendor = testCompanyVendor();
    when(companyVendorRepository.findByApiId(companyVendor.getApiId()))
        .thenReturn(Optional.of(companyVendor));
    mockMvc
        .perform(
            get(
                "/company/{companyId}/vendor/{companyVendorId}",
                testCompanyRef(),
                companyVendor.getApiId()))
        .andExpect(status().isOk())
        .andDo(
            document(
                "get",
                responseFields(
                        idField(),
                        nameVendorField(),
                        contactsFields(),
                        startDateField(),
                        endDateField(),
                        engagementStatusField(),
                        linksField())
                    .andWithPrefix("subcategories[].", subcategoriesField())));
  }

  @Test
  @WithRedesignUser(role = RoleAuthority.ROLE_OP_CO_USER, memberOf = TEST_COMPANY_ID)
  public void testGetOne_404_vendor_not_found() throws Exception {
    var companyVendor = testCompanyVendor();
    when(companyVendorRepository.findByApiId(companyVendor.getApiId()))
        .thenReturn(Optional.empty());
    mockMvc
        .perform(
            get(
                "/company/{companyId}/vendor/{companyVendorId}",
                testCompanyRef(),
                companyVendor.getApiId()))
        .andExpect(status().isNotFound());
  }

  @Test
  @WithRedesignUser(role = RoleAuthority.ROLE_OP_CO_USER, memberOf = TEST_COMPANY_ID)
  public void testCreate_404_company_not_found() throws Exception {
    var company = testCompany();
    when(companyRepository.findByApiId(company.getApiId())).thenReturn(Optional.empty());
    mockMvc
        .perform(
            post("/company/{companyId}/vendor", testCompanyRef())
                .contentType(MediaType.APPLICATION_JSON)
                .content(
                    """
            {
              "name": "Boomset",
              "subcategories": [{
                "name": "CI/CD",
                "category": {
                  "name": "Infrastructure"
                }
              }]
            }
            """))
        .andExpect(status().isNotFound());
  }

  @Test
  @WithRedesignUser(
      email = TEST_PERSON_EMAIL,
      role = RoleAuthority.ROLE_OP_CO_USER,
      memberOf = TEST_COMPANY_ID)
  public void testCreate_vendor_already_exists() throws Exception {
    var company = testCompany();
    when(companyRepository.findByApiId(company.getApiId())).thenReturn(Optional.of(company));
    when(vendorService.getByName("Boomset")).thenReturn(Optional.of(testVendor()));
    when(companyVendorRepository.save(any())).then(returnsFirstArg());
    when(subcategoryService.processSubcategories(anyList()))
        .thenReturn(testCompanyVendor().getSubcategories());
    when(personRepository.findByEmail(testPersonRef())).thenReturn(Optional.of(testPerson()));

    mockMvc
        .perform(
            post("/company/{companyId}/vendor", testCompanyRef())
                .contentType(MediaType.APPLICATION_JSON)
                .content(
                    """
            {
              "name": "Boomset",
              "subcategories": [{
                "name": "CI/CD",
                "apiId": "1KlMnh9a",
                "category": {
                  "apiId": "2KlMnh9b",
                  "name": "Infrastructure"
                }
              }],
              "engagementStatus": "CONSIDERED",
              "startDate": "2018-03-28T14:32:11.838Z",
              "endDate": "2018-12-28T14:32:11.838Z",
              "willingToDiscuss": true
            }
      """))
        .andExpect(status().isCreated())
        .andExpect(jsonPath("$.name", is("Boomset")))
        .andExpect(jsonPath("$.subcategories[0].name", is("CI/CD")))
        .andExpect(jsonPath("$.engagementStatus.value", is("CONSIDERED")))
        .andExpect(jsonPath("$.startDate", is("2018-03-28T14:32:11.838Z")))
        .andExpect(jsonPath("$.endDate", is("2018-12-28T14:32:11.838Z")))
        .andExpect(jsonPath("$.contacts[0].email", is(testPersonRef().value())))
        .andDo(
            document(
                "create",
                requestFields(
                        nameField(),
                        engagementStatusField(),
                        startDateField(),
                        endDateField(),
                        willingToDiscussField())
                    .andWithPrefix("subcategories[].", subcategoriesField()),
                responseFields(
                        idField(),
                        nameVendorField(),
                        contactsFields(),
                        startDateField(),
                        endDateField(),
                        engagementStatusField(),
                        linksField())
                    .andWithPrefix("subcategories[].", subcategoriesField())));
    ;
  }

  @Test
  @WithRedesignUser(
      email = TEST_PERSON_EMAIL,
      role = RoleAuthority.ROLE_OP_CO_USER,
      memberOf = TEST_COMPANY_ID)
  public void testUpdate_is_okay() throws Exception {
    var company = testCompany();
    var companyVendor = testCompanyVendor();
    when(companyRepository.findByApiId(company.getApiId())).thenReturn(Optional.of(company));
    when(companyVendorRepository.findByApiId(companyVendor.getApiId()))
        .thenReturn(Optional.of(companyVendor));
    when(personRepository.findByEmail(testPersonRef())).thenReturn(Optional.of(testPerson()));
    when(companyVendorRepository.save(any())).then(returnsFirstArg());
    when(subcategoryService.processSubcategories(anyList()))
        .thenReturn(testCompanyVendor().getSubcategories());
    mockMvc
        .perform(
            put(
                    "/company/{companyId}/vendor/{companyVendorId}",
                    company.getApiId(),
                    companyVendor.getApiId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(
                    """
            {
              "subcategories": [{
                "name": "CI/CD",
                "apiId": "1KlMnh9a",
                "category": {
                  "apiId": "2KlMnh9b",
                  "name": "Infrastructure"
                }
              }],
              "engagementStatus": "CONSIDERED",
              "startDate": "2018-03-28T14:32:11.838Z",
              "endDate": "2018-12-28T14:32:11.838Z",
              "willingToDiscuss": true
            }
      """))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.name", is("Boomset")))
        .andExpect(jsonPath("$.subcategories[0].name", is("CI/CD")))
        .andExpect(jsonPath("$.engagementStatus.value", is("CONSIDERED")))
        .andExpect(jsonPath("$.startDate", is("2018-03-28T14:32:11.838Z")))
        .andExpect(jsonPath("$.endDate", is("2018-12-28T14:32:11.838Z")))
        .andDo(
            document(
                "update",
                requestFields(
                        engagementStatusField(),
                        startDateField(),
                        endDateField(),
                        willingToDiscussField())
                    .andWithPrefix("subcategories[].", subcategoriesField()),
                responseFields(
                        idField(),
                        nameVendorField(),
                        contactsFields(),
                        startDateField(),
                        endDateField(),
                        engagementStatusField(),
                        linksField())
                    .andWithPrefix("subcategories[].", subcategoriesField())));
    ;
  }

  @Test
  @WithRedesignUser(role = RoleAuthority.ROLE_RH_ADMIN)
  public void testDelete_is_okay() throws Exception {
    var companyVendor = testCompanyVendor();
    when(companyVendorRepository.findByApiId(companyVendor.getApiId()))
        .thenReturn(Optional.of(companyVendor));
    mockMvc
        .perform(
            delete(
                "/company/{companyId}/vendor/{companyVendorId}",
                testCompanyRef(),
                companyVendor.getApiId()))
        .andExpect(status().isNoContent())
        .andDo(document("delete"));
  }

  private static FieldDescriptor startDateField() {
    return fieldWithPath("startDate").description("When the company started using the vendor");
  }

  private static FieldDescriptor endDateField() {
    return fieldWithPath("endDate").description("When the company stopped using the vendor");
  }

  private static FieldDescriptor engagementStatusField() {
    return subsectionWithPath("engagementStatus")
        .description("Information around how a company has used a vendor.");
  }

  private static FieldDescriptor contactsFields() {
    return subsectionWithPath("contacts")
        .description(
            "Company employees who have either opted-in or out of discussing the vendor with others. (requires `?expand=contacts`).");
  }

  private static FieldDescriptor willingToDiscussField() {
    return fieldWithPath("willingToDiscuss")
        .description("Whether or not the person is willing to be contacted about the vendor.");
  }
}
