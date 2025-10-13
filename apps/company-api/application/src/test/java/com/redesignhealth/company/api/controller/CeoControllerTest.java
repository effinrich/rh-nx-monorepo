package com.redesignhealth.company.api.controller;

import static com.redesignhealth.company.api.client.search.entity.CeoDirectoryDoc.BUSINESS_TYPE;
import static com.redesignhealth.company.api.entity.request.RoleAuthority.ROLE_OP_CO_USER;
import static com.redesignhealth.company.api.entity.request.RoleAuthority.ROLE_RH_ADMIN;
import static com.redesignhealth.company.api.entity.request.RoleAuthority.ROLE_RH_USER;
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
import static com.redesignhealth.company.api.scaffolding.Fixtures.testCeo;
import static com.redesignhealth.company.api.scaffolding.Fixtures.testCeoDirectoryCallSearchDoc;
import static com.redesignhealth.company.api.scaffolding.Fixtures.testCompany;
import static com.redesignhealth.company.api.scaffolding.Fixtures.testCompanyRef;
import static com.redesignhealth.company.api.service.CeoService.VALID_SEARCH_FILTERS;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
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

import com.redesignhealth.company.api.assembler.CeoDirectoryAssembler;
import com.redesignhealth.company.api.client.search.SearchClient;
import com.redesignhealth.company.api.client.search.command.SearchCommand;
import com.redesignhealth.company.api.client.search.command.SearchFilterOptionsCommand;
import com.redesignhealth.company.api.client.search.command.SearchIndex;
import com.redesignhealth.company.api.client.search.entity.CeoDirectoryDoc;
import com.redesignhealth.company.api.client.search.entity.FilterOptions;
import com.redesignhealth.company.api.client.search.entity.SearchResult;
import com.redesignhealth.company.api.client.search.entity.Term;
import com.redesignhealth.company.api.dto.SearchFilter;
import com.redesignhealth.company.api.dto.enums.CompanyFundraiseStatus;
import com.redesignhealth.company.api.dto.enums.CompanyMemberStatus;
import com.redesignhealth.company.api.entity.CompanyMember;
import com.redesignhealth.company.api.entity.Person;
import com.redesignhealth.company.api.entity.ref.CeoRef;
import com.redesignhealth.company.api.entity.ref.PersonRef;
import com.redesignhealth.company.api.entity.request.RoleAuthority;
import com.redesignhealth.company.api.expansion.Expansion;
import com.redesignhealth.company.api.property.CeoDirectoryConverter;
import com.redesignhealth.company.api.repository.CeoRepository;
import com.redesignhealth.company.api.repository.CompanyRepository;
import com.redesignhealth.company.api.repository.PersonRepository;
import com.redesignhealth.company.api.scaffolding.CommonTestConfig;
import com.redesignhealth.company.api.scaffolding.WithRedesignUser;
import com.redesignhealth.company.api.service.CeoService;
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
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.MediaType;
import org.springframework.orm.jpa.JpaSystemException;
import org.springframework.restdocs.payload.FieldDescriptor;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(CeoController.class)
@Import({CommonTestConfig.class})
@AutoConfigureRestDocs("target/generated-snippets/ceos")
public class CeoControllerTest {
  @Autowired private MockMvc mockMvc;
  @MockBean private CeoRepository ceoRepository;

  @MockBean private PersonRepository personRepository;

  @MockBean private SearchClient searchClient;

  @MockBean private CompanyRepository companyRepository;

  private static final Set<String> validLocations = Set.of("atlanta");

  @TestConfiguration
  static class TestConfig {
    @Bean
    public CeoService ceoService(
        CeoRepository ceoRepository,
        PersonRepository personRepository,
        SearchClient searchClient,
        CeoDirectoryConverter ceoDirectoryConverter,
        CompanyRepository companyRepository) {
      return new CeoService(
          ceoRepository,
          personRepository,
          validLocations,
          searchClient,
          ceoDirectoryConverter,
          companyRepository);
    }

    @Bean
    public CeoDirectoryAssembler ceoDirectoryAssembler() {
      return new CeoDirectoryAssembler();
    }
  }

