package com.redesignhealth.company.api.controller;

import static com.redesignhealth.company.api.client.search.entity.IpMarketplaceSearchDoc.ORGANIZATION_TYPE;
import static com.redesignhealth.company.api.entity.request.RoleAuthority.ROLE_OP_CO_USER;
import static com.redesignhealth.company.api.scaffolding.DocUtils.expandQueryParameter;
import static com.redesignhealth.company.api.scaffolding.DocUtils.filterQueryParameter;
import static com.redesignhealth.company.api.scaffolding.DocUtils.idField;
import static com.redesignhealth.company.api.scaffolding.DocUtils.keyField;
import static com.redesignhealth.company.api.scaffolding.DocUtils.linksField;
import static com.redesignhealth.company.api.scaffolding.DocUtils.optionsField;
import static com.redesignhealth.company.api.scaffolding.DocUtils.pageFields;
import static com.redesignhealth.company.api.scaffolding.DocUtils.pageQueryParameter;
import static com.redesignhealth.company.api.scaffolding.DocUtils.qQueryParameter;
import static com.redesignhealth.company.api.scaffolding.DocUtils.sizeQueryParameter;
import static com.redesignhealth.company.api.scaffolding.DocUtils.sortQueryParameter;
import static com.redesignhealth.company.api.scaffolding.Fixtures.testCompany;
import static com.redesignhealth.company.api.scaffolding.Fixtures.testCompanyRef;
import static com.redesignhealth.company.api.scaffolding.Fixtures.testIpMarketPlace;
import static com.redesignhealth.company.api.scaffolding.Fixtures.testIpMarketplaceCallSearchDoc;
import static com.redesignhealth.company.api.scaffolding.Fixtures.testIpMarketplaceCompany;
import static com.redesignhealth.company.api.scaffolding.Fixtures.testIpMarketplaceTrack;
import static com.redesignhealth.company.api.scaffolding.Fixtures.testPayloadIpMarketPlaceForCreate;
import static com.redesignhealth.company.api.scaffolding.Fixtures.testPayloadIpMarketPlaceForUpdate;
import static com.redesignhealth.company.api.scaffolding.Fixtures.testPerson;
import static com.redesignhealth.company.api.service.IpMarketplaceService.VALID_SEARCH_FILTERS;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.notNullValue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.atLeast;
import static org.mockito.Mockito.verify;
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

import com.redesignhealth.company.api.assembler.IpMarketplaceAssembler;
import com.redesignhealth.company.api.client.email.EmailSender;
import com.redesignhealth.company.api.client.prometheus.ExternalPrometheusClient;
import com.redesignhealth.company.api.client.rocketchat.RocketChatClient;
import com.redesignhealth.company.api.client.search.SearchClient;
import com.redesignhealth.company.api.client.search.command.SearchCommand;
import com.redesignhealth.company.api.client.search.command.SearchFilterOptionsCommand;
import com.redesignhealth.company.api.client.search.command.SearchIndex;
import com.redesignhealth.company.api.client.search.entity.FilterOptions;
import com.redesignhealth.company.api.client.search.entity.IpMarketplaceSearchDoc;
import com.redesignhealth.company.api.client.search.entity.SearchResult;
import com.redesignhealth.company.api.client.search.entity.Term;
import com.redesignhealth.company.api.dto.SearchFilter;
import com.redesignhealth.company.api.dto.command.ipMarketplace.IpMarketplaceBuyerRequestContactInfoCommand;
import com.redesignhealth.company.api.dto.command.ipMarketplace.IpMarketplaceSellerReleaseContactInfoCommand;
import com.redesignhealth.company.api.dto.enums.CompanyIPMarketplaceType;
import com.redesignhealth.company.api.dto.enums.CompanyMemberStatus;
import com.redesignhealth.company.api.dto.enums.CompanyStatus;
import com.redesignhealth.company.api.dto.enums.IpMarketplaceTrackContactInfo;
import com.redesignhealth.company.api.entity.CompanyMember;
import com.redesignhealth.company.api.entity.IpMarketplaceTrack;
import com.redesignhealth.company.api.entity.ref.CompanyRef;
import com.redesignhealth.company.api.entity.ref.IpMarketplaceRef;
import com.redesignhealth.company.api.entity.ref.PersonRef;
import com.redesignhealth.company.api.entity.request.RoleAuthority;
import com.redesignhealth.company.api.expansion.Expansion;
import com.redesignhealth.company.api.property.IpMarketplaceConverter;
import com.redesignhealth.company.api.property.RocketChatSellerCredentials;
import com.redesignhealth.company.api.repository.CompanyRepository;
import com.redesignhealth.company.api.repository.IpMarketplaceRepository;
import com.redesignhealth.company.api.repository.IpMarketplaceTrackRepository;
import com.redesignhealth.company.api.repository.PersonRepository;
import com.redesignhealth.company.api.scaffolding.CommonTestConfig;
import com.redesignhealth.company.api.scaffolding.WithRedesignUser;
import com.redesignhealth.company.api.service.IpMarketplaceService;
import com.redesignhealth.company.api.util.RhCustomCounter;
import java.net.URI;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import org.hibernate.exception.ConstraintViolationException;
import org.junit.jupiter.api.Test;
import org.mockito.MockedStatic;
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
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.MediaType;
import org.springframework.restdocs.payload.FieldDescriptor;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(IpMarketplaceController.class)
@Import({CommonTestConfig.class})
@AutoConfigureRestDocs("target/generated-snippets/ip-marketplace")
public class IpMarketplaceControllerTests {
  @Autowired private MockMvc mockMvc;
  @MockBean private IpMarketplaceRepository ipMarketplaceRepository;

  @MockBean private IpMarketplaceTrackRepository ipMarketplaceTrackRepository;
  @MockBean private CompanyRepository companyRepository;
  @MockBean private PersonRepository personRepository;
  @MockBean private SearchClient searchClient;
  @MockBean private EmailSender emailSender;
  @MockBean private ExternalPrometheusClient prometheusClient;
  @MockBean private RocketChatClient rocketChatClient;
  @MockBean private RocketChatSellerCredentials rocketChatSellerCredentials;

  @TestConfiguration
  static class TestConfig {
    @Bean
    public IpMarketplaceService ipMarketplaceService(
        IpMarketplaceRepository ipMarketplaceRepository,
        CompanyRepository companyRepository,
        PersonRepository personRepository,
        SearchClient searchClient,
        IpMarketplaceConverter ipMarketplaceConverter,
        IpMarketplaceTrackRepository ipMarketplaceTrackRepository,
        EmailSender emailSender,
        ExternalPrometheusClient prometheusClient,
        RocketChatClient rocketChatClient) {
      return new IpMarketplaceService(
          ipMarketplaceRepository,
          companyRepository,
          personRepository,
          searchClient,
          ipMarketplaceConverter,
          ipMarketplaceTrackRepository,
          emailSender,
          prometheusClient,
          URI.create("https://www.example.com"),
          rocketChatClient,
          "rocketChatUserNotification",
          "rocketChatPasswordNotification");
    }

    @Bean
    public IpMarketplaceAssembler ipMarketplaceAssembler() {
      return new IpMarketplaceAssembler();
    }
  }

  @Test
  @WithRedesignUser(role = ROLE_OP_CO_USER, memberOf = "1KlMnh9a", email = "seller@seller.com")
  public void createIpMarketplace() throws Exception {
    var companyApiId = testCompanyRef();
    var personEmail = "seller@seller.com";
    var person = testPerson(ROLE_OP_CO_USER, personEmail);
    var company = testIpMarketplaceCompany(person);
    company.setApiId(companyApiId);
    var companyMember = new CompanyMember(company, person, CompanyMemberStatus.ACTIVE);
    person.setMemberOf(Set.of(companyMember));
    when(companyRepository.findByApiId(companyApiId)).thenReturn(Optional.of(company));
    when(companyRepository.existsByCompanyIpMarketplaceActivityTypeAndApiIdIn(
            CompanyIPMarketplaceType.ENTERPRISE_SELLER, Set.of(CompanyRef.of("1KlMnh9a"))))
        .thenReturn(true);
    when(personRepository.findByEmail(PersonRef.of(personEmail), Expansion.MEMBER_OF))
        .thenReturn(Optional.of(person));
    mockMvc
        .perform(
            post("/ip-marketplace")
                .contentType(MediaType.APPLICATION_JSON)
                .content(testPayloadIpMarketPlaceForCreate()))
        .andExpect(status().isCreated())
        .andExpect(jsonPath("$.organization.name", is("Springtide")))
        .andExpect(jsonPath("$.organization.activityType.value", is("ENTERPRISE_SELLER")))
        .andExpect(jsonPath("$.organization.organizationType.value", is("IDN_HEALTH_SYSTEM")))
        .andExpect(jsonPath("$.organization.region.value", is("NORTHEAST")))
        .andExpect(jsonPath("$.owner.email", is("seller@seller.com")))
        .andDo(
            document(
                "create",
                requestFields(
                    emailField(),
                    nameField(),
                    executiveSummaryField(),
                    therapeuticNeedOrTrendsBeingAddressedField(),
                    technologyOverviewField(),
                    licenseRestrictionField(),
                    aboutLicenseRestrictionField(),
                    preferredTermsField(),
                    associatedFilesOrMediaField(),
                    patentStatusField(),
                    patentIssueField(),
                    patentGeographicValidityField(),
                    diseaseField(),
                    organOfFocusField(),
                    technologyTypeField(),
                    specialityField(),
                    sellerSummaryTechTransferApproachField(),
                    responsibleInventorField(),
                    technologyLevelOfMaturityField(),
                    patentStatusHrefField(),
                    freedomToOperateCertificationField(),
                    companyIdField()),
                responseFields(
                    linksField(),
                    organizationField(),
                    ownerField(),
                    nameField(),
                    executiveSummaryField(),
                    therapeuticNeedOrTrendsBeingAddressedField(),
                    technologyOverviewField(),
                    licenseRestrictionField(),
                    aboutLicenseRestrictionField(),
                    preferredTermsField(),
                    associatedFilesOrMediaField(),
                    patentStatusFieldSE(),
                    patentGeographicValidityField(),
                    diseaseField(),
                    organOfFocusField(),
                    specialityField(),
                    sellerSummaryTechTransferApproachField(),
                    responsibleInventorField(),
                    technologyLevelOfMaturityField(),
                    patentStatusHrefField(),
                    freedomToOperateCertificationFieldSE(),
                    organOfFocusFieldSE(),
                    technologyTypeField(),
                    legalPatentabilityAssessmentAvailableField(),
                    copyrightedField(),
                    idField(),
                    viewedField(),
                    statusFieldSE())));
  }

  @Test
  @WithRedesignUser(role = ROLE_OP_CO_USER, memberOf = "1KlMnh9a", email = "seller2@seller.com")
  public void
      createIpMarketplace_Should_Fail_If_Want_To_Create_Ip_Record_With_Not_My_Email_Being_Seller()
          throws Exception {
    var companyApiId = testCompanyRef();
    var personEmail = "seller@seller.com";
    var person = testPerson(ROLE_OP_CO_USER, personEmail);
    var company = testIpMarketplaceCompany(person);
    company.setApiId(companyApiId);
    var companyMember = new CompanyMember(company, person, CompanyMemberStatus.ACTIVE);
    person.setMemberOf(Set.of(companyMember));
    when(companyRepository.findByApiId(companyApiId)).thenReturn(Optional.of(company));
    when(companyRepository.existsByCompanyIpMarketplaceActivityTypeAndApiIdIn(
            CompanyIPMarketplaceType.ENTERPRISE_SELLER, Set.of(CompanyRef.of("1KlMnh9a"))))
        .thenReturn(true);
    when(personRepository.findByEmail(PersonRef.of(personEmail), Expansion.MEMBER_OF))
        .thenReturn(Optional.of(person));
    mockMvc
        .perform(
            post("/ip-marketplace")
                .contentType(MediaType.APPLICATION_JSON)
                .content(testPayloadIpMarketPlaceForCreate()))
        .andExpect(status().isUnprocessableEntity())
        .andExpect(
            jsonPath(
                "$.errors[0].description",
                is("Email should be equals to the seller trying to create the IP Record")));
  }

  @Test
  @WithRedesignUser(role = ROLE_OP_CO_USER, memberOf = "buyerCompanyId", email = "buyer@buyer.com")
  public void createIpMarketplace_Should_Fail_If_Requester_Is_A_Buyer() throws Exception {
    var companyApiId = testCompanyRef();
    var personEmail = "seller@seller.com";
    var person = testPerson(ROLE_OP_CO_USER, personEmail);
    var company = testIpMarketplaceCompany(person);
    company.setApiId(companyApiId);
    var companyMember = new CompanyMember(company, person, CompanyMemberStatus.ACTIVE);
    person.setMemberOf(Set.of(companyMember));
    when(companyRepository.findByApiId(companyApiId)).thenReturn(Optional.of(company));
    when(companyRepository.existsByCompanyIpMarketplaceActivityTypeAndApiIdIn(
            CompanyIPMarketplaceType.ENTERPRISE_BUYER, Set.of(CompanyRef.of("buyerCompanyId"))))
        .thenReturn(true);
    when(personRepository.findByEmail(PersonRef.of(personEmail), Expansion.MEMBER_OF))
        .thenReturn(Optional.of(person));
    mockMvc
        .perform(
            post("/ip-marketplace")
                .contentType(MediaType.APPLICATION_JSON)
                .content(testPayloadIpMarketPlaceForCreate()))
        .andExpect(status().isForbidden())
        .andExpect(
            jsonPath(
                "$.message", is("Buyers or RH users can't create IP records for the marketplace")));
  }

