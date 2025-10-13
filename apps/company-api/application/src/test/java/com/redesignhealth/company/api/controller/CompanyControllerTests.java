package com.redesignhealth.company.api.controller;

import static com.redesignhealth.company.api.entity.request.RoleAuthority.ROLE_OP_CO_CONTRACTOR;
import static com.redesignhealth.company.api.entity.request.RoleAuthority.ROLE_RH_ADMIN;
import static com.redesignhealth.company.api.entity.request.RoleAuthority.ROLE_RH_USER;
import static com.redesignhealth.company.api.expansion.Expansion.MEMBERS;
import static com.redesignhealth.company.api.expansion.Expansion.MEMBER_OF;
import static com.redesignhealth.company.api.scaffolding.DocUtils.companiesLink;
import static com.redesignhealth.company.api.scaffolding.DocUtils.companyLink;
import static com.redesignhealth.company.api.scaffolding.DocUtils.createdField;
import static com.redesignhealth.company.api.scaffolding.DocUtils.descriptionField;
import static com.redesignhealth.company.api.scaffolding.DocUtils.emailField;
import static com.redesignhealth.company.api.scaffolding.DocUtils.expandQueryParameter;
import static com.redesignhealth.company.api.scaffolding.DocUtils.familyNameField;
import static com.redesignhealth.company.api.scaffolding.DocUtils.givenNameField;
import static com.redesignhealth.company.api.scaffolding.DocUtils.hasPlatformAgreementField;
import static com.redesignhealth.company.api.scaffolding.DocUtils.hrefField;
import static com.redesignhealth.company.api.scaffolding.DocUtils.idField;
import static com.redesignhealth.company.api.scaffolding.DocUtils.lastModifiedField;
import static com.redesignhealth.company.api.scaffolding.DocUtils.legalNameField;
import static com.redesignhealth.company.api.scaffolding.DocUtils.linksField;
import static com.redesignhealth.company.api.scaffolding.DocUtils.membersField;
import static com.redesignhealth.company.api.scaffolding.DocUtils.membersLink;
import static com.redesignhealth.company.api.scaffolding.DocUtils.nameField;
import static com.redesignhealth.company.api.scaffolding.DocUtils.numberField;
import static com.redesignhealth.company.api.scaffolding.DocUtils.onboardDocsLink;
import static com.redesignhealth.company.api.scaffolding.DocUtils.pageFields;
import static com.redesignhealth.company.api.scaffolding.DocUtils.pageQueryParameter;
import static com.redesignhealth.company.api.scaffolding.DocUtils.roleField;
import static com.redesignhealth.company.api.scaffolding.DocUtils.rolesField;
import static com.redesignhealth.company.api.scaffolding.DocUtils.selfLink;
import static com.redesignhealth.company.api.scaffolding.DocUtils.sizeQueryParameter;
import static com.redesignhealth.company.api.scaffolding.DocUtils.sortQueryParameter;
import static com.redesignhealth.company.api.scaffolding.DocUtils.stageField;
import static com.redesignhealth.company.api.scaffolding.Fixtures.TEST_COMPANY_ID;
import static com.redesignhealth.company.api.scaffolding.Fixtures.testCompany;
import static com.redesignhealth.company.api.scaffolding.Fixtures.testCompanyRef;
import static com.redesignhealth.company.api.scaffolding.Fixtures.testIpMarketPlace;
import static com.redesignhealth.company.api.scaffolding.Fixtures.testIpMarketplaceTrack;
import static com.redesignhealth.company.api.scaffolding.Fixtures.testPerson;
import static org.hamcrest.Matchers.hasLength;
import static org.hamcrest.Matchers.is;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.AdditionalAnswers.returnsFirstArg;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
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

import com.fasterxml.jackson.databind.ObjectMapper;
import com.redesignhealth.company.api.assembler.CompanyAssembler;
import com.redesignhealth.company.api.assembler.CompanyDtoAssembler;
import com.redesignhealth.company.api.assembler.CompanyMemberAuditAssembler;
import com.redesignhealth.company.api.assembler.CompanyVendorAssembler;
import com.redesignhealth.company.api.assembler.google.OnboardDocsLinkGenerator;
import com.redesignhealth.company.api.assembler.google.XCloudCrmLinkGenerator;
import com.redesignhealth.company.api.client.file.GoogleDriveClient;
import com.redesignhealth.company.api.dto.CompanyMemberDto;
import com.redesignhealth.company.api.dto.command.CompanyCommand;
import com.redesignhealth.company.api.dto.command.CompanyMemberCommand;
import com.redesignhealth.company.api.dto.enums.CompanyIPMarketplaceOrganizationType;
import com.redesignhealth.company.api.dto.enums.CompanyIPMarketplaceRegion;
import com.redesignhealth.company.api.dto.enums.CompanyIPMarketplaceType;
import com.redesignhealth.company.api.dto.enums.CompanyMemberStatus;
import com.redesignhealth.company.api.dto.enums.CompanyStage;
import com.redesignhealth.company.api.dto.enums.CompanyStatus;
import com.redesignhealth.company.api.entity.Ceo;
import com.redesignhealth.company.api.entity.Company;
import com.redesignhealth.company.api.entity.CompanyConflict;
import com.redesignhealth.company.api.entity.CompanyIpMarketplace;
import com.redesignhealth.company.api.entity.CompanyMember;
import com.redesignhealth.company.api.entity.CompanyMemberAudit;
import com.redesignhealth.company.api.entity.Person;
import com.redesignhealth.company.api.entity.ref.CompanyRef;
import com.redesignhealth.company.api.entity.ref.PersonRef;
import com.redesignhealth.company.api.entity.request.RoleAuthority;
import com.redesignhealth.company.api.exception.CompanyNotFoundException;
import com.redesignhealth.company.api.exception.ForbiddenAddConflictsException;
import com.redesignhealth.company.api.exception.ForbiddenAddMemberException;
import com.redesignhealth.company.api.exception.ForbiddenDeleteCompanyException;
import com.redesignhealth.company.api.exception.GoogleDriveException;
import com.redesignhealth.company.api.exception.LinkedCompanyException;
import com.redesignhealth.company.api.exception.PersonNotFoundException;
import com.redesignhealth.company.api.exception.StageConflictException;
import com.redesignhealth.company.api.expansion.Expansion;
import com.redesignhealth.company.api.repository.CompanyConflictRepository;
import com.redesignhealth.company.api.repository.CompanyMemberAuditRepository;
import com.redesignhealth.company.api.repository.CompanyRepository;
import com.redesignhealth.company.api.repository.IpMarketplaceTrackRepository;
import com.redesignhealth.company.api.repository.PersonRepository;
import com.redesignhealth.company.api.repository.VendorRepository;
import com.redesignhealth.company.api.scaffolding.CommonTestConfig;
import com.redesignhealth.company.api.scaffolding.Fixtures;
import com.redesignhealth.company.api.scaffolding.WithRedesignUser;
import com.redesignhealth.company.api.service.CompanyService;
import com.redesignhealth.company.api.taxonomy.CompanyTaxonomy;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import org.assertj.core.util.Arrays;
import org.hibernate.exception.ConstraintViolationException;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.EnumSource;
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

@WebMvcTest(CompanyController.class)
@Import({CommonTestConfig.class})
@AutoConfigureRestDocs("target/generated-snippets/company")
public class CompanyControllerTests {
  @Autowired private MockMvc mockMvc;
  @Autowired private ObjectMapper mapper;
  @MockBean private CompanyRepository companyRepository;
  @MockBean private CompanyMemberAuditRepository companyMemberAuditRepository;
  @MockBean private CompanyConflictRepository companyConflictRepository;
  @MockBean private VendorRepository vendorRepository;
  @MockBean private PersonRepository personRepository;
  @MockBean private GoogleDriveClient googleDriveClient;
  @MockBean private IpMarketplaceTrackRepository ipMarketplaceTrackRepository;
  private final CompanyRef companyRef = testCompanyRef();
  private static final String TEST_COMPANY_XCLOUD_UAT_ID = "xcloud-uat-participant-0";

  @TestConfiguration
  static class TestConfig {

    @Bean
    public CompanyAssembler companyAssembler(OnboardDocsLinkGenerator onboardDocsLinkGenerator) {
      return new CompanyAssembler(onboardDocsLinkGenerator);
    }

    @Bean
    public CompanyDtoAssembler companyDtoAssembler(
        OnboardDocsLinkGenerator onboardDocsLinkGenerator,
        XCloudCrmLinkGenerator xCloudCrmLinkGenerator) {
      return new CompanyDtoAssembler(
          onboardDocsLinkGenerator,
          xCloudCrmLinkGenerator,
          Arrays.array(TEST_COMPANY_XCLOUD_UAT_ID));
    }

    @Bean
    CompanyMemberAuditAssembler companyMemberAuditAssembler() {
      return new CompanyMemberAuditAssembler();
    }

    @Bean
    CompanyVendorAssembler companyVendorAssembler() {
      return new CompanyVendorAssembler();
    }

    @Bean
    public CompanyService companyService(
        CompanyRepository companyRepository,
        PersonRepository personRepository,
        GoogleDriveClient googleDriveClient,
        CompanyMemberAuditRepository companyMemberAuditRepository,
        CompanyConflictRepository companyConflictRepository,
        CompanyTaxonomy companyTaxonomy,
        IpMarketplaceTrackRepository ipMarketplaceTrackRepository) {
      return new CompanyService(
          companyRepository,
          personRepository,
          googleDriveClient,
          "id",
          "id",
          companyMemberAuditRepository,
          companyConflictRepository,
          companyTaxonomy,
          ipMarketplaceTrackRepository);
    }
  }

  @Test
  public void test401() throws Exception {
    mockMvc.perform(get("/company")).andExpect(status().isUnauthorized());
  }