  @Test
  @WithRedesignUser(role = ROLE_RH_ADMIN)
  public void CreateCeo() throws Exception {
    var personRef = PersonRef.of("anytest@redesignhealth.com");
    var person = testPerson(personRef);
    var company = testCompany();
    company.setFundraiseStatus(CompanyFundraiseStatus.PRE_SERIES_A);
    company.setOnboardDocsFolderId("any_id");
    var companyMember = new CompanyMember(company, person, CompanyMemberStatus.ACTIVE);
    person.setMemberOf(Set.of(companyMember));
    when(personRepository.findByEmail(personRef, Expansion.MEMBER_OF))
        .thenReturn(Optional.of(person));
    when(ceoRepository.existsCeoByEmail(personRef)).thenReturn(false);
    var payload =
        """
       {
        "pictureHref": "http//www.example.com/",
        "businessType": "B2B",
        "location": "Atlanta",
        "marketServiceArea": [
          "California"
        ],
        "customerSegment": [
          "HEALTH_PLAN"
        ],
        "businessFocusArea": [
          "APM_INCENTIVES_DESIGN"
        ],
        "healthcareSector": "BIOPHARMA_AND_DEVICE",
        "bio": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do",
        "additionalInfo": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do",
        "linkedinHref": "http//www.example.com/",
        "visible": "OPT_IN",
        "email": "anytest@redesignhealth.com"
      }
      """;
    mockMvc
        .perform(post("/ceos").contentType(MediaType.APPLICATION_JSON).content(payload))
        .andExpect(status().isCreated())
        .andDo(
            document(
                "create",
                requestFields(
                    pictureHrefField(),
                    businessTypeField(),
                    locationField(),
                    marketServiceAreaField(),
                    customerSegmentField(),
                    businessFocusAreaField(),
                    healthcareSectorField(),
                    bioField(),
                    additionalInfoField(),
                    linkedinHrefField(),
                    visibleField(),
                    emailField()),
                responseFields(
                    memberField(),
                    businessTypeSEField(),
                    locationField(),
                    marketServiceAreaField(),
                    customerSegmentFieldSE(),
                    healthcareSectorFieldSE(),
                    businessFocusAreaFieldSE(),
                    pictureHrefField(),
                    bioField(),
                    additionalInfoField(),
                    visibleFieldSE(),
                    linkedinHrefField(),
                    linksField(),
                    idField())));
  }

  @Test
  @WithRedesignUser(role = ROLE_RH_ADMIN)
  public void CreateCeo_Only_With_Email() throws Exception {
    var personRef = PersonRef.of("anytest@redesignhealth.com");
    var person = testPerson(personRef);
    var company = testCompany();
    company.setFundraiseStatus(CompanyFundraiseStatus.PRE_SERIES_A);
    company.setOnboardDocsFolderId("any_id");
    var companyMember = new CompanyMember(company, person, CompanyMemberStatus.ACTIVE);
    person.setMemberOf(Set.of(companyMember));
    when(personRepository.findByEmail(personRef, Expansion.MEMBER_OF))
        .thenReturn(Optional.of(person));
    when(ceoRepository.existsCeoByEmail(personRef)).thenReturn(false);
    var payload = """
     {
      "email": "anytest@redesignhealth.com"
    }
    """;
    mockMvc
        .perform(post("/ceos").contentType(MediaType.APPLICATION_JSON).content(payload))
        .andExpect(status().isCreated());
  }

  @Test
  @WithRedesignUser(role = ROLE_RH_ADMIN)
  public void CreateCeo_Txn_Conflict() throws Exception {
    var personRef = PersonRef.of("anytest@redesignhealth.com");
    var person = testPerson(personRef);
    var company = testCompany();
    company.setFundraiseStatus(CompanyFundraiseStatus.PRE_SERIES_A);
    company.setOnboardDocsFolderId("any_id");
    var companyMember = new CompanyMember(company, person, CompanyMemberStatus.ACTIVE);
    person.setMemberOf(Set.of(companyMember));
    when(personRepository.findByEmail(personRef, Expansion.MEMBER_OF))
        .thenReturn(Optional.of(person));
    Throwable ex =
        new JpaSystemException(new RuntimeException("Mock exception: [RETRY_SERIALIZABLE]"));
    when(ceoRepository.existsCeoByEmail(personRef)).thenThrow(ex);
    var payload = """
     {
      "email": "anytest@redesignhealth.com"
    }
    """;
    mockMvc
        .perform(post("/ceos").contentType(MediaType.APPLICATION_JSON).content(payload))
        .andExpect(status().isTooManyRequests());
  }

  @Test
  @WithRedesignUser(role = ROLE_RH_ADMIN)
  public void CreateCeo_Generic_Jpa_Error() throws Exception {
    var personRef = PersonRef.of("anytest@redesignhealth.com");
    var person = testPerson(personRef);
    var company = testCompany();
    company.setFundraiseStatus(CompanyFundraiseStatus.PRE_SERIES_A);
    company.setOnboardDocsFolderId("any_id");
    var companyMember = new CompanyMember(company, person, CompanyMemberStatus.ACTIVE);
    person.setMemberOf(Set.of(companyMember));
    when(personRepository.findByEmail(personRef, Expansion.MEMBER_OF))
        .thenReturn(Optional.of(person));
    Throwable ex = new JpaSystemException(new RuntimeException("Mock exception: anything else"));
    when(ceoRepository.existsCeoByEmail(personRef)).thenThrow(ex);
    var payload = """
     {
      "email": "anytest@redesignhealth.com"
    }
    """;
    mockMvc
        .perform(post("/ceos").contentType(MediaType.APPLICATION_JSON).content(payload))
        .andExpect(status().isInternalServerError());
  }