  @Test
  @WithRedesignUser(role = ROLE_OP_CO_USER)
  public void createIpMarketplace_Should_Fail_If_Company_Doesnt_Exist() throws Exception {
    mockMvc
        .perform(
            post("/ip-marketplace")
                .contentType(MediaType.APPLICATION_JSON)
                .content(testPayloadIpMarketPlaceForCreate()))
        .andExpect(status().isUnprocessableEntity())
        .andExpect(jsonPath("$.errors[0].name", is("companyId")))
        .andExpect(jsonPath("$.errors[0].description", is("must exist")));
  }

  @Test
  @WithRedesignUser(role = ROLE_OP_CO_USER)
  public void createIpMarketplace_Should_Fail_If_Company_Is_Not_Enterprise_Seller()
      throws Exception {
    var companyApiId = testCompanyRef();
    var personEmail = "seller@seller.com";
    var person = testPerson(ROLE_OP_CO_USER, personEmail);
    var company = testIpMarketplaceCompany(person);
    company.setApiId(companyApiId);
    var companyMember = new CompanyMember(company, person, CompanyMemberStatus.ACTIVE);
    person.setMemberOf(Set.of(companyMember));
    company.getCompanyIpMarketplace().setActivityType(CompanyIPMarketplaceType.ENTERPRISE_BUYER);
    when(companyRepository.findByApiId(companyApiId)).thenReturn(Optional.of(company));
    when(personRepository.findByEmail(PersonRef.of(personEmail), Expansion.MEMBER_OF))
        .thenReturn(Optional.of(person));
    mockMvc
        .perform(
            post("/ip-marketplace")
                .contentType(MediaType.APPLICATION_JSON)
                .content(testPayloadIpMarketPlaceForCreate()))
        .andExpect(status().isUnprocessableEntity())
        .andExpect(
            jsonPath(
                "$.errors[0].description",
                is("Company should be a IP Marketplace Company Seller")));
  }

  @Test
  @WithRedesignUser(role = ROLE_OP_CO_USER)
  public void createIpMarketplace_Should_Fail_If_Seller_Doesnt_Exist() throws Exception {
    var companyApiId = testCompanyRef();
    var company = testIpMarketplaceCompany();
    company.setApiId(companyApiId);
    when(companyRepository.findByApiId(companyApiId)).thenReturn(Optional.of(company));
    mockMvc
        .perform(
            post("/ip-marketplace")
                .contentType(MediaType.APPLICATION_JSON)
                .content(testPayloadIpMarketPlaceForCreate()))
        .andExpect(status().isUnprocessableEntity())
        .andExpect(jsonPath("$.errors[0].name", is("email")))
        .andExpect(jsonPath("$.errors[0].description", is("must exist")));
  }

  @Test
  @WithRedesignUser(role = ROLE_OP_CO_USER)
  public void
      createIpMarketplace_ShouldFail_If_Seller_Doesnt_Belong_To_Company_Selling_And_Doesnt_Have_Company_Assigned()
          throws Exception {
    var companyApiId = testCompanyRef();
    var personEmail = "seller@seller.com";
    var person = testPerson(ROLE_OP_CO_USER, personEmail);
    var company = testIpMarketplaceCompany();
    company.setApiId(companyApiId);
    when(companyRepository.findByApiId(companyApiId)).thenReturn(Optional.of(company));
    when(personRepository.findByEmail(PersonRef.of(personEmail), Expansion.MEMBER_OF))
        .thenReturn(Optional.of(person));
    mockMvc
        .perform(
            post("/ip-marketplace")
                .contentType(MediaType.APPLICATION_JSON)
                .content(testPayloadIpMarketPlaceForCreate()))
        .andExpect(status().isUnprocessableEntity())
        .andExpect(jsonPath("$.errors[0].name", is("email")))
        .andExpect(
            jsonPath("$.errors[0].description", is("person doesn't belongs to the company")));
  }

  @Test
  @WithRedesignUser(role = ROLE_OP_CO_USER)
  public void createIpMarketplace_ShouldFail_If_Seller_Doesnt_Belong_To_Company_Selling()
      throws Exception {
    var companyApiId = testCompanyRef();
    var personEmail = "seller@seller.com";
    var person = testPerson(ROLE_OP_CO_USER, personEmail);
    var company = testIpMarketplaceCompany();
    var company2 = testCompany("companyApiId2");
    company.setApiId(companyApiId);
    var companyMember = new CompanyMember(company2, person, CompanyMemberStatus.ACTIVE);
    person.setMemberOf(Set.of(companyMember));
    when(companyRepository.findByApiId(companyApiId)).thenReturn(Optional.of(company));
    when(personRepository.findByEmail(PersonRef.of(personEmail), Expansion.MEMBER_OF))
        .thenReturn(Optional.of(person));
    mockMvc
        .perform(
            post("/ip-marketplace")
                .contentType(MediaType.APPLICATION_JSON)
                .content(testPayloadIpMarketPlaceForCreate()))
        .andExpect(status().isUnprocessableEntity())
        .andExpect(jsonPath("$.errors[0].name", is("email")))
        .andExpect(
            jsonPath("$.errors[0].description", is("person doesn't belongs to the company")));
  }

  @Test
  @WithRedesignUser(role = ROLE_OP_CO_USER)
  public void createIpMarketplace_Should_Fail_If_Company_is_Not_Active() throws Exception {
    var companyApiId = testCompanyRef();
    var personEmail = "seller@seller.com";
    var person = testPerson(ROLE_OP_CO_USER, personEmail);
    var company = testIpMarketplaceCompany(person);
    company.setApiId(companyApiId);
    company.setStatus(CompanyStatus.ARCHIVED);
    var companyMember = new CompanyMember(company, person, CompanyMemberStatus.ACTIVE);
    person.setMemberOf(Set.of(companyMember));
    when(companyRepository.findByApiId(companyApiId)).thenReturn(Optional.of(company));
    when(personRepository.findByEmail(PersonRef.of(personEmail), Expansion.MEMBER_OF))
        .thenReturn(Optional.of(person));
    mockMvc
        .perform(
            post("/ip-marketplace")
                .contentType(MediaType.APPLICATION_JSON)
                .content(testPayloadIpMarketPlaceForCreate()))
        .andExpect(status().isUnprocessableEntity())
        .andExpect(jsonPath("$.errors[0].name", is("companyId")))
        .andExpect(jsonPath("$.errors[0].description", is("Company should be active")));
  }

  @Test
  @WithRedesignUser(role = ROLE_OP_CO_USER)
  public void createIpMarketplace_Should_Fail_If_Seller_is_Not_Active() throws Exception {
    var companyApiId = testCompanyRef();
    var personEmail = "seller@seller.com";
    var person = testPerson(ROLE_OP_CO_USER, personEmail);
    var company = testIpMarketplaceCompany(person);
    company.setApiId(companyApiId);
    var companyMember = new CompanyMember(company, person, CompanyMemberStatus.INACTIVE);
    person.setMemberOf(Set.of(companyMember));
    when(companyRepository.findByApiId(companyApiId)).thenReturn(Optional.of(company));
    when(personRepository.findByEmail(PersonRef.of(personEmail), Expansion.MEMBER_OF))
        .thenReturn(Optional.of(person));
    mockMvc
        .perform(
            post("/ip-marketplace")
                .contentType(MediaType.APPLICATION_JSON)
                .content(testPayloadIpMarketPlaceForCreate()))
        .andExpect(status().isUnprocessableEntity())
        .andExpect(jsonPath("$.errors[0].name", is("email")))
        .andExpect(jsonPath("$.errors[0].description", is("Member should be active")));
  }

  @Test
  @WithRedesignUser(role = ROLE_OP_CO_USER)
  public void
      createIpMarketplace_Should_Fail_If_LicenseInfo_Is_False_And_AboutLicenseRestriction_Is_Not_Null()
          throws Exception {
    var companyApiId = testCompanyRef();
    var personEmail = "seller@seller.com";
    var person = testPerson(ROLE_OP_CO_USER, personEmail);
    var company = testIpMarketplaceCompany(person);
    company.setApiId(companyApiId);
    var companyMember = new CompanyMember(company, person, CompanyMemberStatus.ACTIVE);
    person.setMemberOf(Set.of(companyMember));
    when(companyRepository.findByApiId(companyApiId)).thenReturn(Optional.of(company));
    when(personRepository.findByEmail(PersonRef.of(personEmail), Expansion.MEMBER_OF))
        .thenReturn(Optional.of(person));
    mockMvc
        .perform(
            post("/ip-marketplace")
                .contentType(MediaType.APPLICATION_JSON)
                .content(
                    """
        {
          "email": "seller@seller.com",
          "name": "Marvelous Idea",
          "executiveSummary": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididun",
          "therapeuticNeedOrTrendsBeingAddressed": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididun",
          "technologyOverview": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididun",
          "licenseRestriction": false,
          "aboutLicenseRestriction": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididun",
          "preferredTerms": [
            "EQUITY"
          ],
          "associatedFilesOrMedia": [
            {
              "href": "https://example.com",
              "name": "report_url"
            }
          ],
          "patentStatus": "PATENTED",
          "patentIssue": "2023-10-18T22:01:30.821Z",
          "patentGeographicValidity": [
            "US"
          ],
          "disease": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididun",
          "organOfFocus": ["ADRENAL_GLANDS"],
          "technologyType": [
            "MEDICAL_DEVICES"
          ],
          "speciality": [
            "ALLERGY_AND_IMMUNOLOGY"
          ],
          "sellerSummaryTechTransferApproach": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididun",
          "responsibleInventor": "John Smith",
          "technologyLevelOfMaturity": [
            "ANIMAL_STUDY"
          ],
          "patentStatusHref": "https://example.com",
          "freedomToOperateCertification": "YES",
          "companyId": "1KlMnh9a"
        }
        """))
        .andExpect(status().isUnprocessableEntity())
        .andExpect(jsonPath("$.errors[0].name", is("aboutLicenseRestriction")))
        .andExpect(
            jsonPath(
                "$.errors[0].description",
                is("About restriction is only filled when License restriction is true")));
  }

  @Test
  @WithRedesignUser(role = ROLE_OP_CO_USER)
  public void
      createIpMarketplace_Should_Fail_If_LicenseInfo_Was_Not_Sent_And_AboutLicenseRestriction_Is_Not_Null()
          throws Exception {
    var companyApiId = testCompanyRef();
    var personEmail = "seller@seller.com";
    var person = testPerson(ROLE_OP_CO_USER, personEmail);
    var company = testIpMarketplaceCompany(person);
    company.setApiId(companyApiId);
    var companyMember = new CompanyMember(company, person, CompanyMemberStatus.ACTIVE);
    person.setMemberOf(Set.of(companyMember));
    when(companyRepository.findByApiId(companyApiId)).thenReturn(Optional.of(company));
    when(personRepository.findByEmail(PersonRef.of(personEmail), Expansion.MEMBER_OF))
        .thenReturn(Optional.of(person));
    mockMvc
        .perform(
            post("/ip-marketplace")
                .contentType(MediaType.APPLICATION_JSON)
                .content(
                    """
        {
          "email": "seller@seller.com",
          "name": "Marvelous Idea",
          "executiveSummary": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididun",
          "therapeuticNeedOrTrendsBeingAddressed": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididun",
          "technologyOverview": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididun",
          "aboutLicenseRestriction": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididun",
          "preferredTerms": [
            "EQUITY"
          ],
          "associatedFilesOrMedia": [
            {
              "href": "https://example.com",
              "name": "report_url"
            }
          ],
          "patentStatus": "PATENTED",
          "patentIssue": "2023-10-18T22:01:30.821Z",
          "patentGeographicValidity": [
            "US"
          ],
          "disease": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididun",
          "organOfFocus": ["ADRENAL_GLANDS"],
          "technologyType": [
            "MEDICAL_DEVICES"
          ],
          "speciality": [
            "ALLERGY_AND_IMMUNOLOGY"
          ],
          "sellerSummaryTechTransferApproach": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididun",
          "responsibleInventor": "John Smith",
          "technologyLevelOfMaturity": [
            "ANIMAL_STUDY"
          ],
          "patentStatusHref": "https://example.com",
          "freedomToOperateCertification": "YES",
          "companyId": "1KlMnh9a"
        }
        """))
        .andExpect(status().isUnprocessableEntity())
        .andExpect(jsonPath("$.errors[0].name", is("aboutLicenseRestriction")))
        .andExpect(
            jsonPath(
                "$.errors[0].description",
                is(
                    "About restriction is only filled when License restriction is sent and its value is true")));
  }