  @Test
  @WithRedesignUser(role = ROLE_RH_USER)
  public void testList_returnsAllWithRhUser() throws Exception {
    var company = testCompany(testPerson());
    when(companyRepository.findAll(Mockito.any(Pageable.class)))
        .thenReturn(new PageImpl<>(List.of(company)));

    mockMvc
        .perform(get("/company?expand=members&sort=created,desc&size=20&page=0"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.content[0].id", is("1KlMnh9a")))
        .andDo(
            document(
                "list",
                queryParameters(
                    expandQueryParameter(Expansion.MEMBERS),
                    sortQueryParameter(),
                    sizeQueryParameter(),
                    pageQueryParameter()),
                responseFields(
                        subsectionWithPath("content").description("List of companies"),
                        linksField())
                    .andWithPrefix(
                        "content[].",
                        idField(),
                        nameField(),
                        legalNameField(),
                        descriptionField(),
                        membersField(),
                        createdField(),
                        lastModifiedField(),
                        taxonomyField(),
                        dashboardHrefField(),
                        linksField().ignored())
                    .andWithPrefix("page.", pageFields())));
  }

  @Test
  @WithRedesignUser(role = ROLE_OP_CO_CONTRACTOR, memberOf = TEST_COMPANY_ID)
  public void testList_returnsSome() throws Exception {
    when(companyRepository.findAllByMembersEmail(any(), any()))
        .thenReturn(new PageImpl<>(List.of(testCompany())));
    mockMvc
        .perform(get("/company"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.content[0].id", is("1KlMnh9a")));
  }

  @Test
  @WithRedesignUser(role = ROLE_RH_ADMIN)
  public void testGetOne_returns404ForUnknown() throws Exception {
    mockMvc
        .perform(get("/company/{apiId}", "unknown"))
        .andExpect(status().isNotFound())
        .andExpect(
            (result) ->
                assertTrue(result.getResolvedException() instanceof CompanyNotFoundException));
  }

  @Test
  @WithRedesignUser(role = ROLE_OP_CO_CONTRACTOR, memberOf = TEST_COMPANY_ID)
  public void testGetOne_returns() throws Exception {
    var company = testCompany(testPerson());
    when(companyRepository.findByApiId(companyRef, Expansion.MEMBERS))
        .thenReturn(Optional.of(company));

    mockMvc
        .perform(get("/company/{apiId}?expand=members", companyRef))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.id", is("1KlMnh9a")))
        .andExpect(jsonPath("$.name", is("Springtide")))
        .andExpect(
            jsonPath(
                "$.description",
                is(
                    "The integrated, evidence-based autism center that seeks to transform the way families receive care.")))
        .andExpect(jsonPath("$.legalName", is("Springtide Child Development, Inc.")))
        .andExpect(jsonPath("$.number", is(1111)))
        .andExpect(jsonPath("$.created", is("1970-01-01T00:00:00Z")))
        .andExpect(jsonPath("$.lastModified", is("1970-01-01T00:00:00Z")))
        .andDo(
            document(
                "get",
                queryParameters(expandQueryParameter(Expansion.MEMBERS)),
                responseFields(
                    idField(),
                    nameField(),
                    legalNameField(),
                    numberField(),
                    descriptionField(),
                    membersField(),
                    statusField(),
                    stageField(),
                    createdField(),
                    lastModifiedField(),
                    linksField(),
                    taxonomyField(),
                    dashboardHrefField()),
                links(selfLink(), membersLink(), companiesLink(), onboardDocsLink())));
  }

  @Test
  @WithRedesignUser(role = ROLE_RH_ADMIN)
  public void testCreate_returns_noStage() throws Exception {
    when(companyRepository.findByApiId(companyRef)).thenReturn(Optional.of(testCompany()));
    when(companyRepository.save(any(Company.class))).then(returnsFirstArg());

    mockMvc
        .perform(
            post("/company")
                .contentType(MediaType.APPLICATION_JSON)
                .content(
                    """
              {
                "name": "Ever/body",
                "description": "Cosmetic dermatology for every tone, texture, age, gender, and body.",
                "legalName": "Ever/body Inc.",
                "number": 1111,
                "taxonomyId": "CARE_TEAM_COORDINATION",
                "stage": "OP_CO",
                "fundraiseStatus": "SERIES_A",
                "href": "https://example.com",
                "dashboardHref": "https://example.com"
              }
            """))
        .andExpect(status().isCreated())
        .andExpect(jsonPath("$.id", hasLength(8)))
        .andExpect(jsonPath("$.name", is("Ever/body")))
        .andExpect(jsonPath("$.stage", is("OP_CO")))
        .andExpect(
            jsonPath(
                "$.description",
                is("Cosmetic dermatology for every tone, texture, age, gender, and body.")))
        .andExpect(jsonPath("$.legalName", is("Ever/body Inc.")))
        .andExpect(jsonPath("$.number", is(1111)))
        .andDo(
            document(
                "create",
                requestFields(
                    nameField(),
                    descriptionField(),
                    legalNameField(),
                    numberField(),
                    taxonomyIdField(),
                    dashboardHrefField(),
                    fundraiseStatusField(),
                    hrefField(),
                    stageField()),
                responseFields(
                    idField(),
                    statusField(),
                    nameField(),
                    descriptionField(),
                    legalNameField(),
                    numberField(),
                    membersField(),
                    stageField(),
                    taxonomyField(),
                    fundraiseStatusField(),
                    hrefField(),
                    dashboardHrefField(),
                    hasPlatformAgreementField(),
                    linksField()),
                links(membersLink(), selfLink())));
  }

  @Test
  @WithRedesignUser(role = ROLE_RH_ADMIN)
  public void testCreate_CompanyIpMarketplace() throws Exception {
    var company = testCompany();
    var companyIpMarketplace = new CompanyIpMarketplace();
    companyIpMarketplace.setActivityType(CompanyIPMarketplaceType.ENTERPRISE_SELLER);
    companyIpMarketplace.setOrganizationType(
        CompanyIPMarketplaceOrganizationType.IDN_HEALTH_SYSTEM);
    companyIpMarketplace.setRegion(CompanyIPMarketplaceRegion.NORTHEAST);
    companyIpMarketplace.setCompany(company);
    company.setCompanyIpMarketplace(companyIpMarketplace);

    when(companyRepository.findByApiId(companyRef)).thenReturn(Optional.of(company));
    when(companyRepository.save(any(Company.class))).then(returnsFirstArg());

    mockMvc
        .perform(
            post("/company")
                .contentType(MediaType.APPLICATION_JSON)
                .content(
                    """
      {
        "name": "Ever/body",
        "description": "Cosmetic dermatology for every tone, texture, age, gender, and body.",
        "legalName": "Ever/body Inc.",
        "number": 1111,
        "taxonomyId": "CARE_TEAM_COORDINATION",
        "stage": "OP_CO",
        "fundraiseStatus": "SERIES_A",
        "href": "https://example.com",
        "dashboardHref": "https://example.com",
        "activityType": "ENTERPRISE_SELLER",
        "organizationType": "IDN_HEALTH_SYSTEM",
        "region": "NORTHEAST"
      }
    """))
        .andExpect(status().isCreated())
        .andExpect(jsonPath("$.id", hasLength(8)))
        .andExpect(jsonPath("$.name", is("Ever/body")))
        .andExpect(jsonPath("$.activityType.value", is("ENTERPRISE_SELLER")))
        .andExpect(jsonPath("$.organizationType.value", is("IDN_HEALTH_SYSTEM")))
        .andExpect(jsonPath("$.region.value", is("NORTHEAST")))
        .andExpect(
            jsonPath(
                "$.description",
                is("Cosmetic dermatology for every tone, texture, age, gender, and body.")))
        .andExpect(jsonPath("$.legalName", is("Ever/body Inc.")))
        .andDo(
            document(
                "create-company-ip_marketplace",
                requestFields(
                    nameField(),
                    descriptionField(),
                    legalNameField(),
                    numberField(),
                    taxonomyIdField(),
                    dashboardHrefField(),
                    fundraiseStatusField(),
                    activityTypeField(),
                    organizationTypeField(),
                    regionField(),
                    hrefField(),
                    stageField()),
                responseFields(
                    idField(),
                    statusField(),
                    nameField(),
                    descriptionField(),
                    legalNameField(),
                    membersField(),
                    hrefField(),
                    hasPlatformAgreementField(),
                    activityTypeFieldSE(),
                    organizationTypeFieldSE(),
                    regionFieldSE(),
                    linksField()),
                links(membersLink(), selfLink())));
  }

  @Test
  @WithRedesignUser(role = ROLE_RH_ADMIN)
  public void testCreate_CompanyIpMarketplace_Should_Fail_If_Status_Is_Paused() throws Exception {
    mockMvc
        .perform(
            post("/company")
                .contentType(MediaType.APPLICATION_JSON)
                .content(
                    """
      {
      "name": "Ever/body",
      "description": "Cosmetic dermatology for every tone, texture, age, gender, and body.",
      "legalName": "Ever/body Inc.",
      "number": 1111,
      "taxonomyId": "CARE_TEAM_COORDINATION",
      "stage": "OP_CO",
      "fundraiseStatus": "SERIES_A",
      "href": "https://example.com",
      "dashboardHref": "https://example.com",
      "activityType": "ENTERPRISE_SELLER",
      "organizationType": "IDN_HEALTH_SYSTEM",
      "region": "NORTHEAST",
      "status": "PAUSED"
      }
      """))
        .andExpect(status().isUnprocessableEntity())
        .andExpect(
            jsonPath(
                "$.errors[0].description",
                is("A IP marketplace company can't be created in PAUSED status")));
  }

  @Test
  @WithRedesignUser(role = ROLE_RH_ADMIN)
  public void
      testCreate_CompanyIpMarketplace_ShouldFail_If_ActivityType_Is_Sent_And_Not_Region_Or_Organization_Type()
          throws Exception {
    mockMvc
        .perform(
            post("/company")
                .contentType(MediaType.APPLICATION_JSON)
                .content(
                    """
      {
        "name": "Ever/body",
        "description": "Cosmetic dermatology for every tone, texture, age, gender, and body.",
        "legalName": "Ever/body Inc.",
        "number": 1111,
        "taxonomyId": "CARE_TEAM_COORDINATION",
        "stage": "OP_CO",
        "fundraiseStatus": "SERIES_A",
        "href": "https://example.com",
        "dashboardHref": "https://example.com",
        "activityType": "ENTERPRISE_SELLER"
      }
    """))
        .andExpect(status().isUnprocessableEntity())
        .andExpect(
            jsonPath(
                "$.errors[0].description",
                is("For companies IP Marketplace are required the organizationType and region")));
  }

  @ParameterizedTest
  @EnumSource(
      value = CompanyStage.class,
      names = {"THEME", "CONCEPT", "NEW_CO"})
  @WithRedesignUser(role = ROLE_RH_ADMIN)
  public void testCreate_Invalid_Assignation_FundraiseStatus(CompanyStage stage) throws Exception {
    when(companyRepository.findByApiId(companyRef)).thenReturn(Optional.of(testCompany()));
    when(companyRepository.save(any(Company.class))).then(returnsFirstArg());
    var payload =
        """
      {
        "name": "Ever/body",
        "description": "Cosmetic dermatology for every tone, texture, age, gender, and body.",
        "legalName": "Ever/body Inc.",
        "number": 1111,
        "taxonomyId": "CARE_TEAM_COORDINATION",
        "fundraiseStatus": "SERIES_A",
        "stage": "%s"
      }
    """;

    mockMvc
        .perform(
            post("/company")
                .contentType(MediaType.APPLICATION_JSON)
                .content(String.format(payload, stage)))
        .andExpect(status().isUnprocessableEntity())
        .andExpect(jsonPath("$.errors[0].name", is("fundraiseStatus")))
        .andExpect(jsonPath("$.errors[0].rejectedValue", is("Series A")))
        .andExpect(jsonPath("$.errors[0].description", is("Can only be assigned to OP_CO")));
  }

  @Test
  @WithRedesignUser(role = ROLE_RH_ADMIN)
  public void testCreate_Status_Bad_Request_Invalid_Input() throws Exception {
    mockMvc
        .perform(
            post("/company")
                .contentType(MediaType.APPLICATION_JSON)
                .content(
                    "{\"number\": 1111,"
                        + "\"legalName\": \"Ever/body Inc.\","
                        + "\"name\": \"Ever/body\","
                        + "\"description\": \"Cosmetic dermatology for every tone, texture, age, gender, and body.\","
                        + "\"status\" : \"Bogus\"}"))
        .andExpect(status().isUnprocessableEntity());
  }

  @Test
  @WithRedesignUser(role = ROLE_RH_ADMIN)
  public void testCreate_Status_Bad_Request_Empty_Array() throws Exception {
    mockMvc
        .perform(
            post("/company")
                .contentType(MediaType.APPLICATION_JSON)
                .content(
                    "{\"number\": 1111,"
                        + "\"legalName\": \"Ever/body Inc.\","
                        + "\"name\": \"Ever/body\","
                        + "\"description\": \"Cosmetic dermatology for every tone, texture, age, gender, and body.\","
                        + "\"status\" : []}"))
        .andExpect(status().isUnprocessableEntity());
  }

  @Test
  @WithRedesignUser(role = ROLE_RH_ADMIN)
  public void testCreate_Status_Bad_Request_Empty_Object() throws Exception {
    mockMvc
        .perform(
            post("/company")
                .contentType(MediaType.APPLICATION_JSON)
                .content(
                    "{\"number\": 1111,"
                        + "\"legalName\": \"Ever/body Inc.\","
                        + "\"name\": \"Ever/body\","
                        + "\"description\": \"Cosmetic dermatology for every tone, texture, age, gender, and body.\","
                        + "\"status\" : {}}"))
        .andExpect(status().isUnprocessableEntity());
  }

  @Test
  @WithRedesignUser(role = ROLE_RH_ADMIN)
  public void testCreate_returns_Stage() throws Exception {
    when(companyRepository.findByApiId(companyRef)).thenReturn(Optional.of(testCompany()));
    when(companyRepository.save(any(Company.class))).then(returnsFirstArg());
    mockMvc
        .perform(
            post("/company")
                .contentType(MediaType.APPLICATION_JSON)
                .content(
                    """
        {
          "name": "Ever/body",
          "description": "Cosmetic dermatology for every tone, texture, age, gender, and body.",
          "legalName": "Ever/body Inc.",
          "number": 1111,
          "stage": "THEME"
        }
        """))
        .andExpect(status().isCreated())
        .andExpect(jsonPath("$.id", hasLength(8)))
        .andExpect(jsonPath("$.name", is("Ever/body")))
        .andExpect(jsonPath("$.stage", is("THEME")))
        .andExpect(
            jsonPath(
                "$.description",
                is("Cosmetic dermatology for every tone, texture, age, gender, and body.")))
        .andExpect(jsonPath("$.legalName", is("Ever/body Inc.")))
        .andExpect(jsonPath("$.number", is(1111)));
  }

  @Test
  @WithRedesignUser(role = ROLE_RH_ADMIN)
  public void testCreate_And_Call_Create_G_Folder() throws Exception {
    when(companyRepository.findByApiId(companyRef)).thenReturn(Optional.of(testCompany()));
    when(companyRepository.save(any(Company.class))).then(returnsFirstArg());
    mockMvc
        .perform(
            post("/company")
                .contentType(MediaType.APPLICATION_JSON)
                .content(
                    """
        {
          "name": "Ever/body",
          "description": "Cosmetic dermatology for every tone, texture, age, gender, and body.",
          "legalName": "Ever/body Inc.",
          "number": 1111,
          "stage": "OP_CO"
        }
        """))
        .andExpect(status().isCreated())
        .andExpect(jsonPath("$.id", hasLength(8)))
        .andExpect(jsonPath("$.name", is("Ever/body")))
        .andExpect(jsonPath("$.stage", is("OP_CO")))
        .andExpect(
            jsonPath(
                "$.description",
                is("Cosmetic dermatology for every tone, texture, age, gender, and body.")))
        .andExpect(jsonPath("$.legalName", is("Ever/body Inc.")))
        .andExpect(jsonPath("$.number", is(1111)));
    verify(googleDriveClient, times(1)).createFolder(any(String.class), any(String.class));
  }

  @Test
  @WithRedesignUser(role = ROLE_RH_ADMIN)
  public void testCreate_And_Not_Call_Create_G_Folder() throws Exception {
    when(companyRepository.findByApiId(companyRef)).thenReturn(Optional.of(testCompany()));
    when(companyRepository.save(any(Company.class))).then(returnsFirstArg());
    mockMvc
        .perform(
            post("/company")
                .contentType(MediaType.APPLICATION_JSON)
                .content(
                    """
        {
          "name": "Ever/body",
          "description": "Cosmetic dermatology for every tone, texture, age, gender, and body.",
          "legalName": "Ever/body Inc.",
          "number": 1111,
          "createGFolder": false,
          "stage": "OP_CO"
        }
        """))
        .andExpect(status().isCreated())
        .andExpect(jsonPath("$.id", hasLength(8)))
        .andExpect(jsonPath("$.name", is("Ever/body")))
        .andExpect(jsonPath("$.stage", is("OP_CO")))
        .andExpect(
            jsonPath(
                "$.description",
                is("Cosmetic dermatology for every tone, texture, age, gender, and body.")))
        .andExpect(jsonPath("$.legalName", is("Ever/body Inc.")))
        .andExpect(jsonPath("$.number", is(1111)));
    verify(googleDriveClient, never()).createFolder(any(String.class), any(String.class));
  }

  @Test
  @WithRedesignUser(role = ROLE_RH_ADMIN)
  public void testCreate_Fail_If_NEW_CO_Stage_Doesnt_Have_LinkedCompany() throws Exception {
    createCompanyWithStageConceptOrNewCoFailure(CompanyStage.NEW_CO);
  }

  // createCompanyWithStageThemeOrOpCoFailure
  @Test
  @WithRedesignUser(role = ROLE_RH_ADMIN)
  public void testCreate_Fail_If_OP_CO_Stage_Has_LinkedCompany() throws Exception {
    createCompanyWithStageThemeOrOpCoFailure(CompanyStage.OP_CO);
  }

  @Test
  @WithRedesignUser(role = ROLE_RH_ADMIN)
  public void testCreate_Fail_If_THEME_Stage_Has_LinkedCompany() throws Exception {
    createCompanyWithStageThemeOrOpCoFailure(CompanyStage.THEME);
  }

  @Test
  @WithRedesignUser(role = ROLE_RH_ADMIN)
  public void testCreate_Fail_If_LinkedCompany_Doesnt_Exist() throws Exception {
    // writeValueAsString has issues getting the toString from the CompanyRef and this converting in
    // string all the object
    var comnandAsString =
        "{\"number\":1111,\"legalName\":\"Ever/body Inc.\",\"name\":\"Ever/body\","
            + "\"description\":\"Cosmetic dermatology for every tone, texture, age, gender, and body.\","
            + "\"stage\":\"CONCEPT\",\"linkedApiId\":\"not_exist\"}";
    mockMvc
        .perform(post("/company").contentType(MediaType.APPLICATION_JSON).content(comnandAsString))
        .andExpect(status().isNotFound())
        .andExpect(
            (result) ->
                assertTrue(result.getResolvedException() instanceof CompanyNotFoundException));
  }

  @Test
  @WithRedesignUser(role = ROLE_RH_ADMIN)
  public void testCreate_handlesNumberUniqueness() throws Exception {
    var uniqueViolation = Mockito.mock(ConstraintViolationException.class);
    var baseException = new DataIntegrityViolationException("Error", uniqueViolation);
    when(companyRepository.save(any())).thenThrow(baseException);
    mockMvc
        .perform(
            post("/company")
                .contentType(MediaType.APPLICATION_JSON)
                .content(
                    """
         {
          "name": "Ever/Body",
          "number": 1111
          }
        """))
        .andExpect(status().isUnprocessableEntity())
        .andExpect(jsonPath("$.message", is("Invalid field values")))
        .andExpect(jsonPath("$.errors[0].name", is("number")))
        .andExpect(jsonPath("$.errors[0].rejectedValue", is("1111")))
        .andExpect(jsonPath("$.errors[0].description", is("must be unique")));
  }

  @Test
  @WithRedesignUser(role = ROLE_RH_ADMIN)
  public void testCreate_handlesNameRequired() throws Exception {
    mockMvc
        .perform(
            post("/company")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
            {
            }
            """))
        .andExpect(status().isUnprocessableEntity())
        .andExpect(jsonPath("$.message", is("Invalid field values")))
        .andExpect(jsonPath("$.errors[0].name", is("name")))
        .andExpect(jsonPath("$.errors[0].description", is("must not be blank")));
  }

  @Test
  @WithRedesignUser(role = ROLE_RH_ADMIN)
  public void testUpdateOne_404s() throws Exception {
    // entity does not exist
    when(companyRepository.findByApiId(companyRef)).thenReturn(Optional.empty());
    mockMvc
        .perform(
            put("/company/{apiId}", companyRef)
                .contentType(MediaType.APPLICATION_JSON)
                .content(
                    """
                {
                  "name": "Ever/body"
                }
                """))
        .andExpect(status().isNotFound());
  }

  @Test
  @WithRedesignUser(role = ROLE_RH_ADMIN)
  public void testUpdateOne_returns() throws Exception {
    var company = testCompany();
    company.setStatus(CompanyStatus.ACTIVE);
    when(companyRepository.findByApiId(companyRef, MEMBERS)).thenReturn(Optional.of(company));
    when(companyRepository.save(any(Company.class))).then(returnsFirstArg());

    mockMvc
        .perform(
            put("/company/{apiId}", companyRef)
                .contentType(MediaType.APPLICATION_JSON)
                .content(
                    """
                      {
                        "name": "DUOS",
                        "description": "DUOS is reimagining freedom at any age by forming trusted relationships with older adults using technology and community to support fulfilling lives at home.",
                        "legalName": "Duos Living, Inc.",
                        "number": 1111,
                        "taxonomyId": "CARE_TEAM_COORDINATION",
                        "dashboardHref": "https://example.com"
                      }
                        """))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.id", is("1KlMnh9a")))
        .andExpect(jsonPath("$.name", is("DUOS")))
        .andExpect(
            jsonPath(
                "$.description",
                is(
                    "DUOS is reimagining freedom at any age by forming trusted relationships with older adults using technology and community to support fulfilling lives at home.")))
        .andExpect(jsonPath("$.legalName", is("Duos Living, Inc.")))
        .andExpect(jsonPath("$.number", is(1111)))
        .andDo(
            document(
                "update",
                requestFields(
                    nameField(),
                    legalNameField(),
                    numberField(),
                    descriptionField(),
                    taxonomyIdField(),
                    dashboardHrefField()),
                links(selfLink(), membersLink(), onboardDocsLink()),
                responseFields(
                    idField(),
                    nameField(),
                    descriptionField(),
                    legalNameField(),
                    numberField(),
                    stageField(),
                    statusField(),
                    createdField(),
                    lastModifiedField(),
                    hrefField(),
                    taxonomyField(),
                    fundraiseStatusField(),
                    hrefField(),
                    dashboardHrefField(),
                    hasPlatformAgreementField(),
                    linksField())));
  }

  @Test
  @WithRedesignUser(role = ROLE_RH_ADMIN)
  public void testUpdateOne_CompanyIpMarketplace_returns() throws Exception {
    var company = testCompany();
    var companyIpMarketplace = new CompanyIpMarketplace();
    companyIpMarketplace.setActivityType(CompanyIPMarketplaceType.ENTERPRISE_SELLER);
    companyIpMarketplace.setOrganizationType(
        CompanyIPMarketplaceOrganizationType.IDN_HEALTH_SYSTEM);
    companyIpMarketplace.setRegion(CompanyIPMarketplaceRegion.NORTHEAST);
    companyIpMarketplace.setCompany(company);
    company.setCompanyIpMarketplace(companyIpMarketplace);
    company.setStatus(CompanyStatus.ACTIVE);
    when(companyRepository.findByApiId(companyRef, MEMBERS)).thenReturn(Optional.of(company));
    when(companyRepository.save(any(Company.class))).then(returnsFirstArg());

    mockMvc
        .perform(
            put("/company/{apiId}", companyRef)
                .contentType(MediaType.APPLICATION_JSON)
                .content(
                    """
              {
                "name": "DUOS",
                "description": "DUOS is reimagining freedom at any age by forming trusted relationships with older adults using technology and community to support fulfilling lives at home.",
                "legalName": "Duos Living, Inc.",
                "number": 1111,
                "taxonomyId": "CARE_TEAM_COORDINATION",
                "dashboardHref": "https://example.com",
                "activityType": "ENTERPRISE_SELLER",
                "organizationType": "IDN_HEALTH_SYSTEM",
                "region": "NORTHEAST"
              }
                """))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.id", is("1KlMnh9a")))
        .andExpect(jsonPath("$.name", is("DUOS")))
        .andExpect(
            jsonPath(
                "$.description",
                is(
                    "DUOS is reimagining freedom at any age by forming trusted relationships with older adults using technology and community to support fulfilling lives at home.")))
        .andExpect(jsonPath("$.legalName", is("Duos Living, Inc.")))
        .andDo(
            document(
                "update-company-ip-marketplace",
                requestFields(
                    nameField(),
                    legalNameField(),
                    numberField(),
                    descriptionField(),
                    taxonomyIdField(),
                    dashboardHrefField(),
                    activityTypeField(),
                    organizationTypeField(),
                    regionField()),
                links(selfLink(), membersLink(), onboardDocsLink()),
                responseFields(
                    idField(),
                    nameField(),
                    descriptionField(),
                    legalNameField(),
                    statusField(),
                    createdField(),
                    lastModifiedField(),
                    hrefField(),
                    hasPlatformAgreementField(),
                    activityTypeFieldSE(),
                    organizationTypeFieldSE(),
                    regionFieldSE(),
                    linksField())));
  }

  @Test
  @WithRedesignUser(role = ROLE_RH_ADMIN)
  public void testUpdateOne_CompanyIpMarketplace_Should_Fail_If_RequiredFields_Are_Not_Sent()
      throws Exception {
    var company = testCompany();
    var companyIpMarketplace = new CompanyIpMarketplace();
    companyIpMarketplace.setActivityType(CompanyIPMarketplaceType.ENTERPRISE_SELLER);
    companyIpMarketplace.setOrganizationType(
        CompanyIPMarketplaceOrganizationType.IDN_HEALTH_SYSTEM);
    companyIpMarketplace.setRegion(CompanyIPMarketplaceRegion.NORTHEAST);
    companyIpMarketplace.setCompany(company);
    company.setCompanyIpMarketplace(companyIpMarketplace);
    company.setStatus(CompanyStatus.ACTIVE);
    when(companyRepository.findByApiId(companyRef, MEMBERS)).thenReturn(Optional.of(company));
    when(companyRepository.save(any(Company.class))).then(returnsFirstArg());

    mockMvc
        .perform(
            put("/company/{apiId}", companyRef)
                .contentType(MediaType.APPLICATION_JSON)
                .content(
                    """
      {
        "name": "DUOS",
        "description": "DUOS is reimagining freedom at any age by forming trusted relationships with older adults using technology and community to support fulfilling lives at home.",
        "legalName": "Duos Living, Inc.",
        "number": 1111,
        "taxonomyId": "CARE_TEAM_COORDINATION",
        "dashboardHref": "https://example.com"
      }
        """))
        .andExpect(status().isUnprocessableEntity())
        .andExpect(
            jsonPath(
                "$.errors[0].description",
                is("The company was defined as part of IP Marketplace and the field is required")));
  }

  @Test
  @WithRedesignUser(role = ROLE_RH_ADMIN)
  public void testUpdateOne_CompanyIpMarketplace_Should_Fail_If_ActivityType_Wants_Be_Changed()
      throws Exception {
    var company = testCompany();
    var companyIpMarketplace = new CompanyIpMarketplace();
    companyIpMarketplace.setActivityType(CompanyIPMarketplaceType.ENTERPRISE_SELLER);
    companyIpMarketplace.setOrganizationType(
        CompanyIPMarketplaceOrganizationType.IDN_HEALTH_SYSTEM);
    companyIpMarketplace.setRegion(CompanyIPMarketplaceRegion.NORTHEAST);
    companyIpMarketplace.setCompany(company);
    company.setCompanyIpMarketplace(companyIpMarketplace);
    company.setStatus(CompanyStatus.ACTIVE);
    when(companyRepository.findByApiId(companyRef, MEMBERS)).thenReturn(Optional.of(company));
    when(companyRepository.save(any(Company.class))).then(returnsFirstArg());

    mockMvc
        .perform(
            put("/company/{apiId}", companyRef)
                .contentType(MediaType.APPLICATION_JSON)
                .content(
                    """
      {
        "name": "DUOS",
        "description": "DUOS is reimagining freedom at any age by forming trusted relationships with older adults using technology and community to support fulfilling lives at home.",
        "legalName": "Duos Living, Inc.",
        "number": 1111,
        "taxonomyId": "CARE_TEAM_COORDINATION",
        "dashboardHref": "https://example.com",
        "activityType": "ENTERPRISE_BUYER",
        "organizationType": "IDN_HEALTH_SYSTEM",
        "region": "NORTHEAST"
      }
        """))
        .andExpect(status().isUnprocessableEntity())
        .andExpect(jsonPath("$.errors[0].description", is("Value can't be changed")));
  }

  @Test
  @WithRedesignUser(role = ROLE_RH_ADMIN)
  public void testUpdateOne_CompanyIpMarketplace_Should_Fail_If_Status_Is_Paused()
      throws Exception {
    var company = testCompany();
    var companyIpMarketplace = new CompanyIpMarketplace();
    companyIpMarketplace.setActivityType(CompanyIPMarketplaceType.ENTERPRISE_SELLER);
    companyIpMarketplace.setOrganizationType(
        CompanyIPMarketplaceOrganizationType.IDN_HEALTH_SYSTEM);
    companyIpMarketplace.setRegion(CompanyIPMarketplaceRegion.NORTHEAST);
    companyIpMarketplace.setCompany(company);
    company.setCompanyIpMarketplace(companyIpMarketplace);
    company.setStatus(CompanyStatus.ACTIVE);
    when(companyRepository.findByApiId(companyRef, MEMBERS)).thenReturn(Optional.of(company));
    when(companyRepository.save(any(Company.class))).then(returnsFirstArg());

    mockMvc
        .perform(
            put("/company/{apiId}", companyRef)
                .contentType(MediaType.APPLICATION_JSON)
                .content(
                    """
      {
        "name": "DUOS",
        "description": "DUOS is reimagining freedom at any age by forming trusted relationships with older adults using technology and community to support fulfilling lives at home.",
        "legalName": "Duos Living, Inc.",
        "number": 1111,
        "taxonomyId": "CARE_TEAM_COORDINATION",
        "dashboardHref": "https://example.com",
        "activityType": "ENTERPRISE_SELLER",
        "organizationType": "IDN_HEALTH_SYSTEM",
        "region": "NORTHEAST",
        "status": "PAUSED"
      }
        """))
        .andExpect(status().isUnprocessableEntity())
        .andExpect(
            jsonPath(
                "$.errors[0].description",
                is(
                    "An ip_marketplace company can't be PAUSED only ACTIVE and ARCHIVED are valid entries")));
  }

  @ParameterizedTest
  @EnumSource(
      value = CompanyStage.class,
      names = {"THEME", "CONCEPT", "NEW_CO"})
  @WithRedesignUser(role = ROLE_RH_ADMIN)
  public void testUpdateOne_Fail_Invalid_FundraiseStatus_Assignment(CompanyStage stage)
      throws Exception {
    var company = testCompany();
    company.setStatus(CompanyStatus.ACTIVE);
    company.setStage(stage);
    when(companyRepository.findByApiId(companyRef, MEMBERS)).thenReturn(Optional.of(company));
    when(companyRepository.save(any(Company.class))).then(returnsFirstArg());
    var payload =
        """
              {
                "name": "DUOS",
                "description": "DUOS is reimagining freedom at any age by forming trusted relationships with older adults using technology and community to support fulfilling lives at home.",
                "legalName": "Duos Living, Inc.",
                "number": 1111,
                "taxonomyId": "CARE_TEAM_COORDINATION",
                "fundraiseStatus": "SERIES_A",
                "stage": "%s"
              }
                """;
    mockMvc
        .perform(
            put("/company/{apiId}", companyRef)
                .contentType(MediaType.APPLICATION_JSON)
                .content(String.format(payload, stage)))
        .andExpect(status().isUnprocessableEntity())
        .andExpect(jsonPath("$.errors[0].name", is("fundraiseStatus")))
        .andExpect(jsonPath("$.errors[0].rejectedValue", is("Series A")))
        .andExpect(jsonPath("$.errors[0].description", is("Can only be assigned to OP_CO")));
  }

  @Test
  @WithRedesignUser(role = ROLE_RH_ADMIN)
  public void testUpdateOne_Change_To_PAUSED_Or_ARCHIVED() throws Exception {
    var personRef = PersonRef.of("anytest@redesignhealth.com");
    var person = Person.from(personRef);
    var company = testCompany();
    company.setOnboardDocsFolderId("any_id");
    var companyMember = new CompanyMember(company, person, CompanyMemberStatus.ACTIVE);
    company.setMembers(Set.of(companyMember));
    doThrow(new GoogleDriveException(new Exception("test exception")))
        .when(googleDriveClient)
        .revokeAccess("any_id", personRef);
    company.setStatus(CompanyStatus.ACTIVE);
    when(companyRepository.findByApiId(companyRef, MEMBERS)).thenReturn(Optional.of(company));
    when(companyRepository.save(any(Company.class))).then(returnsFirstArg());
    mockMvc
        .perform(
            put("/company/{apiId}", companyRef)
                .contentType(MediaType.APPLICATION_JSON)
                .content(
                    """
                {
                  "name": "DOUS",
                  "description": "DUOS is reimagining freedom at any age by forming trusted relationships with older adults using technology and community to support fulfilling lives at home.",
                  "legalName": "Dous Living, Inc.",
                  "number": 1111,
                  "status": "PAUSED"
                }
                """))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.id", is("1KlMnh9a")))
        .andExpect(jsonPath("$.name", is("DOUS")))
        .andExpect(
            jsonPath(
                "$.description",
                is(
                    "DUOS is reimagining freedom at any age by forming trusted relationships with older adults using technology and community to support fulfilling lives at home.")))
        .andExpect(jsonPath("$.legalName", is("Dous Living, Inc.")))
        .andExpect(jsonPath("$.number", is(1111)));
    verify(companyMemberAuditRepository, times(1)).save(any(CompanyMemberAudit.class));
  }

  @Test
  @WithRedesignUser(role = ROLE_RH_ADMIN)
  public void testUpdateOne_Change_To_PAUSED_Or_ARCHIVED_Member_Inactive_Should_Not_Save()
      throws Exception {
    var personRef = PersonRef.of("anytest@redesignhealth.com");
    var person = Person.from(personRef);
    var company = testCompany();
    company.setOnboardDocsFolderId("any_id");
    var companyMember = new CompanyMember(company, person, CompanyMemberStatus.INACTIVE);
    company.setMembers(Set.of(companyMember));
    doThrow(new GoogleDriveException(new Exception("test exception")))
        .when(googleDriveClient)
        .revokeAccess("any_id", personRef);
    company.setStatus(CompanyStatus.ACTIVE);
    when(companyRepository.findByApiId(companyRef, MEMBERS)).thenReturn(Optional.of(company));
    when(companyRepository.save(any(Company.class))).then(returnsFirstArg());
    mockMvc
        .perform(
            put("/company/{apiId}", companyRef)
                .contentType(MediaType.APPLICATION_JSON)
                .content(
                    """
                {
                  "name": "DOUS",
                  "description": "DUOS is reimagining freedom at any age by forming trusted relationships with older adults using technology and community to support fulfilling lives at home.",
                  "legalName": "Dous Living, Inc.",
                  "number": 1111,
                  "status": "PAUSED"
                }
                """))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.id", is("1KlMnh9a")))
        .andExpect(jsonPath("$.name", is("DOUS")))
        .andExpect(
            jsonPath(
                "$.description",
                is(
                    "DUOS is reimagining freedom at any age by forming trusted relationships with older adults using technology and community to support fulfilling lives at home.")))
        .andExpect(jsonPath("$.legalName", is("Dous Living, Inc.")))
        .andExpect(jsonPath("$.number", is(1111)));
    verify(companyMemberAuditRepository, never()).save(any(CompanyMemberAudit.class));
  }

  @Test
  @WithRedesignUser(role = ROLE_RH_ADMIN)
  public void testUpdateOne_Fail_If_NEW_CO_Stage_Doesnt_Have_LinkedCompany() throws Exception {
    updateCompanyWithStageConceptOrNewCoFailure(CompanyStage.NEW_CO);
  }

  @Test
  @WithRedesignUser(role = ROLE_RH_ADMIN)
  public void testCreateConflicts_returns() throws Exception {
    when(companyRepository.findByApiId(companyRef)).thenReturn(Optional.of(testCompany()));
    when(companyConflictRepository.findByMemberOfId(testCompany())).thenReturn(List.of());
    when(companyConflictRepository.save(any(CompanyConflict.class))).then(returnsFirstArg());
    doNothing().when(companyConflictRepository).delete(any(CompanyConflict.class));
    // writeValueAsString has issues getting the toString from the CompanyRef and this converting in
    // string all the object
    var update = "{\"conflicts\":[\"xyzhij\"]}"; // setting this value hardcoded for now
    mockMvc
        .perform(
            put("/company/{apiId}/conflicts", companyRef)
                .contentType(MediaType.APPLICATION_JSON)
                .content(update))
        .andExpect(status().isOk())
        .andDo(document("create-conflicts", requestFields(conflictsField())));
  }

  @Test
  @WithRedesignUser(role = ROLE_RH_ADMIN)
  public void testCreateConflicts_With_Members_In_Common_should_fail() throws Exception {
    var company = testCompany();
    var company1 = testCompany("xyzhij");
    var email = "common@redesignhealth.com";
    var person = Person.from(email);
    var companyMember1 = new CompanyMember(company, person, CompanyMemberStatus.ACTIVE);
    var companyMember2 = new CompanyMember(company1, person, CompanyMemberStatus.ACTIVE);
    var companyMemberDto1 = new CompanyMemberDto(person, companyMember1);
    var companyMemberDto2 = new CompanyMemberDto(person, companyMember2);
    when(companyRepository.getMembers(companyRef)).thenReturn(List.of(companyMemberDto1));
    when(companyRepository.getMembers(CompanyRef.of("xyzhij")))
        .thenReturn(List.of(companyMemberDto2));
    when(companyRepository.findByApiId(companyRef)).thenReturn(Optional.of(testCompany()));
    when(companyConflictRepository.findByMemberOfId(testCompany())).thenReturn(List.of());
    when(companyConflictRepository.save(any(CompanyConflict.class))).then(returnsFirstArg());
    doNothing().when(companyConflictRepository).delete(any(CompanyConflict.class));
    // writeValueAsString has issues getting the toString from the CompanyRef and this converting in
    // string all the object
    var update = "{\"conflicts\":[\"xyzhij\"]}"; // setting this value hardcoded for now
    mockMvc
        .perform(
            put("/company/{apiId}/conflicts", companyRef)
                .contentType(MediaType.APPLICATION_JSON)
                .content(update))
        .andExpect(status().isForbidden())
        .andExpect(
            (result) ->
                assertTrue(
                    result.getResolvedException() instanceof ForbiddenAddConflictsException));
  }

  @Test
  @WithRedesignUser(role = ROLE_RH_ADMIN)
  public void testCreateConflicts_If_Exist_Should_Not_Save() throws Exception {
    var company = testCompany();
    var companyInConflict = new CompanyConflict();
    companyInConflict.setMemberOfId(company);
    companyInConflict.setCompanyConflictsId(Company.from("xyzhij"));
    when(companyRepository.findByApiId(companyRef)).thenReturn(Optional.of(company));
    when(companyConflictRepository.findByMemberOfId(company))
        .thenReturn(List.of(companyInConflict));
    // writeValueAsString has issues getting the toString from the CompanyRef and this converting in
    // string all the object
    var update = "{\"conflicts\":[\"xyzhij\"]}"; // setting this value hardcoded for now
    mockMvc
        .perform(
            put("/company/{apiId}/conflicts", companyRef)
                .contentType(MediaType.APPLICATION_JSON)
                .content(update))
        .andExpect(status().isOk());
    verify(companyConflictRepository, never()).save(any(CompanyConflict.class));
    verify(companyConflictRepository, never()).delete(any(CompanyConflict.class));
  }

  @Test
  @WithRedesignUser(role = ROLE_RH_ADMIN)
  public void testCreateConflicts_If_Company_In_Payload_Doesnt_Exist_Should_Not_Save_And_Remove()
      throws Exception {
    var company = testCompany();
    var companyInConflict = new CompanyConflict();
    companyInConflict.setMemberOfId(company);
    companyInConflict.setCompanyConflictsId(Company.from("xyzhij"));
    when(companyRepository.findByApiId(companyRef)).thenReturn(Optional.of(company));
    when(companyConflictRepository.findByMemberOfId(company))
        .thenReturn(List.of(companyInConflict));
    // writeValueAsString has issues getting the toString from the CompanyRef and this converting in
    // string all the object
    var update = "{\"conflicts\":[\"not_found\"]}"; // setting this value hardcoded for now
    mockMvc
        .perform(
            put("/company/{apiId}/conflicts", companyRef)
                .contentType(MediaType.APPLICATION_JSON)
                .content(update))
        .andExpect(status().isOk());
    verify(companyConflictRepository, never()).save(any(CompanyConflict.class));
    verify(companyConflictRepository, never()).delete(any(CompanyConflict.class));
  }

  @Test
  @WithRedesignUser(role = ROLE_RH_ADMIN)
  public void testCreateConflicts_If_Some_Company_In_Payload_Exist_And_It_Is_New_Should_Save()
      throws Exception {
    var company = testCompany();
    var companyExistApiId = "company_exist_api_id";
    var companyExist = Company.from(companyExistApiId);
    var companyForConflict = Company.from("xyzhij");
    var companyInConflict = new CompanyConflict();
    companyInConflict.setMemberOfId(company);
    companyInConflict.setCompanyConflictsId(companyForConflict);
    when(companyRepository.findByApiId(companyRef)).thenReturn(Optional.of(company));
    when(companyRepository.findByApiId(CompanyRef.of(companyExistApiId)))
        .thenReturn(Optional.of(companyExist));
    when(companyRepository.findByApiId(CompanyRef.of("xyzhij")))
        .thenReturn(Optional.of(companyForConflict));
    when(companyConflictRepository.findByMemberOfId(company))
        .thenReturn(List.of(companyInConflict));
    when(companyConflictRepository.findCompanyConflictsByMemberOfIdAndCompanyConflictsId(
            company, companyForConflict))
        .thenReturn(companyInConflict);
    // writeValueAsString has issues getting the toString from the CompanyRef and this converting in
    // string all the object
    var update =
        "{\"conflicts\":[\"not_found\", \"company_exist_api_id\"]}"; // setting this value hardcoded
    // for now
    mockMvc
        .perform(
            put("/company/{apiId}/conflicts", companyRef)
                .contentType(MediaType.APPLICATION_JSON)
                .content(update))
        .andExpect(status().isOk());
    verify(companyConflictRepository, times(1)).save(any(CompanyConflict.class));
    verify(companyConflictRepository, times(1)).delete(any(CompanyConflict.class));
  }

  @Test
  @WithRedesignUser(role = ROLE_RH_ADMIN)
  public void testCreateConflicts_If_Company_Equals_To_Conflict_Should_Not_Save() throws Exception {
    var apiRefId = "xyzhij";
    var company = Company.from(apiRefId);
    when(companyRepository.findByApiId(CompanyRef.of(apiRefId))).thenReturn(Optional.of(company));
    when(companyConflictRepository.findByMemberOfId(company)).thenReturn(List.of());
    // writeValueAsString has issues getting the toString from the CompanyRef and this converting in
    // string all the object
    var update = "{\"conflicts\":[\"xyzhij\"]}"; // setting this value hardcoded for now
    mockMvc
        .perform(
            put("/company/{apiId}/conflicts", apiRefId)
                .contentType(MediaType.APPLICATION_JSON)
                .content(update))
        .andExpect(status().isOk());
    verify(companyConflictRepository, never()).save(any(CompanyConflict.class));
    verify(companyConflictRepository, never()).delete(any(CompanyConflict.class));
  }

  @Test
  @WithRedesignUser(role = ROLE_RH_ADMIN)
  public void testCreateConflicts_Update_With_New_Elements() throws Exception {
    var apiRefId = "xyzhij";
    var companyConflictApiRefId1 = "hgtrfjk";
    var companyConflictApiRefId2 = "asjghjk";
    var company = Company.from(apiRefId);
    var companyNew1 = Company.from(companyConflictApiRefId1);
    var companyNew2 = Company.from(companyConflictApiRefId2);
    var companyInConflict1 = new CompanyConflict();
    companyInConflict1.setMemberOfId(company);
    companyInConflict1.setCompanyConflictsId(Company.from("pershqQ"));
    var companyInConflict2 = new CompanyConflict();
    companyInConflict2.setMemberOfId(company);
    companyInConflict2.setCompanyConflictsId(Company.from(companyConflictApiRefId2));
    when(companyRepository.findByApiId(CompanyRef.of(apiRefId))).thenReturn(Optional.of(company));
    when(companyRepository.findByApiId(CompanyRef.of(companyConflictApiRefId1)))
        .thenReturn(Optional.of(companyNew1));
    when(companyRepository.findByApiId(CompanyRef.of(companyConflictApiRefId2)))
        .thenReturn(Optional.of(companyNew2));
    when(companyConflictRepository.findByMemberOfId(company))
        .thenReturn(List.of(companyInConflict1, companyInConflict2));
    when(companyConflictRepository.findCompanyConflictsByMemberOfIdAndCompanyConflictsId(
            company, companyNew2))
        .thenReturn(companyInConflict2);
    doNothing().when(companyConflictRepository).delete(any(CompanyConflict.class));
    when(companyConflictRepository.save(any(CompanyConflict.class))).then(returnsFirstArg());
    // writeValueAsString has issues getting the toString from the CompanyRef and this converting in
    // string all the object
    var update =
        "{\"conflicts\":[\"hgtrfjk\", \"pershqQ\"]}"; // setting this value hardcoded for now
    mockMvc
        .perform(
            put("/company/{apiId}/conflicts", apiRefId)
                .contentType(MediaType.APPLICATION_JSON)
                .content(update))
        .andExpect(status().isOk());
    verify(companyConflictRepository, times(1)).save(any(CompanyConflict.class));
    verify(companyConflictRepository, times(1)).delete(any(CompanyConflict.class));
  }

  @Test
  @WithRedesignUser(role = ROLE_RH_ADMIN)
  public void testCreateConflicts_If_Conflicts_Is_Not_Present_And_Payload_Is_Empty_Should_Not_Save()
      throws Exception {
    var apiRefId = "xyzhij";
    var company = Company.from(apiRefId);
    when(companyRepository.findByApiId(CompanyRef.of(apiRefId))).thenReturn(Optional.of(company));
    when(companyConflictRepository.findByMemberOfId(company)).thenReturn(List.of());
    // writeValueAsString has issues getting the toString from the CompanyRef and this converting in
    // string all the object
    var update = "{\"conflicts\":[]}"; // setting this value hardcoded for now
    mockMvc
        .perform(
            put("/company/{apiId}/conflicts", apiRefId)
                .contentType(MediaType.APPLICATION_JSON)
                .content(update))
        .andExpect(status().isOk());
    verify(companyConflictRepository, never()).save(any(CompanyConflict.class));
    verify(companyConflictRepository, never()).delete(any(CompanyConflict.class));
  }

  @Test
  @WithRedesignUser(role = ROLE_RH_ADMIN)
  public void testCreateConflicts_If_Conflicts_Is_Present_And_Payload_Is_Empty_Should_Delete()
      throws Exception {
    var apiRefId = "xyzhij";
    var anotherApiRefId = "asdghk";
    var company = Company.from(apiRefId);
    var anotherCompany = Company.from(anotherApiRefId);
    when(companyRepository.findByApiId(CompanyRef.of(apiRefId))).thenReturn(Optional.of(company));
    when(companyRepository.findByApiId(CompanyRef.of(anotherApiRefId)))
        .thenReturn(Optional.of(anotherCompany));
    var companyInConflict = new CompanyConflict();
    companyInConflict.setMemberOfId(company);
    companyInConflict.setCompanyConflictsId(anotherCompany);
    when(companyConflictRepository.findByMemberOfId(company))
        .thenReturn(List.of(companyInConflict));
    when(companyConflictRepository.findCompanyConflictsByMemberOfIdAndCompanyConflictsId(
            company, anotherCompany))
        .thenReturn(companyInConflict);

    // writeValueAsString has issues getting the toString from the CompanyRef and this converting in
    // string all the object
    var update = "{\"conflicts\":[]}"; // setting this value hardcoded for now
    mockMvc
        .perform(
            put("/company/{apiId}/conflicts", apiRefId)
                .contentType(MediaType.APPLICATION_JSON)
                .content(update))
        .andExpect(status().isOk());
    verify(companyConflictRepository, never()).save(any(CompanyConflict.class));
    verify(companyConflictRepository, times(1)).delete(any(CompanyConflict.class));
  }

  @Test
  @WithRedesignUser(role = ROLE_RH_ADMIN)
  public void testCreateConflicts_If_Conflicts_Is_Not_Present_Should_Not_Save() throws Exception {
    var apiRefId = "xyzhij";
    var company = Company.from(apiRefId);
    when(companyRepository.findByApiId(CompanyRef.of(apiRefId))).thenReturn(Optional.of(company));
    when(companyConflictRepository.findByMemberOfId(company)).thenReturn(List.of());
    // writeValueAsString has issues getting the toString from the CompanyRef and this converting in
    // string all the object
    var update = "{}"; // setting this value hardcoded for now
    mockMvc
        .perform(
            put("/company/{apiId}/conflicts", apiRefId)
                .contentType(MediaType.APPLICATION_JSON)
                .content(update))
        .andExpect(status().isOk());
    verify(companyConflictRepository, never()).save(any(CompanyConflict.class));
    verify(companyConflictRepository, never()).delete(any(CompanyConflict.class));
  }

  @Test
  @WithRedesignUser(role = ROLE_OP_CO_CONTRACTOR, memberOf = TEST_COMPANY_ID)
  public void testGetConflicts_returns() throws Exception {
    var company = testCompany(testPerson());
    var companyInConflict = Company.from("1KlMnh9a");
    companyInConflict.setStatus(CompanyStatus.ACTIVE);
    companyInConflict.setStage(CompanyStage.THEME);
    companyInConflict.setName("ConflictName");
    companyInConflict.setLegalName("ConflictLegalName");
    companyInConflict.setDescription("ConflictDescription");
    companyInConflict.setCreated(Instant.EPOCH);
    companyInConflict.setLastModified(Instant.EPOCH);
    companyInConflict.setNumber(1L);
    companyInConflict.setTaxonomyId(testCompany().getTaxonomyId());
    when(companyRepository.findByApiId(companyRef)).thenReturn(Optional.of(company));
    var companyConflict = new CompanyConflict();
    companyConflict.setMemberOfId(company);
    companyConflict.setCompanyConflictsId(companyInConflict);
    when(companyConflictRepository.findByMemberOfId(company)).thenReturn(List.of(companyConflict));
    mockMvc
        .perform(get("/company/{apiId}/conflicts", companyRef))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.content[0].id", is("1KlMnh9a")))
        .andDo(
            document(
                "get-conflicts",
                queryParameters(),
                responseFields(
                        subsectionWithPath("content").description("List of companies"),
                        linksField())
                    .andWithPrefix(
                        "content[].",
                        idField(),
                        nameField(),
                        legalNameField(),
                        numberField(),
                        descriptionField(),
                        statusField(),
                        stageField(),
                        createdField(),
                        lastModifiedField(),
                        taxonomyField(),
                        linksField()),
                links(companyLink())));
  }

  @Test
  @WithRedesignUser(role = ROLE_RH_ADMIN)
  public void testUpdateOne_Try_to_Change_A_THEME_To_Another_Stage() throws Exception {
    changeState(CompanyStage.THEME, CompanyStage.OP_CO);
  }

  @Test
  @WithRedesignUser(role = ROLE_RH_ADMIN)
  public void testUpdateOne_Try_to_Change_A_CONCEPT_To_Another_Stage() throws Exception {
    changeState(CompanyStage.CONCEPT, CompanyStage.OP_CO);
  }

  @Test
  @WithRedesignUser(role = ROLE_RH_ADMIN)
  public void testUpdateOne_Try_to_Change_A_OPCO_To_Another_Stage() throws Exception {
    changeState(CompanyStage.OP_CO, CompanyStage.NEW_CO);
  }

  @Test
  @WithRedesignUser(role = ROLE_RH_ADMIN)
  public void testUpdateOne_Try_to_Change_A_NEWCO_To_Another_Stage_Different_To_OPCO()
      throws Exception {
    changeState(CompanyStage.OP_CO, CompanyStage.NEW_CO);
  }

  @Test
  @WithRedesignUser(role = ROLE_RH_ADMIN)
  public void testUpdateOne_Try_to_Change_A_NEWCO_To_OPCO() throws Exception {
    var company = testCompany();
    company.setStatus(CompanyStatus.ACTIVE);
    company.setStage(CompanyStage.NEW_CO);
    when(companyRepository.findByApiId(companyRef, MEMBERS)).thenReturn(Optional.of(company));
    when(companyRepository.save(any(Company.class))).then(returnsFirstArg());
    mockMvc
        .perform(
            put("/company/{apiId}", companyRef)
                .contentType(MediaType.APPLICATION_JSON)
                .content(
                    """
                 {
                  "name": "DOUS",
                  "description": "DUOS is reimagining freedom at any age by forming trusted relationships with older adults using technology and community to support fulfilling lives at home.",
                  "legalName": "Dous Living, Inc.",
                  "number": 1111,
                  "stage": "OP_CO"
                }
                """))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.id", is("1KlMnh9a")))
        .andExpect(jsonPath("$.name", is("DOUS")))
        .andExpect(
            jsonPath(
                "$.description",
                is(
                    "DUOS is reimagining freedom at any age by forming trusted relationships with older adults using technology and community to support fulfilling lives at home.")))
        .andExpect(jsonPath("$.legalName", is("Dous Living, Inc.")))
        .andExpect(jsonPath("$.number", is(1111)));
  }

  @Test
  @WithRedesignUser(role = ROLE_RH_ADMIN)
  public void testUpdateOne_Try_to_Change_LinkedApiId_To_OPCO_Promoted_From_NEW_CO()
      throws Exception {
    var company = testCompany();
    company.setStatus(CompanyStatus.ACTIVE);
    company.setStage(CompanyStage.OP_CO);
    company.setLinkedApiId(CompanyRef.of("asghjf"));
    when(companyRepository.findByApiId(companyRef, MEMBERS)).thenReturn(Optional.of(company));
    when(companyRepository.save(any(Company.class))).then(returnsFirstArg());
    var comnandAsString =
        "{\"number\":1111,\"legalName\":\"Ever/body Inc.\",\"name\":\"Ever/body\","
            + "\"description\":\"Cosmetic dermatology for every tone, texture, age, gender, and body.\","
            + "\"stage\":\""
            + CompanyStage.OP_CO.toString()
            + "\",\"linkedApiId\":\"uadshJk\"}";
    mockMvc
        .perform(
            put("/company/{apiId}", companyRef)
                .contentType(MediaType.APPLICATION_JSON)
                .content(comnandAsString))
        .andExpect(status().isBadRequest())
        .andExpect(
            (result) ->
                assertTrue(result.getResolvedException() instanceof LinkedCompanyException));
  }

  @Test
  @WithRedesignUser(role = ROLE_RH_ADMIN)
  public void testUpdateOne_Try_to_Change_name_To_OPCO_Promoted_From_NEW_CO() throws Exception {
    var company = testCompany();
    company.setStatus(CompanyStatus.ACTIVE);
    company.setStage(CompanyStage.OP_CO);
    var companyLinked = Company.from("asghjf");
    companyLinked.setStage(CompanyStage.CONCEPT);
    company.setLinkedApiId(CompanyRef.of("asghjf"));
    when(companyRepository.findByApiId(companyRef, MEMBERS)).thenReturn(Optional.of(company));
    when(companyRepository.findByApiId(CompanyRef.of("asghjf")))
        .thenReturn(Optional.of(companyLinked));
    when(companyRepository.save(any(Company.class))).then(returnsFirstArg());
    var comnandAsString =
        "{\"number\":1111,\"legalName\":\"Ever/body Inc.\",\"name\":\"Ever/body Changed\","
            + "\"description\":\"Cosmetic dermatology for every tone, texture, age, gender, and body.\","
            + "\"stage\":\""
            + CompanyStage.OP_CO.toString()
            + "\",\"linkedApiId\":\"asghjf\"}";
    mockMvc
        .perform(
            put("/company/{apiId}", companyRef)
                .contentType(MediaType.APPLICATION_JSON)
                .content(comnandAsString))
        .andExpect(status().isOk());
  }

  @Test
  @WithRedesignUser(role = ROLE_RH_ADMIN)
  public void testGetMembers_404UnknownCompany() throws Exception {

    mockMvc
        .perform(get("/company/{apiId}/members", "unknown").contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isNotFound())
        .andExpect(
            (result) ->
                assertTrue(result.getResolvedException() instanceof CompanyNotFoundException));
  }

  @Test
  @WithRedesignUser(role = ROLE_OP_CO_CONTRACTOR, memberOf = TEST_COMPANY_ID)
  public void testGetMembers_returnsMembers() throws Exception {
    var person = testPerson(ROLE_RH_ADMIN);

    var company = testCompany();
    var companyMemberDto =
        new CompanyMemberDto(
            person, new CompanyMember(company, person, CompanyMemberStatus.ACTIVE));
    person.setMemberOf(Set.of(new CompanyMember(company, person, CompanyMemberStatus.ACTIVE)));

    when(companyRepository.findByApiId(companyRef)).thenReturn(Optional.of(company));

    when(companyRepository.getMembers(companyRef)).thenReturn(List.of(companyMemberDto));

    mockMvc
        .perform(get("/company/{apiId}/members", companyRef))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.content[0].email", is("test@redesignhealth.com")))
        .andDo(
            document(
                "get-members",
                responseFields(linksField())
                    .andWithPrefix(
                        "content[].",
                        emailField(),
                        givenNameField(),
                        familyNameField(),
                        rolesField(),
                        roleField(),
                        statusField(),
                        createdField(),
                        lastModifiedField(),
                        linksField())));
  }

  @Test
  @WithRedesignUser(role = ROLE_RH_ADMIN)
  public void testAddMember_404UnknownCompany() throws Exception {
    var companyMemberCommand = new CompanyMemberCommand();
    companyMemberCommand.setStatus(Optional.of(CompanyMemberStatus.ACTIVE));
    mockMvc
        .perform(
            put("/company/{apiId}/member/{email}", "unknown", "test@redesignhealth.com")
                .contentType(MediaType.APPLICATION_JSON)
                .content(mapper.writeValueAsString(companyMemberCommand)))
        .andExpect(status().isNotFound())
        .andExpect(
            (result) ->
                assertTrue(result.getResolvedException() instanceof CompanyNotFoundException));
  }

  @Test
  @WithRedesignUser(role = ROLE_RH_ADMIN)
  public void testAddMember_404UnknownPerson() throws Exception {
    when(companyRepository.findByApiId(companyRef, MEMBERS)).thenReturn(Optional.of(testCompany()));
    var companyMemberCommand = new CompanyMemberCommand();
    mockMvc
        .perform(
            put("/company/{apiId}/member/{email}", companyRef, "unknown@redesignhealth.com")
                .contentType(MediaType.APPLICATION_JSON)
                .content(mapper.writeValueAsString(companyMemberCommand)))
        .andExpect(status().isNotFound())
        .andExpect(
            (result) ->
                assertTrue(result.getResolvedException() instanceof PersonNotFoundException));
  }

  @Test
  @WithRedesignUser(role = ROLE_RH_ADMIN)
  public void testAddMember_success() throws Exception {
    var company = testCompany(testPerson());
    var companyMemberCommand = new CompanyMemberCommand();
    companyMemberCommand.setStatus(Optional.of(CompanyMemberStatus.ACTIVE));
    when(companyRepository.findByApiId(companyRef, MEMBERS)).thenReturn(Optional.of(company));
    when(personRepository.findByEmail(PersonRef.of("new@redesignhealth.com"), MEMBER_OF))
        .thenReturn(Optional.of(Person.from(PersonRef.of("new@redesignhealth.com"))));

    mockMvc
        .perform(
            put("/company/{apiId}/member/{email}", companyRef, "new@redesignhealth.com")
                .contentType(MediaType.APPLICATION_JSON)
                .content(mapper.writeValueAsString(companyMemberCommand)))
        .andExpect(status().isOk())
        .andDo(document("add-member"));
    verify(companyRepository, times(1)).save(any(Company.class));
    verify(companyMemberAuditRepository, times(1)).save(any(CompanyMemberAudit.class));
  }

  @Test
  @WithRedesignUser(role = ROLE_RH_ADMIN)
  public void testAddMember_CEO_exists_Active_In_Another_Company() throws Exception {
    var company = testCompany(testPerson());
    var companyMemberCommand = new CompanyMemberCommand();
    var person = Person.from(PersonRef.of("new@redesignhealth.com"));
    person.setCeo(new Ceo());
    var company2 = testCompany("anyCompanyId");
    var companyMember = new CompanyMember(company2, person, CompanyMemberStatus.ACTIVE);
    person.setMemberOf(Set.of(companyMember));
    companyMemberCommand.setStatus(Optional.of(CompanyMemberStatus.ACTIVE));
    when(companyRepository.findByApiId(companyRef, MEMBERS)).thenReturn(Optional.of(company));
    when(personRepository.findByEmail(PersonRef.of("new@redesignhealth.com"), MEMBER_OF))
        .thenReturn(Optional.of(person));

    mockMvc
        .perform(
            put("/company/{apiId}/member/{email}", companyRef, "new@redesignhealth.com")
                .contentType(MediaType.APPLICATION_JSON)
                .content(mapper.writeValueAsString(companyMemberCommand)))
        .andExpect(status().isForbidden())
        .andExpect(jsonPath("$.message", is("CEO only can be active in one Company")));
  }

  @Test
  @WithRedesignUser(role = ROLE_RH_ADMIN)
  public void testAddMember_Fail_For_Theme() throws Exception {
    var company = testCompany(testPerson());
    company.setStage(CompanyStage.THEME);
    var companyMemberCommand = new CompanyMemberCommand();
    companyMemberCommand.setStatus(Optional.of(CompanyMemberStatus.ACTIVE));
    when(companyRepository.findByApiId(companyRef, MEMBERS)).thenReturn(Optional.of(company));
    mockMvc
        .perform(
            put("/company/{apiId}/member/{email}", companyRef, "new@redesignhealth.com")
                .contentType(MediaType.APPLICATION_JSON)
                .content(mapper.writeValueAsString(companyMemberCommand)))
        .andExpect(status().isForbidden())
        .andExpect(
            (result) ->
                assertTrue(result.getResolvedException() instanceof ForbiddenAddMemberException));
  }

  @Test
  @WithRedesignUser(role = ROLE_RH_ADMIN)
  public void testAddMember_Fail_For_Concept() throws Exception {
    var company = testCompany(testPerson());
    company.setStage(CompanyStage.CONCEPT);
    var companyMemberCommand = new CompanyMemberCommand();
    companyMemberCommand.setStatus(Optional.of(CompanyMemberStatus.ACTIVE));
    when(companyRepository.findByApiId(companyRef, MEMBERS)).thenReturn(Optional.of(company));
    mockMvc
        .perform(
            put("/company/{apiId}/member/{email}", companyRef, "new@redesignhealth.com")
                .contentType(MediaType.APPLICATION_JSON)
                .content(mapper.writeValueAsString(companyMemberCommand)))
        .andExpect(status().isForbidden())
        .andExpect(
            (result) ->
                assertTrue(result.getResolvedException() instanceof ForbiddenAddMemberException));
  }

  @Test
  @WithRedesignUser(role = ROLE_RH_ADMIN)
  public void testAddMember_403() throws Exception {
    var companyToAdd = testCompany(testPerson());
    var companyMemberCommand = new CompanyMemberCommand();
    companyMemberCommand.setStatus(Optional.of(CompanyMemberStatus.ACTIVE));
    var company1 = testCompany("asdjhK");
    var companyConflict = new CompanyConflict();
    companyConflict.setMemberOfId(company1);
    companyConflict.setCompanyConflictsId(companyToAdd);
    var personMember = Person.from(PersonRef.of("new@redesignhealth.com"));
    var companyMember = new CompanyMember(company1, personMember, CompanyMemberStatus.ACTIVE);
    personMember.setMemberOf(Set.of(companyMember));

    when(companyRepository.findByApiId(companyRef, MEMBERS)).thenReturn(Optional.of(companyToAdd));
    when(personRepository.findByEmail(PersonRef.of("new@redesignhealth.com"), MEMBER_OF))
        .thenReturn(Optional.of(personMember));
    when(companyConflictRepository.findByMemberOfId(companyToAdd)).thenReturn(List.of());
    when(companyConflictRepository.findByCompanyConflictsId(companyToAdd))
        .thenReturn(List.of(companyConflict));

    mockMvc
        .perform(
            put("/company/{apiId}/member/{email}", companyRef, "new@redesignhealth.com")
                .contentType(MediaType.APPLICATION_JSON)
                .content(mapper.writeValueAsString(companyMemberCommand)))
        .andExpect(status().isForbidden())
        .andExpect(
            (result) ->
                assertTrue(result.getResolvedException() instanceof ForbiddenAddMemberException));
  }

  @Test
  @WithRedesignUser(role = ROLE_RH_ADMIN)
  public void testDeleteMember_404UnknownCompany() throws Exception {
    mockMvc
        .perform(delete("/company/{apiId}/member/{email}", "unknown", "test@redesignhealth.com"))
        .andExpect(status().isNotFound())
        .andExpect(
            (result) ->
                assertTrue(result.getResolvedException() instanceof CompanyNotFoundException));
    verify(companyRepository, never()).save(any(Company.class));
    verify(companyMemberAuditRepository, never()).save(any(CompanyMemberAudit.class));
  }

  @Test
  @WithRedesignUser(role = ROLE_RH_ADMIN)
  public void testDeleteMember_404UnknownPerson() throws Exception {
    when(companyRepository.findByApiId(companyRef)).thenReturn(Optional.of(Fixtures.testCompany()));

    mockMvc
        .perform(
            delete("/company/{apiId}/member/{email}", companyRef, "unknown@redesignhealth.com"))
        .andExpect(status().isNotFound())
        .andExpect(
            (result) ->
                assertTrue(result.getResolvedException() instanceof PersonNotFoundException));
    verify(companyRepository, never()).save(any(Company.class));
    verify(companyMemberAuditRepository, never()).save(any(CompanyMemberAudit.class));
  }

  @Test
  @WithRedesignUser(role = ROLE_RH_ADMIN)
  public void testDeleteMember_success() throws Exception {
    var company = testCompany(testPerson());
    company.setId(1L);
    var personRef = PersonRef.of("test@redesignhealth.com");
    var person = Person.from(personRef);
    person.setId(1L);
    var companyMember = new CompanyMember(company, person, CompanyMemberStatus.ACTIVE);

    when(companyRepository.getMember(company.getApiId(), person.getEmail()))
        .thenReturn(companyMember);

    when(companyRepository.findByApiId(companyRef)).thenReturn(Optional.of(company));
    when(personRepository.findByEmail(PersonRef.of("test@redesignhealth.com")))
        .thenReturn(Optional.of(person));
    when(companyRepository.deleteMember(any(Long.class), any(Long.class))).thenReturn(1);

    mockMvc
        .perform(delete("/company/{apiId}/member/{email}", companyRef, "test@redesignhealth.com"))
        .andExpect(status().isOk())
        .andDo(document("remove-member"));
    verify(companyRepository, times(1)).deleteMember(any(Long.class), any(Long.class));
    verify(companyMemberAuditRepository, times(1)).save(any(CompanyMemberAudit.class));
  }

  @Test
  @WithRedesignUser(role = ROLE_RH_ADMIN)
  public void testDeleteMember_EnterpriseBuyer_With_Request_Contact_Info_success()
      throws Exception {
    var ipMarketPlace = testIpMarketPlace("sales@example.com");
    ipMarketPlace
        .getCompanyIpMarketplace()
        .setActivityType(CompanyIPMarketplaceType.ENTERPRISE_BUYER);
    var personRef = PersonRef.of("test@redesignhealth.com");
    var person = Person.from(personRef);

    person.setId(1L);
    var company = ipMarketPlace.getCompanyIpMarketplace().getCompany();
    company.setId(1L);
    var companyMember = new CompanyMember(company, person, CompanyMemberStatus.ACTIVE);
    var ipMarketplaceTrack = testIpMarketplaceTrack(ipMarketPlace, person);
    when(companyRepository.getMember(company.getApiId(), person.getEmail()))
        .thenReturn(companyMember);

    when(companyRepository.findByApiId(companyRef)).thenReturn(Optional.of(company));
    when(personRepository.findByEmail(PersonRef.of("test@redesignhealth.com")))
        .thenReturn(Optional.of(person));
    when(companyRepository.deleteMember(any(Long.class), any(Long.class))).thenReturn(1);
    var responseIpMarketplaceTracks = List.of(ipMarketplaceTrack);
    when(ipMarketplaceTrackRepository.findByBuyerCompanyIpMarketplaceAndBuyer(
            ipMarketPlace.getCompanyIpMarketplace(), person))
        .thenReturn(responseIpMarketplaceTracks);

    mockMvc
        .perform(delete("/company/{apiId}/member/{email}", companyRef, "test@redesignhealth.com"))
        .andExpect(status().isOk());
    verify(companyRepository, times(1)).deleteMember(any(Long.class), any(Long.class));
    verify(companyMemberAuditRepository, times(1)).save(any(CompanyMemberAudit.class));
    verify(ipMarketplaceTrackRepository, times(1)).deleteAll(responseIpMarketplaceTracks);
  }

  @Test
  @WithRedesignUser(role = ROLE_RH_ADMIN)
  public void testDelete_DNE() throws Exception {
    when(companyRepository.findByApiId(companyRef, MEMBERS)).thenReturn(Optional.empty());

    mockMvc.perform(delete("/company/{apiId}", companyRef)).andExpect(status().isNotFound());
  }

  @Test
  @WithRedesignUser(role = ROLE_RH_ADMIN)
  public void testDelete_Forbidden() throws Exception {
    var company = testCompany(testPerson());
    company.setId(1L);
    when(companyRepository.existsCompaniesByLinkedApiId(companyRef)).thenReturn(true);
    mockMvc
        .perform(delete("/company/{apiId}", companyRef))
        .andExpect(status().isForbidden())
        .andExpect(
            (result) ->
                assertTrue(
                    result.getResolvedException() instanceof ForbiddenDeleteCompanyException));
  }

  @Test
  @WithRedesignUser(role = ROLE_RH_ADMIN)
  public void testDelete_success_No_Members() throws Exception {
    var company = Fixtures.testCompany();
    company.setMembers(Set.of());
    company.setOnboardDocsFolderId("dummyId");
    when(companyRepository.findByApiId(companyRef, Expansion.MEMBERS))
        .thenReturn(Optional.of(company));
    doNothing().when(googleDriveClient).deleteFolder("dummyId");
    mockMvc
        .perform(delete("/company/{apiId}", companyRef))
        .andExpect(status().isNoContent())
        .andDo(document("delete"));
  }

  @Test
  @WithRedesignUser(role = ROLE_RH_ADMIN)
  public void testDelete_success_With_Members() throws Exception {
    var company = Fixtures.testCompany();
    var personMember = Person.from(PersonRef.of("new@redesignhealth.com"));
    var companyMember = new CompanyMember(company, personMember, CompanyMemberStatus.ACTIVE);
    ;
    company.setMembers(Set.of(companyMember));
    company.setOnboardDocsFolderId("dummyId");
    when(companyRepository.findByApiId(companyRef, Expansion.MEMBERS))
        .thenReturn(Optional.of(company));
    doNothing().when(googleDriveClient).deleteFolder("dummyId");
    mockMvc
        .perform(delete("/company/{apiId}", companyRef))
        .andExpect(status().isNoContent())
        .andDo(document("delete"));
  }

  @Test
  @WithRedesignUser(role = ROLE_RH_ADMIN)
  public void testDelete_GDriveFailure() throws Exception {
    var company = Fixtures.testCompany();
    company.setMembers(Set.of());
    company.setOnboardDocsFolderId("dummyId");
    when(companyRepository.findByApiId(companyRef, Expansion.MEMBERS))
        .thenReturn(Optional.of(company));
    doThrow(new GoogleDriveException(new Exception("dummy")))
        .when(googleDriveClient)
        .deleteFolder("dummyId");
    mockMvc.perform(delete("/company/{apiId}", companyRef)).andExpect(status().isNoContent());
  }

  @Test
  @WithRedesignUser(role = RoleAuthority.ROLE_OP_CO_USER, memberOf = TEST_COMPANY_XCLOUD_UAT_ID)
  public void testGetOne_xCloud() throws Exception {
    var uatCompany = Fixtures.testCompany(TEST_COMPANY_XCLOUD_UAT_ID);
    var uatCompanyRef = CompanyRef.of(TEST_COMPANY_XCLOUD_UAT_ID);
    when(companyRepository.findByApiId(uatCompanyRef)).thenReturn(Optional.of(uatCompany));
    mockMvc
        .perform(get("/company/{apiId}", uatCompanyRef))
        .andExpect(jsonPath("$.links[3].rel", is("xCloud")))
        .andExpect(jsonPath("$.links[3].href", is("https://example.com")));
  }

  private void changeState(CompanyStage source, CompanyStage destination) throws Exception {
    var company = testCompany();
    company.setStage(source);
    when(companyRepository.findByApiId(companyRef, MEMBERS)).thenReturn(Optional.of(company));
    when(companyRepository.save(any(Company.class))).then(returnsFirstArg());
    var payload =
        """
     {
      "name": "DOUS",
      "description": "DUOS is reimagining freedom at any age by forming trusted relationships with older adults using technology and community to support fulfilling lives at home.",
      "legalName": "Dous Living, Inc.",
      "number": 1111,
      "stage": "%s"
    }
    """;
    mockMvc
        .perform(
            put("/company/{apiId}", companyRef)
                .contentType(MediaType.APPLICATION_JSON)
                .content(String.format(payload, destination)))
        .andExpect(status().isConflict())
        .andExpect(
            (result) ->
                assertTrue(result.getResolvedException() instanceof StageConflictException));
  }

  private void createCompanyWithStageConceptOrNewCoFailure(CompanyStage companyStage)
      throws Exception {
    when(companyRepository.findByApiId(companyRef)).thenReturn(Optional.of(testCompany()));
    when(companyRepository.save(any(Company.class))).then(returnsFirstArg());
    CompanyCommand command =
        CompanyCommand.builder()
            .name("Ever/body")
            .description("Cosmetic dermatology for every tone, texture, age, gender, and body.")
            .legalName("Ever/body Inc.")
            .number(1111L)
            .stage(Optional.of(companyStage))
            .build();
    var payload =
        """
    {
      "name": "Ever/body",
      "description": "Cosmetic dermatology for every tone, texture, age, gender, and body.",
      "legalName": "Ever/body Inc.",
      "number": 1111,
      "stage": "%s"
    }
  """;
    mockMvc
        .perform(
            post("/company")
                .contentType(MediaType.APPLICATION_JSON)
                .content(String.format(payload, companyStage)))
        .andExpect(status().isBadRequest())
        .andExpect(
            (result) ->
                assertTrue(result.getResolvedException() instanceof LinkedCompanyException));
  }

  private void createCompanyWithStageThemeOrOpCoFailure(CompanyStage companyStage)
      throws Exception {
    when(companyRepository.findByApiId(companyRef)).thenReturn(Optional.of(testCompany()));
    when(companyRepository.save(any(Company.class))).then(returnsFirstArg());
    // writeValueAsString has issues getting the toString from the CompanyRef and this converting in
    // string all the object
    var comnandAsString =
        "{\"number\":1111,\"legalName\":\"Ever/body Inc.\",\"name\":\"Ever/body\","
            + "\"description\":\"Cosmetic dermatology for every tone, texture, age, gender, and body.\","
            + "\"stage\":\""
            + companyStage.toString()
            + "\",\"linkedApiId\":\"uadshJk\"}";
    mockMvc
        .perform(post("/company").contentType(MediaType.APPLICATION_JSON).content(comnandAsString))
        .andExpect(status().isBadRequest())
        .andExpect(
            (result) ->
                assertTrue(result.getResolvedException() instanceof LinkedCompanyException));
  }

  private void updateCompanyWithStageConceptOrNewCoFailure(CompanyStage companyStage)
      throws Exception {
    var company = testCompany();
    company.setStatus(CompanyStatus.ACTIVE);
    company.setStage(companyStage);
    when(companyRepository.findByApiId(companyRef, MEMBERS)).thenReturn(Optional.of(company));
    when(companyRepository.save(any(Company.class))).then(returnsFirstArg());
    var payload =
        """
      {
       "name": "DOUS",
       "description": "DUOS is reimagining freedom at any age by forming trusted relationships with older adults using technology and community to support fulfilling lives at home.",
       "legalName": "Dous Living, Inc.",
       "number": 1111,
       "stage": "%s"
       }
     """;
    mockMvc
        .perform(
            put("/company/{apiId}", companyRef)
                .contentType(MediaType.APPLICATION_JSON)
                .content(String.format(payload, companyStage)))
        .andExpect(status().isBadRequest())
        .andExpect(
            (result) ->
                assertTrue(result.getResolvedException() instanceof LinkedCompanyException));
  }

  private static FieldDescriptor statusField() {
    return fieldWithPath("status").description("status of the company(ACTIVE | PAUSED | ARCHIVED)");
  }

  private static FieldDescriptor categoryVendorField() {
    return fieldWithPath("category").description("Category of the vendor, e.g.: Infrastructure");
  }

  private static FieldDescriptor subCategoryVendorField() {
    return fieldWithPath("subCategory").description("Category of the vendor, e.g.: Admin Tools");
  }

  private static FieldDescriptor startDateVendorField() {
    return fieldWithPath("startDate").description("Start date for the vendor");
  }

  private static FieldDescriptor nameVendorField() {
    return fieldWithPath("name").description("Name for the vendor");
  }

  private static FieldDescriptor endDateVendorField() {
    return fieldWithPath("endDate").description("End date for the vendor");
  }

  private static FieldDescriptor willingToDiscussField() {
    return fieldWithPath("willingToDiscuss").description("Willing to discuss");
  }

  private static FieldDescriptor statusVendorDataField() {
    return fieldWithPath("status")
        .description("status of the company(ACTIVE | CONSIDERED | FORMER)");
  }

  private static FieldDescriptor vendorIdDataField() {
    return fieldWithPath("vendorId").description("Id generated for the vendor");
  }

  private static FieldDescriptor taxonomyIdField() {
    return fieldWithPath("taxonomyId").description("Reference to a level III taxonomy term");
  }

  private static FieldDescriptor taxonomyField() {
    return subsectionWithPath("taxonomy")
        .description("List of taxonomy terms associated with company");
  }

  private static FieldDescriptor fundraiseStatusField() {
    return subsectionWithPath("fundraiseStatus")
        .description(
            "To set how an OpCo progress from Series A fundraising to Series B fundraising and so on and if this is public or not.");
  }

  private static FieldDescriptor companyField() {
    return subsectionWithPath("company")
        .description("Company, concept, or theme associated with the research article");
  }

  private static FieldDescriptor conflictsField() {
    return subsectionWithPath("conflicts")
        .description("Array with a list of CompanyRef to establish conflicts");
  }

  private static FieldDescriptor dashboardHrefField() {
    return fieldWithPath("dashboardHref").description("Google doc link to company dashboard.");
  }

  private static FieldDescriptor activityTypeField() {
    return fieldWithPath("activityType")
        .description("If the company is ENTERPRISE_BUYER or ENTERPRISE_SELLER.");
  }

  private static FieldDescriptor organizationTypeField() {
    return fieldWithPath("organizationType")
        .description("The organization of the company in the IP marketplace");
  }

  private static FieldDescriptor regionField() {
    return fieldWithPath("region").description("The region where is given teh service");
  }

  private static FieldDescriptor activityTypeFieldSE() {
    return subsectionWithPath("activityType")
        .description(
            "Expand the activity Type of the company IP Marketplace as an Serialized Enum");
  }

  private static FieldDescriptor organizationTypeFieldSE() {
    return subsectionWithPath("organizationType")
        .description(
            "Expand the organization Type of the company IP Marketplace as an Serialized Enum");
  }

  private static FieldDescriptor regionFieldSE() {
    return subsectionWithPath("region")
        .description("Expand the region of the company IP Marketplace as an Serialized Enum");
  }
}