  @Test
  @WithRedesignUser(role = ROLE_RH_ADMIN)
  public void CreateCeo_Email_Not_Found() throws Exception {
    var payload =
        """
       {
        "pictureHref": "http//www.example.com/",
        "businessType": "B2B",
        "location": "Atlanta",
        "marketServiceArea": [
          "California"
        ],
        "customerSegment": [
          "HEALTH_PLAN"
        ],
        "businessFocusArea": [
          "APM_INCENTIVES_DESIGN"
        ],
        "healthcareSector": "BIOPHARMA_AND_DEVICE",
        "bio": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do",
        "additionalInfo": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do",
        "linkedinHref": "http//www.example.com/",
        "visible": "OPT_IN",
        "email": "anytest@redesignhealth.com"
      }
      """;
    mockMvc
        .perform(post("/ceos").contentType(MediaType.APPLICATION_JSON).content(payload))
        .andExpect(status().isUnprocessableEntity())
        .andExpect(jsonPath("$.errors[0].description", is("must exist")));
  }

  @Test
  @WithRedesignUser(role = ROLE_RH_ADMIN)
  public void CreateCeo_Email_Was_Not_Sent() throws Exception {
    var payload = """
     {
    }
    """;
    mockMvc
        .perform(post("/ceos").contentType(MediaType.APPLICATION_JSON).content(payload))
        .andExpect(status().isUnprocessableEntity())
        .andExpect(jsonPath("$.errors[0].description", is("Email is required")));
  }

  @Test
  @WithRedesignUser(role = ROLE_RH_ADMIN)
  public void CreateCeo_Email_Is_Empty() throws Exception {
    var payload = """
     {
     "email":""
    }
    """;
    mockMvc
        .perform(post("/ceos").contentType(MediaType.APPLICATION_JSON).content(payload))
        .andExpect(status().isUnprocessableEntity())
        .andExpect(jsonPath("$.errors[0].description", is("Email is required")));
  }

  @Test
  @WithRedesignUser(role = ROLE_RH_ADMIN)
  public void CreateCeo_Invalid_Location() throws Exception {
    var personRef = PersonRef.of("anytest@redesignhealth.com");
    var person = testPerson(personRef);
    var company = testCompany();
    company.setOnboardDocsFolderId("any_id");
    var companyMember = new CompanyMember(company, person, CompanyMemberStatus.ACTIVE);
    person.setMemberOf(Set.of(companyMember));
    when(personRepository.findByEmail(personRef, Expansion.MEMBER_OF))
        .thenReturn(Optional.of(person));
    when(ceoRepository.existsCeoByEmail(personRef)).thenReturn(false);
    var payload =
        """
       {
        "pictureHref": "http//www.example.com/",
        "businessType": "B2B",
        "location": "Tracy",
        "marketServiceArea": [
          "California"
        ],
        "customerSegment": [
          "HEALTH_PLAN"
        ],
        "businessFocusArea": [
          "APM_INCENTIVES_DESIGN"
        ],
        "healthcareSector": "BIOPHARMA_AND_DEVICE",
        "bio": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do",
        "additionalInfo": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do",
        "linkedinHref": "http//www.example.com/",
        "visible": "OPT_IN",
        "email": "anytest@redesignhealth.com"
      }
      """;
    mockMvc
        .perform(post("/ceos").contentType(MediaType.APPLICATION_JSON).content(payload))
        .andExpect(status().isUnprocessableEntity())
        .andExpect(jsonPath("$.errors[0].description", is("must exist")));
  }

  @Test
  @WithRedesignUser(role = ROLE_RH_ADMIN)
  public void CreateCeo_Ceo_Exists() throws Exception {
    var personRef = PersonRef.of("anytest@redesignhealth.com");
    var person = testPerson(personRef);
    var company = testCompany();
    company.setOnboardDocsFolderId("any_id");
    var companyMember = new CompanyMember(company, person, CompanyMemberStatus.ACTIVE);
    person.setMemberOf(Set.of(companyMember));
    when(personRepository.findByEmail(personRef, Expansion.MEMBER_OF))
        .thenReturn(Optional.of(person));
    when(ceoRepository.existsCeoByEmail(personRef)).thenReturn(true);
    var payload =
        """
       {
        "pictureHref": "http//www.example.com/",
        "businessType": "B2B",
        "location": "Atlanta",
        "marketServiceArea": [
          "California"
        ],
        "customerSegment": [
          "HEALTH_PLAN"
        ],
        "businessFocusArea": [
          "APM_INCENTIVES_DESIGN"
        ],
        "healthcareSector": "BIOPHARMA_AND_DEVICE",
        "bio": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do",
        "additionalInfo": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do",
        "linkedinHref": "http//www.example.com/",
        "visible": "OPT_IN",
        "email": "anytest@redesignhealth.com"
      }
      """;
    mockMvc
        .perform(post("/ceos").contentType(MediaType.APPLICATION_JSON).content(payload))
        .andExpect(status().isUnprocessableEntity())
        .andExpect(jsonPath("$.errors[0].description", is("must be unique")));
  }