  @Test
  @WithRedesignUser(role = ROLE_OP_CO_USER)
  public void
      createIpMarketplace_Should_Fail_If_Patent_Status_Is_Different_To_Other_And_patentStatusOtherInfo_Is_Not_Null()
          throws Exception {
    var companyApiId = testCompanyRef();
    var personEmail = "seller@seller.com";
    var person = testPerson(ROLE_OP_CO_USER, personEmail);
    var company = testIpMarketplaceCompany(person);
    company.setApiId(companyApiId);
    var companyMember = new CompanyMember(company, person, CompanyMemberStatus.ACTIVE);
    person.setMemberOf(Set.of(companyMember));
    when(companyRepository.findByApiId(companyApiId)).thenReturn(Optional.of(company));
    when(personRepository.findByEmail(PersonRef.of(personEmail), Expansion.MEMBER_OF))
        .thenReturn(Optional.of(person));
    mockMvc
        .perform(
            post("/ip-marketplace")
                .contentType(MediaType.APPLICATION_JSON)
                .content(
                    """
        {
          "email": "seller@seller.com",
          "name": "Marvelous Idea",
          "executiveSummary": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididun",
          "therapeuticNeedOrTrendsBeingAddressed": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididun",
          "technologyOverview": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididun",
          "licenseRestriction": true,
          "aboutLicenseRestriction": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididun",
          "preferredTerms": [
            "EQUITY"
          ],
          "associatedFilesOrMedia": [
            {
              "href": "https://example.com",
              "name": "report_url"
            }
          ],
          "patentStatus": "PATENTED",
          "patentStatusOtherInfo": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididun",
          "patentIssue": "2023-10-18T22:01:30.821Z",
          "patentGeographicValidity": [
            "US"
          ],
          "disease": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididun",
          "organOfFocus": ["ADRENAL_GLANDS"],
          "technologyType": [
            "MEDICAL_DEVICES"
          ],
          "speciality": [
            "ALLERGY_AND_IMMUNOLOGY"
          ],
          "sellerSummaryTechTransferApproach": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididun",
          "responsibleInventor": "John Smith",
          "technologyLevelOfMaturity": [
            "ANIMAL_STUDY"
          ],
          "patentStatusHref": "https://example.com",
          "freedomToOperateCertification": "YES",
          "companyId": "1KlMnh9a"
        }
        """))
        .andExpect(status().isUnprocessableEntity())
        .andExpect(jsonPath("$.errors[0].name", is("patentStatusOtherInfo")))
        .andExpect(
            jsonPath(
                "$.errors[0].description",
                is("Patent Status Other Info only filled when the Patent Status is OTHER")));
  }

  @Test
  @WithRedesignUser(role = ROLE_OP_CO_USER)
  public void
      createIpMarketplace_Should_Fail_If_Patent_Status_Was_Not_Sent_And_patentStatusOtherInfo_Is_Not_Null()
          throws Exception {
    var companyApiId = testCompanyRef();
    var personEmail = "seller@seller.com";
    var person = testPerson(ROLE_OP_CO_USER, personEmail);
    var company = testIpMarketplaceCompany(person);
    company.setApiId(companyApiId);
    var companyMember = new CompanyMember(company, person, CompanyMemberStatus.ACTIVE);
    person.setMemberOf(Set.of(companyMember));
    when(companyRepository.findByApiId(companyApiId)).thenReturn(Optional.of(company));
    when(personRepository.findByEmail(PersonRef.of(personEmail), Expansion.MEMBER_OF))
        .thenReturn(Optional.of(person));
    mockMvc
        .perform(
            post("/ip-marketplace")
                .contentType(MediaType.APPLICATION_JSON)
                .content(
                    """
        {
          "email": "seller@seller.com",
          "name": "Marvelous Idea",
          "executiveSummary": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididun",
          "therapeuticNeedOrTrendsBeingAddressed": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididun",
          "technologyOverview": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididun",
          "licenseRestriction": true,
          "aboutLicenseRestriction": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididun",
          "preferredTerms": [
            "EQUITY"
          ],
          "associatedFilesOrMedia": [
            {
              "href": "https://example.com",
              "name": "report_url"
            }
          ],
          "patentStatusOtherInfo": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididun",
          "patentIssue": "2023-10-18T22:01:30.821Z",
          "patentGeographicValidity": [
            "US"
          ],
          "disease": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididun",
          "organOfFocus": ["ADRENAL_GLANDS"],
          "technologyType": [
            "MEDICAL_DEVICES"
          ],
          "speciality": [
            "ALLERGY_AND_IMMUNOLOGY"
          ],
          "sellerSummaryTechTransferApproach": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididun",
          "responsibleInventor": "John Smith",
          "technologyLevelOfMaturity": [
            "ANIMAL_STUDY"
          ],
          "patentStatusHref": "https://example.com",
          "freedomToOperateCertification": "YES",
          "companyId": "1KlMnh9a"
        }
        """))
        .andExpect(status().isUnprocessableEntity())
        .andExpect(jsonPath("$.errors[0].name", is("patentStatusOtherInfo")))
        .andExpect(
            jsonPath(
                "$.errors[0].description",
                is(
                    "Patent Status Other Info only filled when the Patent Status is sent and its value is OTHER")));
  }

  @Test
  @WithRedesignUser(role = ROLE_OP_CO_USER)
  public void
      createIpMarketplace_Should_Fail_If_Patent_Geography_Validity_Doesnt_Contains_Other_And_Patent_Geographic_Validity_Other_Is_Not_Null()
          throws Exception {
    var companyApiId = testCompanyRef();
    var personEmail = "seller@seller.com";
    var person = testPerson(ROLE_OP_CO_USER, personEmail);
    var company = testIpMarketplaceCompany(person);
    company.setApiId(companyApiId);
    var companyMember = new CompanyMember(company, person, CompanyMemberStatus.ACTIVE);
    person.setMemberOf(Set.of(companyMember));
    when(companyRepository.findByApiId(companyApiId)).thenReturn(Optional.of(company));
    when(personRepository.findByEmail(PersonRef.of(personEmail), Expansion.MEMBER_OF))
        .thenReturn(Optional.of(person));
    mockMvc
        .perform(
            post("/ip-marketplace")
                .contentType(MediaType.APPLICATION_JSON)
                .content(
                    """
        {
          "email": "seller@seller.com",
          "name": "Marvelous Idea",
          "executiveSummary": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididun",
          "therapeuticNeedOrTrendsBeingAddressed": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididun",
          "technologyOverview": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididun",
          "licenseRestriction": true,
          "aboutLicenseRestriction": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididun",
          "preferredTerms": [
            "EQUITY"
          ],
          "associatedFilesOrMedia": [
            {
              "href": "https://example.com",
              "name": "report_url"
            }
          ],
          "patentStatus": "PATENTED",
          "patentIssue": "2023-10-18T22:01:30.821Z",
          "patentGeographicValidity": [
            "US"
          ],
          "patentGeographicValidityOther": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididun",
          "disease": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididun",
          "organOfFocus": ["ADRENAL_GLANDS"],
          "technologyType": [
            "MEDICAL_DEVICES"
          ],
          "speciality": [
            "ALLERGY_AND_IMMUNOLOGY"
          ],
          "sellerSummaryTechTransferApproach": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididun",
          "responsibleInventor": "John Smith",
          "technologyLevelOfMaturity": [
            "ANIMAL_STUDY"
          ],
          "patentStatusHref": "https://example.com",
          "freedomToOperateCertification": "YES",
          "companyId": "1KlMnh9a"
        }
        """))
        .andExpect(status().isUnprocessableEntity())
        .andExpect(jsonPath("$.errors[0].name", is("patentGeographicValidityOther")))
        .andExpect(
            jsonPath(
                "$.errors[0].description",
                is(
                    "Patent Geographic Validity Other only filled when the Patent Geographic Validity contains in its values OTHER")));
  }

  @Test
  @WithRedesignUser(role = ROLE_OP_CO_USER)
  public void
      createIpMarketplace_Should_Fail_If_Preferred_Terms_Doesnt_Contains_Other_And_Preferred_Terms_Other_Is_Not_Null()
          throws Exception {
    var companyApiId = testCompanyRef();
    var personEmail = "seller@seller.com";
    var person = testPerson(ROLE_OP_CO_USER, personEmail);
    var company = testIpMarketplaceCompany(person);
    company.setApiId(companyApiId);
    var companyMember = new CompanyMember(company, person, CompanyMemberStatus.ACTIVE);
    person.setMemberOf(Set.of(companyMember));
    when(companyRepository.findByApiId(companyApiId)).thenReturn(Optional.of(company));
    when(personRepository.findByEmail(PersonRef.of(personEmail), Expansion.MEMBER_OF))
        .thenReturn(Optional.of(person));
    mockMvc
        .perform(
            post("/ip-marketplace")
                .contentType(MediaType.APPLICATION_JSON)
                .content(
                    """
              {
                "email": "seller@seller.com",
                "name": "Marvelous Idea",
                "executiveSummary": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididun",
                "therapeuticNeedOrTrendsBeingAddressed": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididun",
                "technologyOverview": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididun",
                "licenseRestriction": true,
                "aboutLicenseRestriction": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididun",
                "preferredTerms": [
                  "EQUITY"
                ],
                "preferredTermsOther" : "Lorem ipsum",
                "associatedFilesOrMedia": [
                  {
                    "href": "https://example.com",
                    "name": "report_url"
                  }
                ],
                "patentStatus": "PATENTED",
                "patentIssue": "2023-10-18T22:01:30.821Z",
                "patentGeographicValidity": [
                  "US"
                ],
                "disease": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididun",
                "organOfFocus": ["ADRENAL_GLANDS"],
                "technologyType": [
                  "MEDICAL_DEVICES"
                ],
                "speciality": [
                  "ALLERGY_AND_IMMUNOLOGY"
                ],
                "sellerSummaryTechTransferApproach": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididun",
                "responsibleInventor": "John Smith",
                "technologyLevelOfMaturity": [
                  "ANIMAL_STUDY"
                ],
                "patentStatusHref": "https://example.com",
                "freedomToOperateCertification": "YES",
                "companyId": "1KlMnh9a"
              }
              """))
        .andExpect(status().isUnprocessableEntity())
        .andExpect(jsonPath("$.errors[0].name", is("preferredTermsOther")))
        .andExpect(
            jsonPath(
                "$.errors[0].description",
                is(
                    "Preferred Terms Other only filled when the Preferred Terms contains in its values OTHER")));
  }

  @Test
  @WithRedesignUser(role = ROLE_OP_CO_USER)
  public void updateIpMarketplace() throws Exception {
    var personEmail = "seller@seller.com";
    var ipMarketplaceId = "iPMarketplaceId";
    var ipMarketplace = testIpMarketPlace(personEmail);
    when(ipMarketplaceRepository.findByApiId(IpMarketplaceRef.of(ipMarketplaceId)))
        .thenReturn(Optional.of(ipMarketplace));
    when(personRepository.findByEmail(PersonRef.of(personEmail), Expansion.MEMBER_OF))
        .thenReturn(Optional.of(ipMarketplace.getIpMarketplaceSeller().getSeller()));
    mockMvc
        .perform(
            put("/ip-marketplace/{ipMarketplaceId}", ipMarketplaceId)
                .contentType(MediaType.APPLICATION_JSON)
                .content(testPayloadIpMarketPlaceForUpdate()))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.organization.name", is("Springtide")))
        .andExpect(jsonPath("$.organization.activityType.value", is("ENTERPRISE_SELLER")))
        .andExpect(jsonPath("$.organization.organizationType.value", is("IDN_HEALTH_SYSTEM")))
        .andExpect(jsonPath("$.organization.region.value", is("NORTHEAST")))
        .andExpect(jsonPath("$.owner.email", is("seller@seller.com")))
        .andDo(
            document(
                "update",
                requestFields(
                    emailField(),
                    nameField(),
                    executiveSummaryField(),
                    therapeuticNeedOrTrendsBeingAddressedField(),
                    technologyOverviewField(),
                    licenseRestrictionField(),
                    aboutLicenseRestrictionField(),
                    preferredTermsField(),
                    associatedFilesOrMediaField(),
                    patentStatusField(),
                    patentIssueField(),
                    patentGeographicValidityField(),
                    diseaseField(),
                    organOfFocusField(),
                    technologyTypeField(),
                    specialityField(),
                    sellerSummaryTechTransferApproachField(),
                    responsibleInventorField(),
                    technologyLevelOfMaturityField(),
                    patentStatusHrefField(),
                    freedomToOperateCertificationField()),
                responseFields(
                    linksField(),
                    organizationField(),
                    ownerField(),
                    nameField(),
                    executiveSummaryField(),
                    therapeuticNeedOrTrendsBeingAddressedField(),
                    technologyOverviewField(),
                    licenseRestrictionField(),
                    aboutLicenseRestrictionField(),
                    preferredTermsField(),
                    associatedFilesOrMediaField(),
                    patentStatusFieldSE(),
                    patentGeographicValidityField(),
                    diseaseField(),
                    organOfFocusField(),
                    specialityField(),
                    sellerSummaryTechTransferApproachField(),
                    responsibleInventorField(),
                    technologyLevelOfMaturityField(),
                    patentStatusHrefField(),
                    freedomToOperateCertificationFieldSE(),
                    organOfFocusFieldSE(),
                    technologyTypeField(),
                    legalPatentabilityAssessmentAvailableField(),
                    copyrightedField(),
                    idField(),
                    viewedField(),
                    statusFieldSE())));
  }

  @Test
  @WithRedesignUser(role = ROLE_OP_CO_USER, memberOf = "buyerCompanyId", email = "buyer@buyer.com")
  public void updateIpMarketplace_Should_Fail_If_Requester_Is_A_Buyer() throws Exception {
    var personEmail = "seller@seller.com";
    var ipMarketplaceId = "iPMarketplaceId";
    var ipMarketplace = testIpMarketPlace(personEmail);
    when(ipMarketplaceRepository.findByApiId(IpMarketplaceRef.of(ipMarketplaceId)))
        .thenReturn(Optional.of(ipMarketplace));
    when(personRepository.findByEmail(PersonRef.of(personEmail), Expansion.MEMBER_OF))
        .thenReturn(Optional.of(ipMarketplace.getIpMarketplaceSeller().getSeller()));
    when(companyRepository.existsByCompanyIpMarketplaceActivityTypeAndApiIdIn(
            CompanyIPMarketplaceType.ENTERPRISE_BUYER, Set.of(CompanyRef.of("buyerCompanyId"))))
        .thenReturn(true);
    mockMvc
        .perform(
            put("/ip-marketplace/{ipMarketplaceId}", ipMarketplaceId)
                .contentType(MediaType.APPLICATION_JSON)
                .content(testPayloadIpMarketPlaceForUpdate()))
        .andExpect(status().isForbidden())
        .andExpect(
            jsonPath(
                "$.message", is("Buyers or RH users can't update IP records for the marketplace")));
  }

  @Test
  @WithRedesignUser(role = ROLE_OP_CO_USER, memberOf = "1KlMnh9a", email = "seller2@seller.com")
  public void
      updateIpMarketplace_Should_Fail_If_Requester_Is_A_Seller_And_Not_The_Owner_Of_The_Ip_Record()
          throws Exception {
    var personEmail = "seller@seller.com";
    var ipMarketplaceId = "iPMarketplaceId";
    var ipMarketplace = testIpMarketPlace(personEmail);
    when(ipMarketplaceRepository.findByApiId(IpMarketplaceRef.of(ipMarketplaceId)))
        .thenReturn(Optional.of(ipMarketplace));
    when(personRepository.findByEmail(PersonRef.of(personEmail), Expansion.MEMBER_OF))
        .thenReturn(Optional.of(ipMarketplace.getIpMarketplaceSeller().getSeller()));
    when(companyRepository.existsByCompanyIpMarketplaceActivityTypeAndApiIdIn(
            CompanyIPMarketplaceType.ENTERPRISE_SELLER, Set.of(CompanyRef.of("1KlMnh9a"))))
        .thenReturn(true);
    mockMvc
        .perform(
            put("/ip-marketplace/{ipMarketplaceId}", ipMarketplaceId)
                .contentType(MediaType.APPLICATION_JSON)
                .content(testPayloadIpMarketPlaceForUpdate()))
        .andExpect(status().isForbidden())
        .andExpect(jsonPath("$.message", is("Only owners of the IP record can edit it.")));
  }

  @Test
  @WithRedesignUser(role = ROLE_OP_CO_USER)
  public void updateIpMarketplace_Should_Fail_404() throws Exception {
    var ipMarketplaceId = "iPMarketplaceId";
    mockMvc
        .perform(
            put("/ip-marketplace/{ipMarketplaceId}", ipMarketplaceId)
                .contentType(MediaType.APPLICATION_JSON)
                .content(testPayloadIpMarketPlaceForUpdate()))
        .andExpect(status().isNotFound());
  }