  @Test
  @WithRedesignUser(role = ROLE_RH_ADMIN)
  public void CreateCeo_Ceo_Active_in_More_Than_One_Company() throws Exception {
    var personRef = PersonRef.of("anytest@redesignhealth.com");
    var person = testPerson(personRef);
    var company = testCompany();
    var company2 = testCompany("amyApiId");
    company.setOnboardDocsFolderId("any_id");
    var companyMember = new CompanyMember(company, person, CompanyMemberStatus.ACTIVE);
    var companyMember2 = new CompanyMember(company2, person, CompanyMemberStatus.ACTIVE);
    person.setMemberOf(Set.of(companyMember, companyMember2));
    when(personRepository.findByEmail(personRef, Expansion.MEMBER_OF))
        .thenReturn(Optional.of(person));
    when(ceoRepository.existsCeoByEmail(personRef)).thenReturn(false);
    var payload =
        """
     {
      "pictureHref": "http//www.example.com/",
      "businessType": "B2B",
      "location": "Atlanta",
      "marketServiceArea": [
        "California"
      ],
      "customerSegment": [
        "HEALTH_PLAN"
      ],
      "businessFocusArea": [
        "APM_INCENTIVES_DESIGN"
      ],
      "healthcareSector": "BIOPHARMA_AND_DEVICE",
      "bio": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do",
      "additionalInfo": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do",
      "linkedinHref": "http//www.example.com/",
      "visible": "OPT_IN",
      "email": "anytest@redesignhealth.com"
    }
    """;
    mockMvc
        .perform(post("/ceos").contentType(MediaType.APPLICATION_JSON).content(payload))
        .andExpect(status().isUnprocessableEntity())
        .andExpect(
            jsonPath("$.errors[0].description", is("CEO only can be active in one Company")));
    ;
  }

  @Test
  @WithRedesignUser(role = ROLE_RH_ADMIN, email = "anytest@redesignhealth.com")
  public void GetCeo_One() throws Exception {
    var ceoId = "anyCeoId";
    var ceoRef = CeoRef.of(ceoId);
    var personRef = PersonRef.of("anytest@redesignhealth.com");
    var person = testPerson(personRef);
    var ceo = testCeo(ceoRef, personRef);
    ceo.setPerson(person);
    person.setRole(ROLE_RH_ADMIN);
    var company = testCompany();
    company.setFundraiseStatus(CompanyFundraiseStatus.PRE_SERIES_A);
    var companyMember = new CompanyMember(company, person, CompanyMemberStatus.ACTIVE);
    person.setMemberOf(Set.of(companyMember));
    when(ceoRepository.findCeoByApiId(ceoRef)).thenReturn(Optional.of(ceo));
    mockMvc
        .perform(get("/ceos/{ceoId}", ceoId))
        .andExpect(status().isOk())
        .andDo(
            document(
                "get-ceo-id",
                responseFields(
                    memberField(),
                    businessTypeSEField(),
                    locationField(),
                    marketServiceAreaField(),
                    customerSegmentFieldSE(),
                    healthcareSectorFieldSE(),
                    businessFocusAreaFieldSE(),
                    pictureHrefField(),
                    bioField(),
                    additionalInfoField(),
                    visibleFieldSE(),
                    linkedinHrefField(),
                    linksField(),
                    idField())));
  }

  @Test
  @WithRedesignUser(role = RoleAuthority.ROLE_RH_ADMIN)
  public void testDelete_success() throws Exception {
    var ceoId = "anyCeoId";
    var ceoRef = CeoRef.of(ceoId);
    var personRef = PersonRef.of("anytest@redesignhealth.com");
    var ceo = testCeo(ceoRef, personRef);
    when(ceoRepository.findCeoByApiId(ceoRef)).thenReturn(Optional.of(ceo));
    mockMvc
        .perform(delete("/ceos/{ceoId}", ceoRef))
        .andExpect(status().isNoContent())
        .andDo(document("delete"));
  }

  @Test
  @WithRedesignUser(role = RoleAuthority.ROLE_RH_ADMIN)
  public void testDelete_NotFound() throws Exception {
    var ceoId = "anyCeoId";
    var ceoRef = CeoRef.of(ceoId);
    mockMvc.perform(delete("/ceos/{ceoId}", ceoRef)).andExpect(status().isNotFound());
  }

  @Test
  @WithRedesignUser(role = RoleAuthority.ROLE_OP_CO_USER)
  public void testQuery_returnsResults() throws Exception {
    var MEMBER = "member";
    var company = testCompany();
    company.setFundraiseStatus(CompanyFundraiseStatus.PRE_LAUNCH_PHASE);
    when(companyRepository.findByApiId(testCompanyRef())).thenReturn(Optional.of(company));
    var sanitizedFilters =
        List.of(SearchFilter.of("business_type", "B2B"), SearchFilter.of("visible", "OPT_IN"));
    var command =
        SearchCommand.builder()
            .index(SearchIndex.CEO_DIRECTORY)
            .query("Text")
            .highlight(true)
            .filters(sanitizedFilters)
            .fields(CeoService.FIELDS_TO_SEARCH)
            .build();
    var pageable = PageRequest.of(0, 20, Sort.by(MEMBER + ".company.name"));
    when(searchClient.search(command, pageable, CeoDirectoryDoc.class))
        .thenReturn(
            new PageImpl<>(
                List.of(
                    SearchResult.of(
                        testCeoDirectoryCallSearchDoc(),
                        Map.of("bio", List.of("some <em>Text</em>")),
                        "anyApi")),
                pageable,
                1));

    mockMvc
        .perform(
            get(
                "/ceos?page=0&size=20&sort=member.company.name,asc&filter=businessType,B2B&q=Text&expand=highlightedText"))
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
                        memberField(),
                        businessTypeSEField(),
                        locationField(),
                        marketServiceAreaField(),
                        customerSegmentFieldSE(),
                        healthcareSectorFieldSE(),
                        businessFocusAreaFieldSE(),
                        pictureHrefField(),
                        bioField(),
                        additionalInfoField(),
                        visibleFieldSE(),
                        idField(),
                        highlightedTextField(),
                        linksField())));
  }

  @Test
  @WithRedesignUser(role = ROLE_RH_ADMIN, email = "anytest@redesignhealth.com")
  public void GetCeo_Not_Found() throws Exception {
    var ceoId = "anyCeoId";
    mockMvc.perform(get("/ceos/{ceoId}", ceoId)).andExpect(status().isNotFound());
  }

  @Test
  @WithRedesignUser(role = ROLE_RH_ADMIN, email = "anytest@redesignhealth.com")
  public void UpdateCeo() throws Exception {
    var ceoId = "anyCeoId";
    var ceoRef = CeoRef.of(ceoId);
    var personRef = PersonRef.of("anytest@redesignhealth.com");
    var person = testPerson(personRef);
    var ceo = testCeo(ceoRef, personRef);
    ceo.setPerson(person);
    person.setRole(ROLE_RH_ADMIN);
    var company = testCompany();
    company.setFundraiseStatus(CompanyFundraiseStatus.PRE_SERIES_A);
    var companyMember = new CompanyMember(company, person, CompanyMemberStatus.ACTIVE);
    person.setMemberOf(Set.of(companyMember));
    when(ceoRepository.findCeoByApiId(ceoRef)).thenReturn(Optional.of(ceo));
    var payload =
        """
     {
      "pictureHref": "http//www.example.com/",
      "businessType": "B2B",
      "location": "Atlanta",
      "marketServiceArea": [
        "California"
      ],
      "customerSegment": [
        "HEALTH_PLAN"
      ],
      "businessFocusArea": [
        "APM_INCENTIVES_DESIGN"
      ],
      "healthcareSector": "BIOPHARMA_AND_DEVICE",
      "bio": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do",
      "additionalInfo": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do",
      "linkedinHref": "http//www.example.com/",
      "visible": "OPT_IN"
    }
    """;
    mockMvc
        .perform(
            put("/ceos/{ceoId}", ceoId).contentType(MediaType.APPLICATION_JSON).content(payload))
        .andExpect(status().isOk())
        .andDo(
            document(
                "update",
                requestFields(
                    pictureHrefField(),
                    businessTypeField(),
                    locationField(),
                    marketServiceAreaField(),
                    customerSegmentField(),
                    businessFocusAreaField(),
                    healthcareSectorField(),
                    bioField(),
                    additionalInfoField(),
                    linkedinHrefField(),
                    visibleField()),
                responseFields(
                    memberField(),
                    businessTypeSEField(),
                    locationField(),
                    marketServiceAreaField(),
                    customerSegmentFieldSE(),
                    healthcareSectorFieldSE(),
                    businessFocusAreaFieldSE(),
                    pictureHrefField(),
                    bioField(),
                    additionalInfoField(),
                    visibleFieldSE(),
                    linkedinHrefField(),
                    linksField(),
                    idField())));
  }

  @Test
  @WithRedesignUser(role = ROLE_RH_ADMIN, email = "anytest@redesignhealth.com")
  public void UpdateCeo_Invalid_Location() throws Exception {
    var ceoId = "anyCeoId";
    var ceoRef = CeoRef.of(ceoId);
    var personRef = PersonRef.of("anytest@redesignhealth.com");
    var person = testPerson(personRef);
    var ceo = testCeo(ceoRef, personRef);
    ceo.setPerson(person);
    person.setRole(ROLE_RH_ADMIN);
    var company = testCompany();
    company.setFundraiseStatus(CompanyFundraiseStatus.PRE_SERIES_A);
    var companyMember = new CompanyMember(company, person, CompanyMemberStatus.ACTIVE);
    person.setMemberOf(Set.of(companyMember));
    when(ceoRepository.findCeoByApiId(ceoRef)).thenReturn(Optional.of(ceo));
    var payload =
        """
     {
      "pictureHref": "http//www.example.com/",
      "businessType": "B2B",
      "location": "Tracy",
      "marketServiceArea": [
        "California"
      ],
      "customerSegment": [
        "HEALTH_PLAN"
      ],
      "businessFocusArea": [
        "APM_INCENTIVES_DESIGN"
      ],
      "healthcareSector": "BIOPHARMA_AND_DEVICE",
      "bio": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do",
      "additionalInfo": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do",
      "linkedinHref": "http//www.example.com/",
      "visible": "OPT_IN"
    }
    """;
    mockMvc
        .perform(
            put("/ceos/{ceoId}", ceoId).contentType(MediaType.APPLICATION_JSON).content(payload))
        .andExpect(status().isUnprocessableEntity())
        .andExpect(jsonPath("$.errors[0].description", is("must exist")));
  }

  @Test
  @WithRedesignUser(role = ROLE_RH_ADMIN, email = "anytest@redesignhealth.com")
  public void UpdateCeo_Ceo_Not_Found() throws Exception {
    var ceoId = "anyCeoId";
    var company = testCompany();
    company.setFundraiseStatus(CompanyFundraiseStatus.PRE_SERIES_A);
    var payload =
        """
     {
      "pictureHref": "http//www.example.com/",
      "businessType": "B2B",
      "location": "Tracy",
      "marketServiceArea": [
        "California"
      ],
      "customerSegment": [
        "HEALTH_PLAN"
      ],
      "businessFocusArea": [
        "APM_INCENTIVES_DESIGN"
      ],
      "healthcareSector": "BIOPHARMA_AND_DEVICE",
      "bio": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do",
      "additionalInfo": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do",
      "linkedinHref": "http//www.example.com/",
      "visible": "OPT_IN"
    }
    """;
    mockMvc
        .perform(
            put("/ceos/{ceoId}", ceoId).contentType(MediaType.APPLICATION_JSON).content(payload))
        .andExpect(status().isNotFound());
  }

  @Test
  @WithRedesignUser(role = ROLE_OP_CO_USER, email = "anytest2@redesignhealth.com")
  public void UpdateCeo_Invalid_Editor_Role_It_Is_Not_CEO() throws Exception {
    var ceoId = "anyCeoId";
    var ceoRef = CeoRef.of(ceoId);
    var personRef = PersonRef.of("anytest@redesignhealth.com");
    var person = testPerson(personRef);
    person.setRole(ROLE_OP_CO_USER);
    var ceo = testCeo(ceoRef, personRef);
    ceo.setPerson(person);
    var company = testCompany();
    company.setFundraiseStatus(CompanyFundraiseStatus.PRE_SERIES_A);
    var companyMember = new CompanyMember(company, person, CompanyMemberStatus.ACTIVE);
    person.setMemberOf(Set.of(companyMember));
    when(ceoRepository.findCeoByApiId(ceoRef)).thenReturn(Optional.of(ceo));
    var payload =
        """
     {
      "pictureHref": "http//www.example.com/",
      "businessType": "B2B",
      "location": "Tracy",
      "marketServiceArea": [
        "California"
      ],
      "customerSegment": [
        "HEALTH_PLAN"
      ],
      "businessFocusArea": [
        "APM_INCENTIVES_DESIGN"
      ],
      "healthcareSector": "BIOPHARMA_AND_DEVICE",
      "bio": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do",
      "additionalInfo": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do",
      "linkedinHref": "http//www.example.com/",
      "visible": "OPT_IN"
    }
    """;
    mockMvc
        .perform(
            put("/ceos/{ceoId}", ceoId).contentType(MediaType.APPLICATION_JSON).content(payload))
        .andExpect(status().isForbidden())
        .andExpect(
            jsonPath("$.message", is("Only a CEO can edit its information for ROLE_OP_CO_USER")));
  }

  @Test
  @WithRedesignUser(role = ROLE_RH_USER, email = "anytest2@redesignhealth.com")
  public void UpdateCeo_Invalid_Editor_Role_It_Is_ROLE_RH_USER() throws Exception {
    var ceoId = "anyCeoId";
    var ceoRef = CeoRef.of(ceoId);
    var personRef = PersonRef.of("anytest@redesignhealth.com");
    var person = testPerson(personRef);
    person.setRole(ROLE_OP_CO_USER);
    var ceo = testCeo(ceoRef, personRef);
    ceo.setPerson(person);
    var company = testCompany();
    company.setFundraiseStatus(CompanyFundraiseStatus.PRE_SERIES_A);
    var companyMember = new CompanyMember(company, person, CompanyMemberStatus.ACTIVE);
    person.setMemberOf(Set.of(companyMember));
    when(ceoRepository.findCeoByApiId(ceoRef)).thenReturn(Optional.of(ceo));
    var payload =
        """
   {
    "pictureHref": "http//www.example.com/",
    "businessType": "B2B",
    "location": "Tracy",
    "marketServiceArea": [
      "California"
    ],
    "customerSegment": [
      "HEALTH_PLAN"
    ],
    "businessFocusArea": [
      "APM_INCENTIVES_DESIGN"
    ],
    "healthcareSector": "BIOPHARMA_AND_DEVICE",
    "bio": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do",
    "additionalInfo": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do",
    "linkedinHref": "http//www.example.com/",
    "visible": "OPT_IN"
  }
  """;
    mockMvc
        .perform(
            put("/ceos/{ceoId}", ceoId).contentType(MediaType.APPLICATION_JSON).content(payload))
        .andExpect(status().isForbidden())
        .andExpect(
            jsonPath("$.message", is("Only the CEO, and Admin or SuperAdmin can edit the info")));
  }

  @Test
  @WithRedesignUser(role = ROLE_OP_CO_USER, email = "anytest@redesignhealth.com")
  public void UpdateCeo_CEO_Edit_its_Info() throws Exception {
    var ceoId = "anyCeoId";
    var ceoRef = CeoRef.of(ceoId);
    var personRef = PersonRef.of("anytest@redesignhealth.com");
    var person = testPerson(personRef);
    person.setRole(ROLE_OP_CO_USER);
    var ceo = testCeo(ceoRef, personRef);
    ceo.setPerson(person);
    var company = testCompany();
    company.setFundraiseStatus(CompanyFundraiseStatus.PRE_SERIES_A);
    var companyMember = new CompanyMember(company, person, CompanyMemberStatus.ACTIVE);
    person.setMemberOf(Set.of(companyMember));
    when(ceoRepository.findCeoByApiId(ceoRef)).thenReturn(Optional.of(ceo));
    var payload =
        """
   {
    "pictureHref": "http//www.example.com/",
    "businessType": "B2B",
    "location": "Atlanta",
    "marketServiceArea": [
      "California"
    ],
    "customerSegment": [
      "HEALTH_PLAN"
    ],
    "businessFocusArea": [
      "APM_INCENTIVES_DESIGN"
    ],
    "healthcareSector": "BIOPHARMA_AND_DEVICE",
    "bio": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do",
    "additionalInfo": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do",
    "linkedinHref": "http//www.example.com/",
    "visible": "OPT_IN"
  }
  """;
    mockMvc
        .perform(
            put("/ceos/{ceoId}", ceoId).contentType(MediaType.APPLICATION_JSON).content(payload))
        .andExpect(status().isOk());
  }

  @Test
  @WithRedesignUser(role = ROLE_OP_CO_USER)
  public void testFilters_returnsResults() throws Exception {
    var filterOption =
        FilterOptions.builder().field(BUSINESS_TYPE).terms(List.of(Term.of("B2B", 10))).build();

    var command =
        SearchFilterOptionsCommand.builder()
            .index(SearchIndex.CEO_DIRECTORY)
            .fields(VALID_SEARCH_FILTERS)
            .build();

    when(searchClient.getFilterOptions(command)).thenReturn(List.of(filterOption));
    mockMvc
        .perform(get("/ceos/filters"))
        .andExpect(status().isOk())
        .andDo(
            document(
                "filters",
                responseFields(
                        linksField(), subsectionWithPath("content").description("List of filters"))
                    .andWithPrefix("content[].", keyField(), optionsField())));
  }

  @Test
  @WithRedesignUser(role = ROLE_OP_CO_USER)
  public void testFilters_returns_Not_Results() throws Exception {
    var command =
        SearchFilterOptionsCommand.builder()
            .index(SearchIndex.CEO_DIRECTORY)
            .fields(VALID_SEARCH_FILTERS)
            .build();

    when(searchClient.getFilterOptions(command)).thenReturn(List.of());
    mockMvc
        .perform(get("/ceos/filters"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.content", hasSize(0)));
    ;
  }

  private static FieldDescriptor pictureHrefField() {
    return fieldWithPath("pictureHref").description("CEO image location in our cloud bucket");
  }

  private static FieldDescriptor businessTypeField() {
    return fieldWithPath("businessType")
        .description("business type done by the CEO, has the following values: B2B, B2B2C, D2C");
  }

  private static FieldDescriptor locationField() {
    return fieldWithPath("location").description("metro area where the CEO resides");
  }

  private static FieldDescriptor marketServiceAreaField() {
    return subsectionWithPath("marketServiceArea")
        .description("List for the 50 US states where the CEO could  give its experience");
  }

  private static FieldDescriptor customerSegmentField() {
    return subsectionWithPath("customerSegment")
        .description(
            "List for different segments for which the CEO could have experience. Valid values: "
                + "https://github.com/redesignhealth/rh-design-system/blob/main/apps/company-api/application/src/main/java/com/redesignhealth/company/api/dto/enums/CeoCustomerSegment.java#L6-L10[company-api-repo]");
  }

  private static FieldDescriptor businessFocusAreaField() {
    return subsectionWithPath("businessFocusArea")
        .description(
            "List to define the businesses where the CEO has more expertise. Valid values: "
                + "https://github.com/redesignhealth/rh-design-system/blob/main/apps/company-api/application/src/main/java/com/redesignhealth/company/api/dto/enums/CeoBusinessFocusArea.java#L6-L56[company-api-repo]");
  }

  private static FieldDescriptor healthcareSectorField() {
    return fieldWithPath("healthcareSector")
        .description(
            "Sector where the CEO has experience, Valid values: "
                + "https://github.com/redesignhealth/rh-design-system/blob/main/apps/company-api/application/src/main/java/com/redesignhealth/company/api/dto/enums/CeoHealthcareSector.java#L6-L15[company-api-repo]");
  }

  private static FieldDescriptor bioField() {
    return fieldWithPath("bio").description("CEO bio");
  }

  private static FieldDescriptor additionalInfoField() {
    return fieldWithPath("additionalInfo").description("CEO Additional Info");
  }

  private static FieldDescriptor linkedinHrefField() {
    return fieldWithPath("linkedinHref").description("CEO Linkedin URL");
  }

  private static FieldDescriptor visibleField() {
    return fieldWithPath("visible")
        .description(
            "Determine if the CEO wants be shown in the directory or not, has the following values: OPT_IN, OPT_OUT");
  }

  private static FieldDescriptor emailField() {
    return fieldWithPath("email").description("CEO email");
  }

  private static FieldDescriptor memberField() {
    return subsectionWithPath("member").description("Contains the Company member info");
  }

  private static FieldDescriptor businessTypeSEField() {
    return subsectionWithPath("businessType")
        .description("Expand the business type the CEO as an Serialized Enum");
  }

  private static FieldDescriptor customerSegmentFieldSE() {
    return subsectionWithPath("customerSegment")
        .description("Expand the customer segment list of the CEO as an Serialized Enum");
  }

  private static FieldDescriptor healthcareSectorFieldSE() {
    return subsectionWithPath("healthcareSector")
        .description("Expand the healthcare sector expertise of the CEO as an Serialized Enum");
  }

  private static FieldDescriptor businessFocusAreaFieldSE() {
    return subsectionWithPath("businessFocusArea")
        .description("Expand the business focus area expertise of the CEO as an Serialized Enum");
  }

  private static FieldDescriptor visibleFieldSE() {
    return subsectionWithPath("visible")
        .description("Expand the visible option as an Serialized Enum");
  }

  public static FieldDescriptor[] pageableFields() {
    return new FieldDescriptor[] {
      fieldWithPath("pageSize").description("Requested page size"),
      fieldWithPath("pageNumber").description("Page number"),
      fieldWithPath("paged").description("if the request was paged"),
      fieldWithPath("unpaged").description("if the request was not paged"),
      fieldWithPath("offset").description("offset used"),
      subsectionWithPath("sort").description("Sort used"),
    };
  }

  public static FieldDescriptor[] sortFields() {
    return new FieldDescriptor[] {
      fieldWithPath("sorted").description("if the request was sorted"),
      fieldWithPath("unsorted").description("if the request was not sorted"),
      fieldWithPath("empty").description("Empty"),
    };
  }

  private Person testPerson(PersonRef personRef) {
    var person = Person.from(personRef);
    var data = personRef.getEmail().split("@");
    person.setGivenName(data[0]);
    person.setFamilyName(data[1]);
    return person;
  }
}