  @Test
  @WithRedesignUser(
      role = RoleAuthority.ROLE_OP_CO_USER,
      email = "seller@seller.com",
      memberOf = "1KlMnh9a")
  public void testQuery_returnsResults() throws Exception {
    var sellerEmail = "seller@seller.com";
    var person = testPerson(ROLE_OP_CO_USER, sellerEmail);
    var company = testIpMarketplaceCompany(person);
    var companyMember = new CompanyMember(company, person, CompanyMemberStatus.ACTIVE);
    person.setMemberOf(Set.of(companyMember));
    var ipMarketplace = testIpMarketPlace(sellerEmail);
    when(companyRepository.findByApiId(testCompanyRef())).thenReturn(Optional.of(company));
    when(companyRepository.existsByCompanyIpMarketplaceActivityTypeAndApiIdIn(
            CompanyIPMarketplaceType.ENTERPRISE_SELLER, Set.of(testCompanyRef())))
        .thenReturn(true);
    when(ipMarketplaceRepository.findByApiId(IpMarketplaceRef.of("iPMarketplaceId")))
        .thenReturn(Optional.of(ipMarketplace));
    var sanitizedFilters =
        List.of(
            SearchFilter.of("organ_of_focus", "ADRENAL_GLANDS"),
            SearchFilter.of("company_id", testCompanyRef().getApiId()));
    var pageable = PageRequest.of(0, 20, Sort.by(IpMarketplaceSearchDoc.NAME));
    var command =
        SearchCommand.builder()
            .index(SearchIndex.IP_MARKETPLACE)
            .query("Text")
            .highlight(false)
            .filters(sanitizedFilters)
            .fields(IpMarketplaceService.FIELDS_TO_SEARCH)
            .searchAsYouType(true)
            .build();
    when(searchClient.search(command, pageable, IpMarketplaceSearchDoc.class))
        .thenReturn(
            new PageImpl<>(
                List.of(SearchResult.of(testIpMarketplaceCallSearchDoc(), null, "iPMarketplaceId")),
                pageable,
                1));
    mockMvc
        .perform(
            get(
                "/ip-marketplace?page=0&size=20&sort=name,asc&filter=organOfFocus,ADRENAL_GLANDS&q=Text"))
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
                        organizationField(),
                        ownerField(),
                        nameField(),
                        executiveSummaryField(),
                        therapeuticNeedOrTrendsBeingAddressedField(),
                        technologyOverviewField(),
                        licenseRestrictionField(),
                        aboutLicenseRestrictionField(),
                        preferredTermsField(),
                        associatedFilesOrMediaField(),
                        patentStatusFieldSE(),
                        patentGeographicValidityField(),
                        diseaseField(),
                        organOfFocusField(),
                        specialityField(),
                        sellerSummaryTechTransferApproachField(),
                        responsibleInventorField(),
                        technologyLevelOfMaturityField(),
                        patentStatusHrefField(),
                        freedomToOperateCertificationFieldSE(),
                        organOfFocusFieldSE(),
                        technologyTypeField(),
                        idField(),
                        legalPatentabilityAssessmentAvailableField(),
                        copyrightedField(),
                        statusFieldSE(),
                        viewedField(),
                        linksField())));
  }

  @Test
  @WithRedesignUser(
      role = RoleAuthority.ROLE_OP_CO_USER,
      email = "buyer@buyer.com",
      memberOf = "buyerCompanyId")
  public void
      testQuery_returnsResults_With_Request_Contact_Info_If_It_Is_A_Buyer_And_Those_Are_Its_Requests()
          throws Exception {
    var sellerEmail = "seller@seller.com";
    var buyerEmail = "buyer@buyer.com";
    var buyerEmail2 = "buyer2@buyer.com";
    var buyerCompanyId = "buyerCompanyId";
    var person = testPerson(ROLE_OP_CO_USER, sellerEmail);
    var buyerPerson = testPerson(ROLE_OP_CO_USER, buyerEmail);
    var buyerPerson2 = testPerson(ROLE_OP_CO_USER, buyerEmail2);
    var company = testIpMarketplaceCompany(person);
    var company2 = testIpMarketplaceCompany(buyerPerson);
    company2.setApiId(CompanyRef.of(buyerCompanyId));
    company2.getCompanyIpMarketplace().setActivityType(CompanyIPMarketplaceType.ENTERPRISE_BUYER);
    var companyMember = new CompanyMember(company, person, CompanyMemberStatus.ACTIVE);
    var companyMember2 = new CompanyMember(company2, buyerPerson, CompanyMemberStatus.ACTIVE);
    person.setMemberOf(Set.of(companyMember));
    buyerPerson.setMemberOf(Set.of(companyMember2));
    buyerPerson2.setMemberOf(Set.of(companyMember2));
    var ipMarketplace = testIpMarketPlace(sellerEmail);
    testIpMarketplaceTrack(ipMarketplace, buyerPerson);
    testIpMarketplaceTrack(ipMarketplace, buyerPerson2);
    when(companyRepository.findByApiId(testCompanyRef())).thenReturn(Optional.of(company));
    when(companyRepository.existsByCompanyIpMarketplaceActivityTypeAndApiIdIn(
            CompanyIPMarketplaceType.ENTERPRISE_SELLER, Set.of(testCompanyRef())))
        .thenReturn(false);
    when(companyRepository.existsByCompanyIpMarketplaceActivityTypeAndApiIdIn(
            CompanyIPMarketplaceType.ENTERPRISE_BUYER, Set.of(CompanyRef.of(buyerCompanyId))))
        .thenReturn(true);
    when(ipMarketplaceRepository.findByApiId(IpMarketplaceRef.of("iPMarketplaceId")))
        .thenReturn(Optional.of(ipMarketplace));
    when(personRepository.findByEmail(PersonRef.of(sellerEmail))).thenReturn(Optional.of(person));
    when(personRepository.findByEmail(PersonRef.of(buyerEmail)))
        .thenReturn(Optional.of(buyerPerson));
    var sanitizedFilters = List.of(SearchFilter.of("organ_of_focus", "ADRENAL_GLANDS"));
    var pageable = PageRequest.of(0, 20, Sort.by(IpMarketplaceSearchDoc.NAME));
    var command =
        SearchCommand.builder()
            .index(SearchIndex.IP_MARKETPLACE)
            .query("Text")
            .highlight(false)
            .filters(sanitizedFilters)
            .fields(IpMarketplaceService.FIELDS_TO_SEARCH)
            .searchAsYouType(true)
            .build();
    when(searchClient.search(command, pageable, IpMarketplaceSearchDoc.class))
        .thenReturn(
            new PageImpl<>(
                List.of(SearchResult.of(testIpMarketplaceCallSearchDoc(), null, "iPMarketplaceId")),
                pageable,
                1));
    mockMvc
        .perform(
            get(
                "/ip-marketplace?page=0&size=20&sort=name,asc&filter=organOfFocus,ADRENAL_GLANDS&q=Text&expand=requests"))
        .andExpect(status().isOk())
        .andDo(
            document(
                "query-with-request-contact-info",
                queryParameters(
                    filterQueryParameter(),
                    pageQueryParameter(),
                    qQueryParameter(),
                    sizeQueryParameter(),
                    expandQueryParameter(),
                    sortQueryParameter()),
                responseFields(linksField())
                    .andWithPrefix("page.", pageFields())
                    .andWithPrefix(
                        "content[].",
                        organizationField(),
                        nameField(),
                        executiveSummaryField(),
                        therapeuticNeedOrTrendsBeingAddressedField(),
                        technologyOverviewField(),
                        licenseRestrictionField(),
                        aboutLicenseRestrictionField(),
                        preferredTermsField(),
                        associatedFilesOrMediaField(),
                        patentStatusFieldSE(),
                        patentGeographicValidityField(),
                        diseaseField(),
                        organOfFocusField(),
                        specialityField(),
                        sellerSummaryTechTransferApproachField(),
                        responsibleInventorField(),
                        technologyLevelOfMaturityField(),
                        patentStatusHrefField(),
                        freedomToOperateCertificationFieldSE(),
                        organOfFocusFieldSE(),
                        technologyTypeField(),
                        requestContactInfoField(),
                        idField(),
                        legalPatentabilityAssessmentAvailableField(),
                        copyrightedField(),
                        statusFieldSE(),
                        viewedField(),
                        linksField())));
  }

  @Test
  @WithRedesignUser(
      role = RoleAuthority.ROLE_OP_CO_USER,
      email = "seller@seller.com",
      memberOf = "1KlMnh9a")
  public void testQuery_returnsResults_With_Metrics_If_It_Is_A_Seller() throws Exception {
    var sellerEmail = "seller@seller.com";
    var buyerEmail = "buyer@buyer.com";
    var buyerCompanyId = "buyerCompanyId";
    var person = testPerson(ROLE_OP_CO_USER, sellerEmail);
    var buyerPerson = testPerson(ROLE_OP_CO_USER, buyerEmail);
    var company = testIpMarketplaceCompany(person);
    var company2 = testIpMarketplaceCompany(buyerPerson);
    company2.setApiId(CompanyRef.of(buyerCompanyId));
    company2.getCompanyIpMarketplace().setActivityType(CompanyIPMarketplaceType.ENTERPRISE_BUYER);
    var companyMember = new CompanyMember(company, person, CompanyMemberStatus.ACTIVE);
    var companyMember2 = new CompanyMember(company2, buyerPerson, CompanyMemberStatus.ACTIVE);
    person.setMemberOf(Set.of(companyMember));
    buyerPerson.setMemberOf(Set.of(companyMember2));
    var ipMarketplace = testIpMarketPlace(sellerEmail);
    testIpMarketplaceTrack(ipMarketplace, buyerPerson);
    when(companyRepository.findByApiId(testCompanyRef())).thenReturn(Optional.of(company));
    when(companyRepository.existsByCompanyIpMarketplaceActivityTypeAndApiIdIn(
            CompanyIPMarketplaceType.ENTERPRISE_SELLER, Set.of(testCompanyRef())))
        .thenReturn(true);
    when(companyRepository.existsByCompanyIpMarketplaceActivityTypeAndApiIdIn(
            CompanyIPMarketplaceType.ENTERPRISE_BUYER, Set.of(CompanyRef.of(buyerCompanyId))))
        .thenReturn(false);
    when(ipMarketplaceRepository.findByApiId(IpMarketplaceRef.of("iPMarketplaceId")))
        .thenReturn(Optional.of(ipMarketplace));
    when(personRepository.findByEmail(PersonRef.of(sellerEmail))).thenReturn(Optional.of(person));
    when(personRepository.findByEmail(PersonRef.of(buyerEmail)))
        .thenReturn(Optional.of(buyerPerson));
    var sanitizedFilters =
        List.of(
            SearchFilter.of("organ_of_focus", "ADRENAL_GLANDS"),
            SearchFilter.of("company_id", testCompanyRef().getApiId()));
    var pageable = PageRequest.of(0, 20, Sort.by(IpMarketplaceSearchDoc.NAME));
    var command =
        SearchCommand.builder()
            .index(SearchIndex.IP_MARKETPLACE)
            .query("Text")
            .highlight(false)
            .filters(sanitizedFilters)
            .fields(IpMarketplaceService.FIELDS_TO_SEARCH)
            .searchAsYouType(true)
            .build();
    when(searchClient.search(command, pageable, IpMarketplaceSearchDoc.class))
        .thenReturn(
            new PageImpl<>(
                List.of(SearchResult.of(testIpMarketplaceCallSearchDoc(), null, "iPMarketplaceId")),
                pageable,
                1));
    mockMvc
        .perform(
            get(
                "/ip-marketplace?page=0&size=20&sort=name,asc&filter=organOfFocus,ADRENAL_GLANDS&q=Text&expand=metrics"))
        .andExpect(status().isOk())
        .andDo(
            document(
                "query-with-metrics",
                queryParameters(
                    filterQueryParameter(),
                    pageQueryParameter(),
                    qQueryParameter(),
                    sizeQueryParameter(),
                    expandQueryParameter(),
                    sortQueryParameter()),
                responseFields(linksField())
                    .andWithPrefix("page.", pageFields())
                    .andWithPrefix(
                        "content[].",
                        organizationField(),
                        ownerField(),
                        nameField(),
                        executiveSummaryField(),
                        therapeuticNeedOrTrendsBeingAddressedField(),
                        technologyOverviewField(),
                        licenseRestrictionField(),
                        aboutLicenseRestrictionField(),
                        preferredTermsField(),
                        associatedFilesOrMediaField(),
                        patentStatusFieldSE(),
                        patentGeographicValidityField(),
                        diseaseField(),
                        organOfFocusField(),
                        specialityField(),
                        sellerSummaryTechTransferApproachField(),
                        responsibleInventorField(),
                        technologyLevelOfMaturityField(),
                        patentStatusHrefField(),
                        freedomToOperateCertificationFieldSE(),
                        organOfFocusFieldSE(),
                        technologyTypeField(),
                        metricsField(),
                        idField(),
                        legalPatentabilityAssessmentAvailableField(),
                        copyrightedField(),
                        statusFieldSE(),
                        viewedField(),
                        linksField())));
  }

  @Test
  @WithRedesignUser(
      role = RoleAuthority.ROLE_OP_CO_USER,
      email = "buyer@buyer.com",
      memberOf = "buyerCompanyId")
  public void
      testQuery_returnsResults_With_Request_Contact_Info_Should_Fail_If_Expand_Not_Equals_To_Requests()
          throws Exception {
    var sellerEmail = "seller@seller.com";
    var buyerEmail = "buyer@buyer.com";
    var buyerCompanyId = "buyerCompanyId";
    var person = testPerson(ROLE_OP_CO_USER, sellerEmail);
    var buyerPerson = testPerson(ROLE_OP_CO_USER, buyerEmail);
    var company = testIpMarketplaceCompany(person);
    var company2 = testIpMarketplaceCompany(buyerPerson);
    company2.setApiId(CompanyRef.of(buyerCompanyId));
    company2.getCompanyIpMarketplace().setActivityType(CompanyIPMarketplaceType.ENTERPRISE_BUYER);
    var companyMember = new CompanyMember(company, person, CompanyMemberStatus.ACTIVE);
    var companyMember2 = new CompanyMember(company2, buyerPerson, CompanyMemberStatus.ACTIVE);
    person.setMemberOf(Set.of(companyMember));
    buyerPerson.setMemberOf(Set.of(companyMember2));
    var ipMarketplace = testIpMarketPlace(sellerEmail);
    testIpMarketplaceTrack(ipMarketplace, buyerPerson);
    when(companyRepository.findByApiId(testCompanyRef())).thenReturn(Optional.of(company));
    when(companyRepository.existsByCompanyIpMarketplaceActivityTypeAndApiIdIn(
            CompanyIPMarketplaceType.ENTERPRISE_SELLER, Set.of(testCompanyRef())))
        .thenReturn(false);
    when(companyRepository.existsByCompanyIpMarketplaceActivityTypeAndApiIdIn(
            CompanyIPMarketplaceType.ENTERPRISE_BUYER, Set.of(CompanyRef.of(buyerCompanyId))))
        .thenReturn(true);
    when(ipMarketplaceRepository.findByApiId(IpMarketplaceRef.of("iPMarketplaceId")))
        .thenReturn(Optional.of(ipMarketplace));
    when(personRepository.findByEmail(PersonRef.of(sellerEmail))).thenReturn(Optional.of(person));
    when(personRepository.findByEmail(PersonRef.of(buyerEmail)))
        .thenReturn(Optional.of(buyerPerson));
    var sanitizedFilters = List.of(SearchFilter.of("organ_of_focus", "ADRENAL_GLANDS"));
    var pageable = PageRequest.of(0, 20, Sort.by(IpMarketplaceSearchDoc.NAME));
    var command =
        SearchCommand.builder()
            .index(SearchIndex.IP_MARKETPLACE)
            .query("Text")
            .highlight(false)
            .filters(sanitizedFilters)
            .fields(IpMarketplaceService.FIELDS_TO_SEARCH)
            .build();
    when(searchClient.search(command, pageable, IpMarketplaceSearchDoc.class))
        .thenReturn(
            new PageImpl<>(
                List.of(SearchResult.of(testIpMarketplaceCallSearchDoc(), null, "iPMarketplaceId")),
                pageable,
                1));
    mockMvc
        .perform(
            get(
                "/ip-marketplace?page=0&size=20&sort=name,asc&filter=organOfFocus,ADRENAL_GLANDS&q=Text&expand=members"))
        .andExpect(status().isUnprocessableEntity())
        .andExpect(jsonPath("$.errors[0].name", is("expand")))
        .andExpect(
            jsonPath(
                "$.errors[0].description",
                is("The only expansion allowed for a Buyer or Admin is 'requests'")));
  }

  @Test
  @WithRedesignUser(
      role = RoleAuthority.ROLE_OP_CO_USER,
      email = "seller@seller.com",
      memberOf = "1KlMnh9a")
  public void testGet_One() throws Exception {
    var sellerEmail = "seller@seller.com";
    var person = testPerson(ROLE_OP_CO_USER, sellerEmail);
    var company = testIpMarketplaceCompany(person);
    var companyMember = new CompanyMember(company, person, CompanyMemberStatus.ACTIVE);
    person.setMemberOf(Set.of(companyMember));
    var ipMarketplace = testIpMarketPlace(sellerEmail);
    when(companyRepository.findByApiId(testCompanyRef())).thenReturn(Optional.of(company));
    when(companyRepository.existsByCompanyIpMarketplaceActivityTypeAndApiIdIn(
            CompanyIPMarketplaceType.ENTERPRISE_SELLER, Set.of(testCompanyRef())))
        .thenReturn(true);
    when(ipMarketplaceRepository.findByApiId(IpMarketplaceRef.of("iPMarketplaceId")))
        .thenReturn(Optional.of(ipMarketplace));
    mockMvc
        .perform(get("/ip-marketplace/{iPMarketplaceId}", "iPMarketplaceId"))
        .andExpect(status().isOk())
        .andDo(
            document(
                "get-ip-marketplace-by-id",
                responseFields(
                    organizationField(),
                    ownerField(),
                    nameField(),
                    executiveSummaryField(),
                    therapeuticNeedOrTrendsBeingAddressedField(),
                    technologyOverviewField(),
                    licenseRestrictionField(),
                    aboutLicenseRestrictionField(),
                    preferredTermsField(),
                    associatedFilesOrMediaField(),
                    patentStatusFieldSE(),
                    patentGeographicValidityField(),
                    diseaseField(),
                    organOfFocusField(),
                    specialityField(),
                    sellerSummaryTechTransferApproachField(),
                    responsibleInventorField(),
                    technologyLevelOfMaturityField(),
                    patentStatusHrefField(),
                    freedomToOperateCertificationFieldSE(),
                    organOfFocusFieldSE(),
                    technologyTypeField(),
                    idField(),
                    legalPatentabilityAssessmentAvailableField(),
                    copyrightedField(),
                    statusFieldSE(),
                    viewedField(),
                    linksField())));
  }

  @Test
  @WithRedesignUser(role = RoleAuthority.ROLE_OP_CO_USER, email = "seller@seller.com")
  public void testGet_One_Should_Fail_If_Not_A_Seller_Or_Buyer() throws Exception {
    var sellerEmail = "seller@seller.com";
    var person = testPerson(ROLE_OP_CO_USER, sellerEmail);
    var company = testIpMarketplaceCompany(person);
    var companyMember = new CompanyMember(company, person, CompanyMemberStatus.ACTIVE);
    person.setMemberOf(Set.of(companyMember));
    var ipMarketplace = testIpMarketPlace(sellerEmail);
    when(companyRepository.findByApiId(testCompanyRef())).thenReturn(Optional.of(company));
    when(companyRepository.existsByCompanyIpMarketplaceActivityTypeAndApiIdIn(
            CompanyIPMarketplaceType.ENTERPRISE_SELLER, Set.of(testCompanyRef())))
        .thenReturn(true);
    when(ipMarketplaceRepository.findByApiId(IpMarketplaceRef.of("iPMarketplaceId")))
        .thenReturn(Optional.of(ipMarketplace));
    mockMvc
        .perform(get("/ip-marketplace/{iPMarketplaceId}", "iPMarketplaceId"))
        .andExpect(status().isForbidden())
        .andExpect(
            jsonPath(
                "$.message",
                is(
                    "Only members from ENTERPRISE_SELLER and ENTERPRISE_BUYER companies can query the IP Marketplace info")));
  }

  @Test
  @WithRedesignUser(
      role = RoleAuthority.ROLE_OP_CO_USER,
      email = "buyer@buyer.com",
      memberOf = "buyerCompanyId")
  public void testGet_One_Should_Call_Metrics_Only_If_Is_A_Buyer() throws Exception {
    var sellerEmail = "seller@seller.com";
    var buyerEmail = "buyer@buyer.com";
    var buyerCompanyId = "buyerCompanyId";
    var sellerPerson = testPerson(ROLE_OP_CO_USER, sellerEmail);
    var buyerPerson = testPerson(ROLE_OP_CO_USER, buyerEmail);
    var company = testIpMarketplaceCompany(sellerPerson);
    var company2 = testIpMarketplaceCompany(buyerPerson);
    company2.setApiId(CompanyRef.of(buyerCompanyId));

    company2.getCompanyIpMarketplace().setActivityType(CompanyIPMarketplaceType.ENTERPRISE_BUYER);
    var companyMember = new CompanyMember(company, sellerPerson, CompanyMemberStatus.ACTIVE);
    var companyMember2 = new CompanyMember(company2, buyerPerson, CompanyMemberStatus.ACTIVE);
    sellerPerson.setMemberOf(Set.of(companyMember));
    buyerPerson.setMemberOf(Set.of(companyMember2));
    var ipMarketplace = testIpMarketPlace(sellerEmail);
    when(companyRepository.findByApiId(testCompanyRef())).thenReturn(Optional.of(company));
    when(companyRepository.existsByCompanyIpMarketplaceActivityTypeAndApiIdIn(
            CompanyIPMarketplaceType.ENTERPRISE_SELLER, Set.of(testCompanyRef())))
        .thenReturn(false);
    when(companyRepository.existsByCompanyIpMarketplaceActivityTypeAndApiIdIn(
            CompanyIPMarketplaceType.ENTERPRISE_BUYER, Set.of(CompanyRef.of(buyerCompanyId))))
        .thenReturn(true);
    when(ipMarketplaceRepository.findByApiId(IpMarketplaceRef.of("iPMarketplaceId")))
        .thenReturn(Optional.of(ipMarketplace));
    when(personRepository.findByEmail(PersonRef.of(sellerEmail)))
        .thenReturn(Optional.of(sellerPerson));
    when(personRepository.findByEmail(PersonRef.of(buyerEmail)))
        .thenReturn(Optional.of(buyerPerson));
    when(ipMarketplaceRepository.findByApiId(IpMarketplaceRef.of("iPMarketplaceId")))
        .thenReturn(Optional.of(ipMarketplace));
    try (MockedStatic<RhCustomCounter> mockStatic = Mockito.mockStatic(RhCustomCounter.class)) {
      RhCustomCounter.increment(anyString(), anyString(), any());
      mockMvc
          .perform(get("/ip-marketplace/{iPMarketplaceId}", "iPMarketplaceId"))
          .andExpect(status().isOk());
      mockStatic.verify(
          () -> RhCustomCounter.increment(anyString(), anyString(), any()), atLeast(1));
    }
  }

  @Test
  @WithRedesignUser(
      role = RoleAuthority.ROLE_OP_CO_USER,
      email = "seller@seller.com",
      memberOf = "1KlMnh9a")
  public void testGet_One_With_Metrics_And_Requests_Only_If_Requester_Is_Seller() throws Exception {
    var sellerEmail = "seller@seller.com";
    var person = testPerson(ROLE_OP_CO_USER, sellerEmail);
    var company = testIpMarketplaceCompany(person);
    var companyMember = new CompanyMember(company, person, CompanyMemberStatus.ACTIVE);
    person.setMemberOf(Set.of(companyMember));
    var ipMarketplace = testIpMarketPlace(sellerEmail);
    when(companyRepository.findByApiId(testCompanyRef())).thenReturn(Optional.of(company));
    when(companyRepository.existsByCompanyIpMarketplaceActivityTypeAndApiIdIn(
            CompanyIPMarketplaceType.ENTERPRISE_SELLER, Set.of(testCompanyRef())))
        .thenReturn(true);
    when(ipMarketplaceRepository.findByApiId(IpMarketplaceRef.of("iPMarketplaceId")))
        .thenReturn(Optional.of(ipMarketplace));
    mockMvc
        .perform(
            get(
                "/ip-marketplace/{iPMarketplaceId}?expand=metrics&expand=requests",
                "iPMarketplaceId"))
        .andExpect(status().isOk())
        .andDo(
            document(
                "get-ip-marketplace-by-id-with-metrics-and-requests",
                queryParameters(expandQueryParameter()),
                responseFields(
                    organizationField(),
                    ownerField(),
                    nameField(),
                    executiveSummaryField(),
                    therapeuticNeedOrTrendsBeingAddressedField(),
                    technologyOverviewField(),
                    licenseRestrictionField(),
                    aboutLicenseRestrictionField(),
                    preferredTermsField(),
                    associatedFilesOrMediaField(),
                    patentStatusFieldSE(),
                    patentGeographicValidityField(),
                    diseaseField(),
                    organOfFocusField(),
                    specialityField(),
                    sellerSummaryTechTransferApproachField(),
                    responsibleInventorField(),
                    technologyLevelOfMaturityField(),
                    patentStatusHrefField(),
                    freedomToOperateCertificationFieldSE(),
                    organOfFocusFieldSE(),
                    technologyTypeField(),
                    idField(),
                    metricsField(),
                    copyrightedField(),
                    legalPatentabilityAssessmentAvailableField(),
                    requestContactInfoField(),
                    statusFieldSE(),
                    viewedField(),
                    linksField())));
  }

  @Test
  @WithRedesignUser(
      role = RoleAuthority.ROLE_OP_CO_USER,
      email = "buyer@buyer.com",
      memberOf = "buyerCompanyId")
  public void testGet_One_Should_Fail_If_Metrics_Is_Requested_And_Requester_Is_Not_A_Seller()
      throws Exception {
    var sellerEmail = "seller@seller.com";
    var buyerEmail = "buyer@buyer.com";
    var buyerCompanyId = "buyerCompanyId";
    var sellerPerson = testPerson(ROLE_OP_CO_USER, sellerEmail);
    var buyerPerson = testPerson(ROLE_OP_CO_USER, buyerEmail);
    var company = testIpMarketplaceCompany(sellerPerson);
    var company2 = testIpMarketplaceCompany(buyerPerson);
    company2.setApiId(CompanyRef.of(buyerCompanyId));

    company2.getCompanyIpMarketplace().setActivityType(CompanyIPMarketplaceType.ENTERPRISE_BUYER);
    var companyMember = new CompanyMember(company, sellerPerson, CompanyMemberStatus.ACTIVE);
    var companyMember2 = new CompanyMember(company2, buyerPerson, CompanyMemberStatus.ACTIVE);
    sellerPerson.setMemberOf(Set.of(companyMember));
    buyerPerson.setMemberOf(Set.of(companyMember2));
    var ipMarketplace = testIpMarketPlace(sellerEmail);
    when(companyRepository.findByApiId(testCompanyRef())).thenReturn(Optional.of(company));
    when(companyRepository.existsByCompanyIpMarketplaceActivityTypeAndApiIdIn(
            CompanyIPMarketplaceType.ENTERPRISE_SELLER, Set.of(testCompanyRef())))
        .thenReturn(false);
    when(companyRepository.existsByCompanyIpMarketplaceActivityTypeAndApiIdIn(
            CompanyIPMarketplaceType.ENTERPRISE_BUYER, Set.of(CompanyRef.of(buyerCompanyId))))
        .thenReturn(true);
    when(ipMarketplaceRepository.findByApiId(IpMarketplaceRef.of("iPMarketplaceId")))
        .thenReturn(Optional.of(ipMarketplace));
    when(personRepository.findByEmail(PersonRef.of(sellerEmail)))
        .thenReturn(Optional.of(sellerPerson));
    when(personRepository.findByEmail(PersonRef.of(buyerEmail)))
        .thenReturn(Optional.of(buyerPerson));
    when(ipMarketplaceRepository.findByApiId(IpMarketplaceRef.of("iPMarketplaceId")))
        .thenReturn(Optional.of(ipMarketplace));
    mockMvc
        .perform(get("/ip-marketplace/{iPMarketplaceId}?expand=metrics", "iPMarketplaceId"))
        .andExpect(status().isUnprocessableEntity())
        .andExpect(
            jsonPath(
                "$.errors[0].description",
                is("The only expansion allowed for a Buyer or Admin is 'requests'")));
  }

  @Test
  @WithRedesignUser(
      role = RoleAuthority.ROLE_OP_CO_USER,
      email = "seller@seller.com",
      memberOf = "1KlMnh9a")
  public void testGet_One_Should_Fail_If_Requester_Is_Seller_And_Expand_Different_Of_Metrics()
      throws Exception {
    var sellerEmail = "seller@seller.com";
    var person = testPerson(ROLE_OP_CO_USER, sellerEmail);
    var company = testIpMarketplaceCompany(person);
    var companyMember = new CompanyMember(company, person, CompanyMemberStatus.ACTIVE);
    person.setMemberOf(Set.of(companyMember));
    var ipMarketplace = testIpMarketPlace(sellerEmail);
    when(companyRepository.findByApiId(testCompanyRef())).thenReturn(Optional.of(company));
    when(companyRepository.existsByCompanyIpMarketplaceActivityTypeAndApiIdIn(
            CompanyIPMarketplaceType.ENTERPRISE_SELLER, Set.of(testCompanyRef())))
        .thenReturn(true);
    when(ipMarketplaceRepository.findByApiId(IpMarketplaceRef.of("iPMarketplaceId")))
        .thenReturn(Optional.of(ipMarketplace));
    mockMvc
        .perform(get("/ip-marketplace/{iPMarketplaceId}?expand=members", "iPMarketplaceId"))
        .andExpect(status().isUnprocessableEntity())
        .andExpect(
            jsonPath(
                "$.errors[0].description",
                is("A Seller can only expand only 'metrics' and 'requests'")));
  }

  @Test
  @WithRedesignUser(role = RoleAuthority.ROLE_OP_CO_USER, email = "seller@seller.com")
  public void testQuery_returnsResults_Should_Fail_If_Not_A_Seller_Buyer_Or_Admin()
      throws Exception {
    var sellerEmail = "seller@seller.com";
    var person = testPerson(ROLE_OP_CO_USER, sellerEmail);
    var company = testIpMarketplaceCompany(person);
    var companyMember = new CompanyMember(company, person, CompanyMemberStatus.ACTIVE);
    person.setMemberOf(Set.of(companyMember));
    var ipMarketplace = testIpMarketPlace(sellerEmail);
    when(companyRepository.findByApiId(testCompanyRef())).thenReturn(Optional.of(company));
    when(ipMarketplaceRepository.findByApiId(IpMarketplaceRef.of("iPMarketplaceId")))
        .thenReturn(Optional.of(ipMarketplace));
    var sanitizedFilters =
        List.of(
            SearchFilter.of("organ_of_focus", "ADRENAL_GLANDS"),
            SearchFilter.of("company_id", testCompanyRef().getApiId()));
    var pageable = PageRequest.of(0, 20, Sort.by(IpMarketplaceSearchDoc.NAME));
    var command =
        SearchCommand.builder()
            .index(SearchIndex.IP_MARKETPLACE)
            .query("Text")
            .highlight(false)
            .filters(sanitizedFilters)
            .fields(IpMarketplaceService.FIELDS_TO_SEARCH)
            .build();
    when(searchClient.search(command, pageable, IpMarketplaceSearchDoc.class))
        .thenReturn(
            new PageImpl<>(
                List.of(SearchResult.of(testIpMarketplaceCallSearchDoc(), null, "iPMarketplaceId")),
                pageable,
                1));
    mockMvc
        .perform(
            get(
                "/ip-marketplace?page=0&size=20&sort=name,asc&filter=organOfFocus,ADRENAL_GLANDS&q=Text"))
        .andExpect(status().isForbidden())
        .andExpect(
            jsonPath(
                "$.message",
                is(
                    "Only members from ENTERPRISE_SELLER and ENTERPRISE_BUYER companies can query the IP Marketplace info")));
  }

  @Test
  @WithRedesignUser(
      role = RoleAuthority.ROLE_OP_CO_USER,
      email = "seller@seller.com",
      memberOf = "1KlMnh9a")
  public void testProcessInfo_for_Seller() throws Exception {
    var sellerEmail = "seller@seller.com";
    var buyerEmail = "buyer@buyer.com";
    var sellerPerson = testPerson(ROLE_OP_CO_USER, sellerEmail);
    var buyerPerson = testPerson(ROLE_OP_CO_USER, buyerEmail);
    var company = testIpMarketplaceCompany(sellerPerson);
    var companyMember = new CompanyMember(company, sellerPerson, CompanyMemberStatus.ACTIVE);
    sellerPerson.setMemberOf(Set.of(companyMember));
    var buyerCompany = testIpMarketplaceCompany(buyerPerson);
    var buyerCompanyMember =
        new CompanyMember(buyerCompany, buyerPerson, CompanyMemberStatus.ACTIVE);
    buyerPerson.setMemberOf(Set.of(buyerCompanyMember));
    var ipMarketplace = testIpMarketPlace(sellerEmail);
    when(companyRepository.findByApiId(testCompanyRef())).thenReturn(Optional.of(company));
    when(companyRepository.existsByCompanyIpMarketplaceActivityTypeAndApiIdIn(
            CompanyIPMarketplaceType.ENTERPRISE_SELLER, Set.of(testCompanyRef())))
        .thenReturn(true);
    when(ipMarketplaceRepository.findByApiId(IpMarketplaceRef.of("iPMarketplaceId")))
        .thenReturn(Optional.of(ipMarketplace));
    when(personRepository.findByEmail(PersonRef.of(sellerEmail)))
        .thenReturn(Optional.of(sellerPerson));
    testIpMarketplaceTrack(ipMarketplace, buyerPerson);
    mockMvc
        .perform(
            put("/me/ip-marketplace/{ipMarketplaceId}/contact-info", "iPMarketplaceId")
                .contentType(MediaType.APPLICATION_JSON)
                .content(
                    """
          {
            "buyerEmail": "buyer@buyer.com"
          }
        """))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.date", notNullValue()))
        .andDo(
            document(
                "process-contact-info",
                requestFields(buyerEmailField()),
                responseFields(dateField())));
    verify(emailSender)
        .sendSellerReleaseContactInfo(any(IpMarketplaceSellerReleaseContactInfoCommand.class));
  }

  @Test
  @WithRedesignUser(
      role = RoleAuthority.ROLE_OP_CO_USER,
      email = "buyer@buyer.com",
      memberOf = "buyerCompanyId")
  public void testProcessInfo_for_Buyer() throws Exception {
    var sellerEmail = "seller@seller.com";
    var buyerEmail = "buyer@buyer.com";
    var buyerCompanyId = "buyerCompanyId";
    var sellerPerson = testPerson(ROLE_OP_CO_USER, sellerEmail);
    var buyerPerson = testPerson(ROLE_OP_CO_USER, buyerEmail);
    var company = testIpMarketplaceCompany(sellerPerson);
    var company2 = testIpMarketplaceCompany(buyerPerson);
    company2.setApiId(CompanyRef.of(buyerCompanyId));
    company2.getCompanyIpMarketplace().setActivityType(CompanyIPMarketplaceType.ENTERPRISE_BUYER);
    var companyMember = new CompanyMember(company, sellerPerson, CompanyMemberStatus.ACTIVE);
    var companyMember2 = new CompanyMember(company2, buyerPerson, CompanyMemberStatus.ACTIVE);
    sellerPerson.setMemberOf(Set.of(companyMember));
    buyerPerson.setMemberOf(Set.of(companyMember2));
    var ipMarketplace = testIpMarketPlace(sellerEmail);
    when(companyRepository.findByApiId(testCompanyRef())).thenReturn(Optional.of(company));
    when(companyRepository.existsByCompanyIpMarketplaceActivityTypeAndApiIdIn(
            CompanyIPMarketplaceType.ENTERPRISE_SELLER, Set.of(testCompanyRef())))
        .thenReturn(false);
    when(companyRepository.existsByCompanyIpMarketplaceActivityTypeAndApiIdIn(
            CompanyIPMarketplaceType.ENTERPRISE_BUYER, Set.of(CompanyRef.of(buyerCompanyId))))
        .thenReturn(true);
    when(ipMarketplaceRepository.findByApiId(IpMarketplaceRef.of("iPMarketplaceId")))
        .thenReturn(Optional.of(ipMarketplace));
    when(personRepository.findByEmail(PersonRef.of(sellerEmail)))
        .thenReturn(Optional.of(sellerPerson));
    when(personRepository.findByEmail(PersonRef.of(buyerEmail)))
        .thenReturn(Optional.of(buyerPerson));
    mockMvc
        .perform(
            put("/me/ip-marketplace/{ipMarketplaceId}/contact-info", "iPMarketplaceId")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
          {
          }
        """))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.date", notNullValue()));
    verify(emailSender)
        .sendBuyerRequestContactInfo(any(IpMarketplaceBuyerRequestContactInfoCommand.class));
  }

  @Test
  @WithRedesignUser(role = RoleAuthority.ROLE_OP_CO_USER, email = "rh@rh.com")
  public void testProcessInfo_Should_Fail_If_Not_A_Seller_Or_Buyer() throws Exception {
    var sellerEmail = "seller@seller.com";
    var buyerCompanyId = "buyerCompanyId";
    var company = testIpMarketplaceCompany(null);
    var company2 = testIpMarketplaceCompany(null);
    company2.setApiId(CompanyRef.of(buyerCompanyId));
    company2.getCompanyIpMarketplace().setActivityType(CompanyIPMarketplaceType.ENTERPRISE_BUYER);
    var ipMarketplace = testIpMarketPlace(sellerEmail);
    when(companyRepository.findByApiId(testCompanyRef())).thenReturn(Optional.of(company));
    when(companyRepository.existsByCompanyIpMarketplaceActivityTypeAndApiIdIn(
            CompanyIPMarketplaceType.ENTERPRISE_SELLER, Set.of(testCompanyRef())))
        .thenReturn(false);
    when(companyRepository.existsByCompanyIpMarketplaceActivityTypeAndApiIdIn(
            CompanyIPMarketplaceType.ENTERPRISE_BUYER, Set.of(CompanyRef.of(buyerCompanyId))))
        .thenReturn(false);
    when(ipMarketplaceRepository.findByApiId(IpMarketplaceRef.of("iPMarketplaceId")))
        .thenReturn(Optional.of(ipMarketplace));
    mockMvc
        .perform(
            put("/me/ip-marketplace/{ipMarketplaceId}/contact-info", "iPMarketplaceId")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
          {
          }
        """))
        .andExpect(status().isForbidden())
        .andExpect(
            jsonPath("$.message", is("Only Seller and Buyer can request contact info actions")));
  }

  @Test
  @WithRedesignUser(
      role = RoleAuthority.ROLE_OP_CO_USER,
      email = "seller@seller.com",
      memberOf = "1KlMnh9a")
  public void testProcessInfo_for_Seller_Should_Fail_If_Ip_Marketplace_Not_Exists()
      throws Exception {
    var sellerEmail = "seller@seller.com";
    var sellerPerson = testPerson(ROLE_OP_CO_USER, sellerEmail);
    var company = testIpMarketplaceCompany(sellerPerson);
    var companyMember = new CompanyMember(company, sellerPerson, CompanyMemberStatus.ACTIVE);
    sellerPerson.setMemberOf(Set.of(companyMember));
    when(companyRepository.findByApiId(testCompanyRef())).thenReturn(Optional.of(company));
    when(companyRepository.existsByCompanyIpMarketplaceActivityTypeAndApiIdIn(
            CompanyIPMarketplaceType.ENTERPRISE_SELLER, Set.of(testCompanyRef())))
        .thenReturn(true);
    when(personRepository.findByEmail(PersonRef.of(sellerEmail)))
        .thenReturn(Optional.of(sellerPerson));
    mockMvc
        .perform(
            put("/me/ip-marketplace/{ipMarketplaceId}/contact-info", "iPMarketplaceId")
                .contentType(MediaType.APPLICATION_JSON)
                .content(
                    """
          {
            "buyerEmail": "buyer@buyer.com"
          }
        """))
        .andExpect(status().isNotFound())
        .andExpect(jsonPath("$.message", is("IpMarketplace does not exist.")));
  }

  @Test
  @WithRedesignUser(
      role = RoleAuthority.ROLE_OP_CO_USER,
      email = "seller@seller.com",
      memberOf = "1KlMnh9a")
  public void testProcessInfo_for_Seller_Should_Fail_If_Buyer_Email_Is_Not_Present()
      throws Exception {
    var sellerEmail = "seller@seller.com";
    var buyerEmail = "buyer@buyer.com";
    var sellerPerson = testPerson(ROLE_OP_CO_USER, sellerEmail);
    var buyerPerson = testPerson(ROLE_OP_CO_USER, buyerEmail);
    var company = testIpMarketplaceCompany(sellerPerson);
    var companyMember = new CompanyMember(company, sellerPerson, CompanyMemberStatus.ACTIVE);
    sellerPerson.setMemberOf(Set.of(companyMember));
    var ipMarketplace = testIpMarketPlace(sellerEmail);
    when(companyRepository.findByApiId(testCompanyRef())).thenReturn(Optional.of(company));
    when(companyRepository.existsByCompanyIpMarketplaceActivityTypeAndApiIdIn(
            CompanyIPMarketplaceType.ENTERPRISE_SELLER, Set.of(testCompanyRef())))
        .thenReturn(true);
    when(ipMarketplaceRepository.findByApiId(IpMarketplaceRef.of("iPMarketplaceId")))
        .thenReturn(Optional.of(ipMarketplace));
    when(personRepository.findByEmail(PersonRef.of(sellerEmail)))
        .thenReturn(Optional.of(sellerPerson));
    testIpMarketplaceTrack(ipMarketplace, buyerPerson);
    mockMvc
        .perform(
            put("/me/ip-marketplace/{ipMarketplaceId}/contact-info", "iPMarketplaceId")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
          {
          }
        """))
        .andExpect(status().isUnprocessableEntity())
        .andExpect(jsonPath("$.errors[0].name", is("buyerEmail")))
        .andExpect(
            jsonPath(
                "$.errors[0].description",
                is(
                    "The field is required with some value when is a Seller trying release contact info")));
  }

  @Test
  @WithRedesignUser(
      role = RoleAuthority.ROLE_OP_CO_USER,
      email = "seller@seller.com",
      memberOf = "1KlMnh9a")
  public void testProcessInfo_for_Seller_Should_Fail_If_Buyer_Email_Not_Requested_Contact_Info()
      throws Exception {
    var sellerEmail = "seller@seller.com";
    var buyerEmail = "buyer@buyer.com";
    var sellerPerson = testPerson(ROLE_OP_CO_USER, sellerEmail);
    var buyerPerson = testPerson(ROLE_OP_CO_USER, buyerEmail);
    var company = testIpMarketplaceCompany(sellerPerson);
    var companyMember = new CompanyMember(company, sellerPerson, CompanyMemberStatus.ACTIVE);
    sellerPerson.setMemberOf(Set.of(companyMember));
    var ipMarketplace = testIpMarketPlace(sellerEmail);
    when(companyRepository.findByApiId(testCompanyRef())).thenReturn(Optional.of(company));
    when(companyRepository.existsByCompanyIpMarketplaceActivityTypeAndApiIdIn(
            CompanyIPMarketplaceType.ENTERPRISE_SELLER, Set.of(testCompanyRef())))
        .thenReturn(true);
    when(ipMarketplaceRepository.findByApiId(IpMarketplaceRef.of("iPMarketplaceId")))
        .thenReturn(Optional.of(ipMarketplace));
    when(personRepository.findByEmail(PersonRef.of(sellerEmail)))
        .thenReturn(Optional.of(sellerPerson));
    testIpMarketplaceTrack(ipMarketplace, buyerPerson);
    mockMvc
        .perform(
            put("/me/ip-marketplace/{ipMarketplaceId}/contact-info", "iPMarketplaceId")
                .contentType(MediaType.APPLICATION_JSON)
                .content(
                    """
          {
            "buyerEmail": "anotherBuyer@buyer.com"
          }
        """))
        .andExpect(status().isUnprocessableEntity())
        .andExpect(jsonPath("$.errors[0].name", is("email")))
        .andExpect(jsonPath("$.errors[0].description", is("must exist")));
  }

  @Test
  @WithRedesignUser(
      role = RoleAuthority.ROLE_OP_CO_USER,
      email = "seller@seller.com",
      memberOf = "1KlMnh9a")
  public void testProcessInfo_for_Seller_Should_Fail_If_Contact_Info_Was_Released()
      throws Exception {
    var sellerEmail = "seller@seller.com";
    var buyerEmail = "buyer@buyer.com";
    var sellerPerson = testPerson(ROLE_OP_CO_USER, sellerEmail);
    var buyerPerson = testPerson(ROLE_OP_CO_USER, buyerEmail);
    var company = testIpMarketplaceCompany(sellerPerson);
    var companyMember = new CompanyMember(company, sellerPerson, CompanyMemberStatus.ACTIVE);
    sellerPerson.setMemberOf(Set.of(companyMember));
    var ipMarketplace = testIpMarketPlace(sellerEmail);
    when(companyRepository.findByApiId(testCompanyRef())).thenReturn(Optional.of(company));
    when(companyRepository.existsByCompanyIpMarketplaceActivityTypeAndApiIdIn(
            CompanyIPMarketplaceType.ENTERPRISE_SELLER, Set.of(testCompanyRef())))
        .thenReturn(true);
    when(ipMarketplaceRepository.findByApiId(IpMarketplaceRef.of("iPMarketplaceId")))
        .thenReturn(Optional.of(ipMarketplace));
    when(personRepository.findByEmail(PersonRef.of(sellerEmail)))
        .thenReturn(Optional.of(sellerPerson));
    var ipMarketplaceTrack = testIpMarketplaceTrack(ipMarketplace, buyerPerson);
    ipMarketplaceTrack.setStatus(IpMarketplaceTrackContactInfo.RELEASED_CONTACT_INFO);
    mockMvc
        .perform(
            put("/me/ip-marketplace/{ipMarketplaceId}/contact-info", "iPMarketplaceId")
                .contentType(MediaType.APPLICATION_JSON)
                .content(
                    """
          {
            "buyerEmail": "buyer@buyer.com"
          }
        """))
        .andExpect(status().isForbidden())
        .andExpect(
            jsonPath(
                "$.message",
                is("The contact information was released for this IP record and this buyer")));
  }

  @Test
  @WithRedesignUser(
      role = RoleAuthority.ROLE_OP_CO_USER,
      email = "seller@seller.com",
      memberOf = "1KlMnh9a")
  public void testProcessInfo_for_Seller_Should_Fail_If_It_Is_Not_IP_Marketplace_Owner()
      throws Exception {
    var sellerEmail = "seller@seller.com";
    var anotherSellerEmail = "anotherSeller@seller.com";
    var buyerEmail = "buyer@buyer.com";
    var sellerPerson = testPerson(ROLE_OP_CO_USER, sellerEmail);
    var buyerPerson = testPerson(ROLE_OP_CO_USER, buyerEmail);
    var company = testIpMarketplaceCompany(sellerPerson);
    var companyMember = new CompanyMember(company, sellerPerson, CompanyMemberStatus.ACTIVE);
    sellerPerson.setMemberOf(Set.of(companyMember));
    var ipMarketplace = testIpMarketPlace(anotherSellerEmail);
    when(companyRepository.findByApiId(testCompanyRef())).thenReturn(Optional.of(company));
    when(companyRepository.existsByCompanyIpMarketplaceActivityTypeAndApiIdIn(
            CompanyIPMarketplaceType.ENTERPRISE_SELLER, Set.of(testCompanyRef())))
        .thenReturn(true);
    when(ipMarketplaceRepository.findByApiId(IpMarketplaceRef.of("iPMarketplaceId")))
        .thenReturn(Optional.of(ipMarketplace));
    when(personRepository.findByEmail(PersonRef.of(sellerEmail)))
        .thenReturn(Optional.of(sellerPerson));
    var ipMarketplaceTrack = testIpMarketplaceTrack(ipMarketplace, buyerPerson);
    ipMarketplaceTrack.setStatus(IpMarketplaceTrackContactInfo.REQUESTED_CONTACT_INFO);
    mockMvc
        .perform(
            put("/me/ip-marketplace/{ipMarketplaceId}/contact-info", "iPMarketplaceId")
                .contentType(MediaType.APPLICATION_JSON)
                .content(
                    """
          {
            "buyerEmail": "buyer@buyer.com"
          }
        """))
        .andExpect(status().isForbidden())
        .andExpect(
            jsonPath(
                "$.message",
                is("The requester only can release the contact info for its own IP records")));
  }

  @Test
  @WithRedesignUser(
      role = RoleAuthority.ROLE_OP_CO_USER,
      email = "buyer@buyer.com",
      memberOf = "buyerCompanyId")
  public void testProcessInfo_for_Buyer_Should_Fail_If_Request_Exist() throws Exception {
    var sellerEmail = "seller@seller.com";
    var buyerEmail = "buyer@buyer.com";
    var buyerCompanyId = "buyerCompanyId";
    var sellerPerson = testPerson(ROLE_OP_CO_USER, sellerEmail);
    var buyerPerson = testPerson(ROLE_OP_CO_USER, buyerEmail);
    var company = testIpMarketplaceCompany(sellerPerson);
    var company2 = testIpMarketplaceCompany(buyerPerson);
    company2.setApiId(CompanyRef.of(buyerCompanyId));
    company2.getCompanyIpMarketplace().setActivityType(CompanyIPMarketplaceType.ENTERPRISE_BUYER);
    var companyMember = new CompanyMember(company, sellerPerson, CompanyMemberStatus.ACTIVE);
    var companyMember2 = new CompanyMember(company2, buyerPerson, CompanyMemberStatus.ACTIVE);
    sellerPerson.setMemberOf(Set.of(companyMember));
    buyerPerson.setMemberOf(Set.of(companyMember2));
    var ipMarketplace = testIpMarketPlace(sellerEmail);
    when(companyRepository.findByApiId(testCompanyRef())).thenReturn(Optional.of(company));
    when(companyRepository.existsByCompanyIpMarketplaceActivityTypeAndApiIdIn(
            CompanyIPMarketplaceType.ENTERPRISE_SELLER, Set.of(testCompanyRef())))
        .thenReturn(false);
    when(companyRepository.existsByCompanyIpMarketplaceActivityTypeAndApiIdIn(
            CompanyIPMarketplaceType.ENTERPRISE_BUYER, Set.of(CompanyRef.of(buyerCompanyId))))
        .thenReturn(true);
    when(ipMarketplaceRepository.findByApiId(IpMarketplaceRef.of("iPMarketplaceId")))
        .thenReturn(Optional.of(ipMarketplace));
    when(personRepository.findByEmail(PersonRef.of(sellerEmail)))
        .thenReturn(Optional.of(sellerPerson));
    when(personRepository.findByEmail(PersonRef.of(buyerEmail)))
        .thenReturn(Optional.of(buyerPerson));
    var uniqueViolation = Mockito.mock(ConstraintViolationException.class);
    var baseException = new DataIntegrityViolationException("Error", uniqueViolation);
    when(ipMarketplaceTrackRepository.saveAndFlush(any(IpMarketplaceTrack.class)))
        .thenThrow(baseException);
    mockMvc
        .perform(
            put("/me/ip-marketplace/{ipMarketplaceId}/contact-info", "iPMarketplaceId")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
          {
          }
        """))
        .andExpect(status().isForbidden())
        .andExpect(
            jsonPath(
                "$.message",
                is(
                    "Buyer requested the contact info for this IP record in a previous time, only can do it once time.")));
  }

  @Test
  @WithRedesignUser(role = ROLE_OP_CO_USER)
  public void testFilters_returnsResults() throws Exception {
    var filterOption =
        FilterOptions.builder()
            .field(ORGANIZATION_TYPE)
            .terms(List.of(Term.of("IDN_HEALTH_SYSTEM", 10, "IDN/Health System")))
            .build();

    var command =
        SearchFilterOptionsCommand.builder()
            .index(SearchIndex.IP_MARKETPLACE)
            .fields(VALID_SEARCH_FILTERS)
            .build();

    when(searchClient.getFilterOptions(command)).thenReturn(List.of(filterOption));
    mockMvc
        .perform(get("/ip-marketplace/filters"))
        .andExpect(status().isOk())
        .andDo(
            document(
                "filters",
                responseFields(
                        linksField(), subsectionWithPath("content").description("List of filters"))
                    .andWithPrefix("content[].", keyField(), optionsField())));
  }

  @Test
  @WithRedesignUser(role = RoleAuthority.ROLE_RH_ADMIN)
  public void testDelete_success() throws Exception {
    var ipMarketplaceId = "ipMarketplaceId";
    var ipMarketplaceRef = IpMarketplaceRef.of(ipMarketplaceId);
    var personRef = PersonRef.of("anytest@redesignhealth.com");
    var ipMarketplace = testIpMarketPlace(personRef.getEmail());
    when(ipMarketplaceRepository.findByApiId(ipMarketplaceRef))
        .thenReturn(Optional.of(ipMarketplace));
    mockMvc
        .perform(delete("/ip-marketplace/{ceoId}", ipMarketplaceRef))
        .andExpect(status().isNoContent())
        .andDo(document("delete"));
  }

  @Test
  @WithRedesignUser(role = RoleAuthority.ROLE_RH_ADMIN)
  public void testDelete_Is_Not_Found() throws Exception {
    var ipMarketplaceId = "ipMarketplaceId";
    var ipMarketplaceRef = IpMarketplaceRef.of(ipMarketplaceId);
    mockMvc
        .perform(delete("/ip-marketplace/{ceoId}", ipMarketplaceRef))
        .andExpect(status().isNotFound());
  }

  private FieldDescriptor emailField() {
    return fieldWithPath("email").description("Ip Marketplace owner");
  }

  private FieldDescriptor nameField() {
    return fieldWithPath("name").description("Ip record name");
  }

  private FieldDescriptor executiveSummaryField() {
    return fieldWithPath("executiveSummary").description("Executive summary for the IP record");
  }

  private FieldDescriptor therapeuticNeedOrTrendsBeingAddressedField() {
    return fieldWithPath("therapeuticNeedOrTrendsBeingAddressed")
        .description("A explanation about of the IP purpose");
  }

  private FieldDescriptor technologyOverviewField() {
    return fieldWithPath("technologyOverview").description("An overview about the technology used");
  }

  private FieldDescriptor licenseRestrictionField() {
    return fieldWithPath("licenseRestriction")
        .description("To inform if there is a license restriction or not");
  }

  private FieldDescriptor aboutLicenseRestrictionField() {
    return fieldWithPath("aboutLicenseRestriction")
        .description(
            "Section to explain details of the license restrictions, this attribute should receive value if the license_restriction is true");
  }

  private FieldDescriptor preferredTermsField() {
    return subsectionWithPath("preferredTerms")
        .description(
            "List for different preferred terms to use. More details here: "
                + "https://redesignhealth.atlassian.net/wiki/spaces/PP/pages/335937965/11.1.1.1.2+DB+Enums#ip_marketplace_preferred_terms");
  }

  private FieldDescriptor associatedFilesOrMediaField() {
    return subsectionWithPath("associatedFilesOrMedia")
        .description("List of the different content marketing related to the IP record");
  }

  private FieldDescriptor patentStatusField() {
    return fieldWithPath("patentStatus").description("Status for the patent");
  }

  private FieldDescriptor patentIssueField() {
    return fieldWithPath("patentIssue").description("Date when the patent was issued ");
  }

  private FieldDescriptor patentGeographicValidityField() {
    return subsectionWithPath("patentGeographicValidity").description("Where the patent is valid");
  }

  private FieldDescriptor diseaseField() {
    return fieldWithPath("disease").description("Information about the disease explored in the IP");
  }

  private FieldDescriptor organOfFocusField() {
    return fieldWithPath("organOfFocus")
        .description("Information about the organ of focus explored in the IP");
  }

  private FieldDescriptor technologyTypeField() {
    return subsectionWithPath("technologyType")
        .description("Different technology types used in the IP");
  }

  private FieldDescriptor specialityField() {
    return subsectionWithPath("speciality").description("Different specialities used in the IP");
  }

  private FieldDescriptor sellerSummaryTechTransferApproachField() {
    return fieldWithPath("sellerSummaryTechTransferApproach")
        .description("Seller summary tech transfer approach");
  }

  private FieldDescriptor responsibleInventorField() {
    return fieldWithPath("responsibleInventor").description("Responsible inventor");
  }

  private FieldDescriptor technologyLevelOfMaturityField() {
    return subsectionWithPath("technologyLevelOfMaturity")
        .description("Different technology levels of maturity used in the IP");
  }

  private FieldDescriptor patentStatusHrefField() {
    return fieldWithPath("patentStatusHref").description("Patent status href");
  }

  private FieldDescriptor freedomToOperateCertificationField() {
    return fieldWithPath("freedomToOperateCertification")
        .description("Freedom to operate certification");
  }

  private FieldDescriptor companyIdField() {
    return fieldWithPath("companyId").description("Company selling the IP");
  }

  private FieldDescriptor viewedField() {
    return fieldWithPath("viewed").description("if the requester view the IP");
  }

  private FieldDescriptor buyerEmailField() {
    return fieldWithPath("buyerEmail")
        .description("Buyer what requested the contact info for the IP record");
  }

  private FieldDescriptor dateField() {
    return fieldWithPath("date")
        .description(
            "When the contact info was requested or released, depending on who is using the endpoint (SELLER or BUYER)");
  }

  private FieldDescriptor organizationField() {
    return subsectionWithPath("organization").description("Organization selling of IP record");
  }

  private FieldDescriptor ownerField() {
    return subsectionWithPath("owner").description("Owner/Seller for the IP record");
  }

  private FieldDescriptor patentStatusFieldSE() {
    return subsectionWithPath("patentStatus").description("patent status");
  }

  private FieldDescriptor freedomToOperateCertificationFieldSE() {
    return subsectionWithPath("freedomToOperateCertification")
        .description("Freedom to operate certification");
  }

  private FieldDescriptor metricsField() {
    return subsectionWithPath("metrics").description("Metrics collected for a IP record");
  }

  private FieldDescriptor organOfFocusFieldSE() {
    return subsectionWithPath("organOfFocus")
        .description("Organs where the IP record focus the work");
  }

  private FieldDescriptor requestContactInfoField() {
    return subsectionWithPath("requestContactInfo")
        .description(
            "This field contains he information associated who has requested the info for a determined IP record");
  }

  private FieldDescriptor legalPatentabilityAssessmentAvailableField() {
    return fieldWithPath("legalPatentabilityAssessmentAvailable")
        .description("Legal Patentability Assessment Available is available or not");
  }

  private FieldDescriptor copyrightedField() {
    return fieldWithPath("copyrighted").description("Copyrighted is available or not");
  }

  private FieldDescriptor statusFieldSE() {
    return subsectionWithPath("status").description("Status for the IP record: ACTIVE|DELISTED");
  }
}
