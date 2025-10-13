package com.redesignhealth.company.api.scaffolding;

import static com.redesignhealth.company.api.entity.request.RoleAuthority.ROLE_OP_CO_USER;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.redesignhealth.company.api.client.search.entity.CeoDirectoryDoc;
import com.redesignhealth.company.api.client.search.entity.CompanyDoc;
import com.redesignhealth.company.api.client.search.entity.ExpertNoteSearchDoc;
import com.redesignhealth.company.api.client.search.entity.IpMarketplaceSearchDoc;
import com.redesignhealth.company.api.client.search.entity.MemberDoc;
import com.redesignhealth.company.api.client.search.entity.ResearchAuthor;
import com.redesignhealth.company.api.client.search.entity.ResearchExternalContentDoc;
import com.redesignhealth.company.api.client.search.entity.ResearchSearchDoc;
import com.redesignhealth.company.api.document.Topic;
import com.redesignhealth.company.api.dto.LinkRef;
import com.redesignhealth.company.api.dto.enums.CeoBusinessFocusArea;
import com.redesignhealth.company.api.dto.enums.CeoBusinessType;
import com.redesignhealth.company.api.dto.enums.CeoCustomerSegment;
import com.redesignhealth.company.api.dto.enums.CeoHealthcareSector;
import com.redesignhealth.company.api.dto.enums.CeoVisible;
import com.redesignhealth.company.api.dto.enums.CompanyFundraiseStatus;
import com.redesignhealth.company.api.dto.enums.CompanyIPMarketplaceOrganizationType;
import com.redesignhealth.company.api.dto.enums.CompanyIPMarketplaceRegion;
import com.redesignhealth.company.api.dto.enums.CompanyIPMarketplaceType;
import com.redesignhealth.company.api.dto.enums.CompanyMemberStatus;
import com.redesignhealth.company.api.dto.enums.CompanyStatus;
import com.redesignhealth.company.api.dto.enums.CompanyVendorEngagementStatus;
import com.redesignhealth.company.api.dto.enums.CompanyVendorType;
import com.redesignhealth.company.api.dto.enums.IpMarketplaceFreedomToOperateCertification;
import com.redesignhealth.company.api.dto.enums.IpMarketplaceOrganOfFocus;
import com.redesignhealth.company.api.dto.enums.IpMarketplacePatentStatus;
import com.redesignhealth.company.api.dto.enums.IpMarketplaceStatus;
import com.redesignhealth.company.api.dto.enums.IpMarketplaceTrackContactInfo;
import com.redesignhealth.company.api.dto.enums.LibraryContentType;
import com.redesignhealth.company.api.dto.enums.RemoteContentSource;
import com.redesignhealth.company.api.dto.enums.TopicType;
import com.redesignhealth.company.api.entity.Category;
import com.redesignhealth.company.api.entity.Ceo;
import com.redesignhealth.company.api.entity.Company;
import com.redesignhealth.company.api.entity.CompanyIpMarketplace;
import com.redesignhealth.company.api.entity.CompanyMember;
import com.redesignhealth.company.api.entity.Consent;
import com.redesignhealth.company.api.entity.ExpertNote;
import com.redesignhealth.company.api.entity.FormDefinition;
import com.redesignhealth.company.api.entity.IpMarketplace;
import com.redesignhealth.company.api.entity.IpMarketplaceSeller;
import com.redesignhealth.company.api.entity.IpMarketplaceTrack;
import com.redesignhealth.company.api.entity.Person;
import com.redesignhealth.company.api.entity.Subcategory;
import com.redesignhealth.company.api.entity.library.Library;
import com.redesignhealth.company.api.entity.library.LibraryContent;
import com.redesignhealth.company.api.entity.ref.CategoryRef;
import com.redesignhealth.company.api.entity.ref.CeoRef;
import com.redesignhealth.company.api.entity.ref.CompanyRef;
import com.redesignhealth.company.api.entity.ref.CompanyVendorRef;
import com.redesignhealth.company.api.entity.ref.ContentRef;
import com.redesignhealth.company.api.entity.ref.ExpertNoteRef;
import com.redesignhealth.company.api.entity.ref.IpMarketplaceRef;
import com.redesignhealth.company.api.entity.ref.IpMarketplaceTrackRef;
import com.redesignhealth.company.api.entity.ref.LibraryRef;
import com.redesignhealth.company.api.entity.ref.PersonRef;
import com.redesignhealth.company.api.entity.ref.ResearchRef;
import com.redesignhealth.company.api.entity.ref.SubcategoryRef;
import com.redesignhealth.company.api.entity.ref.TaxonomyRef;
import com.redesignhealth.company.api.entity.ref.VendorRef;
import com.redesignhealth.company.api.entity.request.InfrastructureRequest;
import com.redesignhealth.company.api.entity.request.RequestForm;
import com.redesignhealth.company.api.entity.request.RoleAuthority;
import com.redesignhealth.company.api.entity.research.Research;
import com.redesignhealth.company.api.entity.vendor.CompanyVendor;
import com.redesignhealth.company.api.entity.vendor.CompanyVendorContact;
import com.redesignhealth.company.api.entity.vendor.Vendor;
import com.redesignhealth.company.api.taxonomy.CompanyTaxonomy;
import jakarta.annotation.Nullable;
import java.time.Instant;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

public class Fixtures {

  public static final String TEST_COMPANY_ID = "1KlMnh9a";
  public static final String TEST_LIBRARY_CONTENT_ID = "1KlMnh9a";
  public static final String TEST_PERSON_EMAIL = "test@redesignhealth.com";
  public static final String TEST_ID = "1KlMnh9a";
  public static final ObjectMapper mapper = new ObjectMapper();

  public static CompanyRef testCompanyRef() {
    return CompanyRef.of(TEST_COMPANY_ID);
  }

  public static LibraryRef testLibraryRef() {
    return LibraryRef.of(TEST_ID);
  }

  public static ResearchRef testResearchRef() {
    return ResearchRef.of(TEST_ID);
  }

  public static ExpertNoteRef testExpertNoteRef() {
    return ExpertNoteRef.of(TEST_ID);
  }

  public static Company testCompany(Person... members) {
    var company = Company.from(testCompanyRef());
    company.setName("Springtide");
    company.setLegalName("Springtide Child Development, Inc.");
    company.setNumber(1111L);
    company.setStatus(CompanyStatus.ACTIVE);
    company.setDescription(
        "The integrated, evidence-based autism center that seeks to transform the way families receive care.");
    company.setMembers(
        members.length == 0
            ? null
            : Arrays.stream(members)
                .map(member -> new CompanyMember(company, member, CompanyMemberStatus.ACTIVE))
                .collect(Collectors.toSet()));
    company.setCreated(Instant.EPOCH);
    company.setLastModified(Instant.EPOCH);
    company.setOnboardDocsFolderId("REDACTED");
    company.setTaxonomyId(TaxonomyRef.of("CARE_TEAM_COORDINATION"));
    company.setDashboardHref("https://example.com");
    return company;
  }

  public static Company testCompany(String ApiId) {
    var company = Company.from(ApiId);
    company.setName("Springtide");
    company.setLegalName("Springtide Child Development, Inc.");
    company.setNumber(1111L);
    company.setDescription(
        "The integrated, evidence-based autism center that seeks to transform the way families receive care.");
    company.setCreated(Instant.EPOCH);
    company.setLastModified(Instant.EPOCH);
    company.setOnboardDocsFolderId("REDACTED");
    return company;
  }

  public static Company testIpMarketplaceCompany(Person person) {
    var company = (person != null) ? testCompany(person) : testCompany();
    company.setNumber(null);
    company.setOnboardDocsFolderId(null);
    company.setTaxonomyId(null);
    company.setDashboardHref(null);
    return testCreateLinkIntoCompanyAndIpMarketplaceCompany(company);
  }

  public static Company testIpMarketplaceCompany() {
    var company = testCompany();
    company.setNumber(null);
    company.setOnboardDocsFolderId(null);
    company.setTaxonomyId(null);
    company.setDashboardHref(null);
    return testCreateLinkIntoCompanyAndIpMarketplaceCompany(company);
  }

  public static Company testCreateLinkIntoCompanyAndIpMarketplaceCompany(Company company) {
    var companyIpMarketplace = new CompanyIpMarketplace();
    companyIpMarketplace.setCompany(company);
    companyIpMarketplace.setActivityType(CompanyIPMarketplaceType.ENTERPRISE_SELLER);
    companyIpMarketplace.setOrganizationType(
        CompanyIPMarketplaceOrganizationType.IDN_HEALTH_SYSTEM);
    companyIpMarketplace.setRegion(CompanyIPMarketplaceRegion.NORTHEAST);
    company.setCompanyIpMarketplace(companyIpMarketplace);
    return company;
  }

  public static String testPayloadIpMarketPlaceForCreate() {
    return """
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
        """;
  }

  public static String testPayloadIpMarketPlaceForUpdate() {
    return """
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
          "freedomToOperateCertification": "YES"
        }
        """;
  }

  public static IpMarketplace testIpMarketPlace(String sellerEmail) {
    var ipMarketplace = new IpMarketplace();
    var person = testPerson(ROLE_OP_CO_USER, sellerEmail);
    var company = testIpMarketplaceCompany(person);
    var companyMember = new CompanyMember(company, person, CompanyMemberStatus.ACTIVE);
    person.setMemberOf(Set.of(companyMember));
    ipMarketplace.setName("ipMarketPlace");
    ipMarketplace.setExecutiveSummary("executiveSummary");
    ipMarketplace.setDisease("disease");
    ipMarketplace.setOrganOfFocus(List.of(IpMarketplaceOrganOfFocus.NOSE));
    var ipMarketPlaceSeller = new IpMarketplaceSeller();
    ipMarketPlaceSeller.setIpMarketplace(ipMarketplace);
    ipMarketPlaceSeller.setSeller(person);
    ipMarketplace.setIpMarketplaceSeller(ipMarketPlaceSeller);
    ipMarketplace.setCompanyIpMarketplace(company.getCompanyIpMarketplace());
    ipMarketplace.setApiId(IpMarketplaceRef.of("iPMarketplaceId"));
    ipMarketplace.setTherapeuticNeedOrTrendsBeingAddressed("Lorem ipso....");
    ipMarketplace.setTechnologyOverview("Lorem ipso....");
    ipMarketplace.setLicenseRestriction(true);
    ipMarketplace.setAboutLicenseRestriction("Lorem Ipso...");
    ipMarketplace.setAssociatedFilesOrMedia(List.of(LinkRef.of("name", "https://example.com")));
    ipMarketplace.setPatentStatus(IpMarketplacePatentStatus.PATENTED);
    ipMarketplace.setSellerSummaryTechTransferApproach("Lorem Ipso....");
    ipMarketplace.setResponsibleInventor("Lorem Ipso....");
    ipMarketplace.setPatentStatusHref("https://example.com");
    ipMarketplace.setFreedomToOperateCertification(IpMarketplaceFreedomToOperateCertification.NO);
    ipMarketplace.setStatus(IpMarketplaceStatus.ACTIVE);
    return ipMarketplace;
  }

  public static PersonRef testPersonRef() {
    return PersonRef.of(TEST_PERSON_EMAIL);
  }

  public static Person testPerson() {
    return testPerson(null);
  }

  public static Person testPerson(RoleAuthority role) {
    var person = Person.from(testPersonRef());
    person.setGivenName("Terra");
    person.setFamilyName("Branford");
    person.setRole(role);
    person.setMemberOf(null);
    person.setCreated(Instant.EPOCH);
    person.setLastModified(Instant.EPOCH);
    return person;
  }

  public static Person testPerson(RoleAuthority role, String email) {
    var person = Person.from(email);
    person.setGivenName("Terra");
    person.setFamilyName("Branford");
    person.setRole(role);
    person.setMemberOf(null);
    person.setCreated(Instant.EPOCH);
    person.setLastModified(Instant.EPOCH);
    return person;
  }

  public static FormDefinition testFormDefinition(FormDefinition.Type type) {
    var formDefinition = FormDefinition.of(type);
    try {
      formDefinition.setSchema(
          mapper.readTree(
              """
        {
        "meta": {
            "form-id": "v1",
            "form-title": "Example Title",
            "form-description": "Example Description"
          },
          "properties": {
            "firstName": {
              "type": "string",
              "inputType": "text",
              "label": "First name",
              "placeholder": "Jane",
              "pattern": "[a-zA-z]+",
              "minLength": 1,
              "maxLength": 10
            }
          }
        }"""));
    } catch (JsonProcessingException e) {
      throw new RuntimeException(e);
    }
    return formDefinition;
  }

  public static RequestForm testRequestForm(FormDefinition.Type type) {
    var requestForm =
        RequestForm.builder(InfrastructureRequest.builder(testCompany()).build(), type);

    try {
      requestForm.form(
          mapper.readTree(
              """
          {
          "firstName": "Jacklin"
          }
        """));
    } catch (JsonProcessingException e) {
      throw new RuntimeException(e);
    }
    return requestForm.build();
  }

  public static Topic testTopic() {
    return testTopic(null);
  }

  public static Topic testTopic(String content) {
    return Topic.builder()
        .title("Best Practices for Maintaining Your Cap Table Post Financing")
        .description("Describes the best practices for maintaining a capitalization table.")
        .category("Company Foundations")
        .type(TopicType.ARTICLE)
        .content(content)
        .id("1")
        .build();
  }

  public static Consent testConsent(Person person) {
    var consent = Consent.of(Consent.Type.TERMS_OF_SERVICE);
    consent.setAccepted(testDate());
    consent.setVersion("1");
    consent.setPerson(person);
    return consent;
  }

  public static LibraryContent testLibraryContent(@Nullable ContentRef parentId) {
    var content =
        LibraryContent.from(ContentRef.of(TEST_LIBRARY_CONTENT_ID), LibraryContent.from(parentId));
    content.setTitle("Best Practices for Maintaining Your Cap Table Post Financing");
    content.setDescription("Describes the best practices for maintaining a capitalization table.");
    content.setType(LibraryContentType.ARTICLE);
    content.setRemoteContentSource(RemoteContentSource.GOOGLE_DRIVE);
    content.setRemoteContentId("REDACTED");
    content.setOrderId(-1);
    return content;
  }

  public static Library testLibrary() {
    var library = Library.from(testLibraryRef());
    library.setDisplayName("Developer Documentation");
    return library;
  }

  public static ResearchSearchDoc testResearchSearchDoc() {
    return ResearchSearchDoc.from(testResearch(), List.of());
  }

  public static Map<String, List<String>> testHighlightedText() {
    return Map.of("content", List.of("my <em>life</em>, except my <em>life</em>."));
  }

  public static ExpertNote testExpertNote() {
    var expertNote = new ExpertNote();
    expertNote.setApiId(testExpertNoteRef());
    expertNote.setIntervieweeName("Terra Branford");
    expertNote.setIntervieweeCompany("Shinra");
    expertNote.setIntervieweeEmail("terra@example.com");
    expertNote.setNoteTaker("Celes Chere");
    expertNote.setType("Interview");
    expertNote.setCreated(testDate());
    expertNote.setLinkedInProfileHref("https://example.com/profile");
    expertNote.setSourceOfInterview("Former colleague");
    expertNote.setAssociatedEntities(List.of("Shinra"));
    expertNote.setStakeholders(List.of("Patients"));
    expertNote.setCompanies(Set.of(testCompany()));
    expertNote.setAdditionalTags(List.of("tag 1"));
    expertNote.setAttachments(List.of(testLinkRef()));
    expertNote.setTaxonomyTerm1(List.of("Care Delivery"));
    expertNote.setTaxonomyTerm2(List.of("Clinical Operations"));
    expertNote.setTaxonomyTerm3(List.of("Care Team Coordination"));
    expertNote.setIsAttachmentDisclaimerAccepted(true);
    expertNote.setNotesHref("https://example.com");
    expertNote.setNotesRaw("RAW NOTES");
    return expertNote;
  }

  public static ExpertNoteSearchDoc testExpertCallSearchDoc() {
    return ExpertNoteSearchDoc.builder()
        .intervieweeName("Terra Branford")
        .intervieweeCompany("Shinra")
        .intervieweeEmail("terra@example.com")
        .noteTaker("Celes Chere")
        .noteType("Interview")
        .createdAt(testDate())
        .linkedInProfileHref("https://example.com/profile")
        .interviewSource("Former colleague")
        .associatedEntities(List.of("Shinra"))
        .stakeholders(List.of("Patients"))
        .companyApiCompanyIds(List.of(testCompanyRef().value()))
        .tags(List.of("tag 1"))
        .attachments(List.of(testLinkRef()))
        .taxonomyTerm1(List.of("Care Delivery"))
        .taxonomyTerm2(List.of("Clinical Operations"))
        .taxonomyTerm3(List.of("Care Team Coordination"))
        .build();
  }

  public static CeoDirectoryDoc testCeoDirectoryCallSearchDoc() {
    return CeoDirectoryDoc.builder()
        .bio("Lorem ipso....")
        .additionalInfo("Lorem ipso....")
        .location("California")
        .businessType("B2B")
        .member(
            MemberDoc.builder()
                .email("rh@redesignhealth.com")
                .familyName("familyName")
                .givenName("givenName")
                .company(
                    CompanyDoc.builder()
                        .name("Company")
                        .id(testCompanyRef().getApiId())
                        .fundraiseStatus(CompanyFundraiseStatus.PRE_LAUNCH_PHASE.getDisplayName())
                        .build())
                .build())
        .businessFocusAreas(List.of("APM Incentives Design"))
        .customerSegment(List.of("Health plans"))
        .healthcareSector("Biopharma & Device")
        .marketServiceArea(List.of("Atlanta"))
        .pictureHref("https://example.com")
        .visible("OPT_IN")
        .build();
  }

  public static IpMarketplaceSearchDoc testIpMarketplaceCallSearchDoc() {
    return IpMarketplaceSearchDoc.builder()
        .createdDate(Instant.now())
        .disease("Lorem ipso....")
        .region("NORTHEAST")
        .executiveSummary("Lorem ipso....")
        .organizationType("DN_HEALTH_SYSTEM")
        .organOfFocus(List.of("ADRENAL_GLANDS"))
        .specialities(List.of("ALLERGY_AND_IMMUNOLOGY"))
        .technologyType(List.of("MEDICAL_DEVICES"))
        .name("Lorem ipso....")
        .build();
  }

  public static ResearchExternalContentDoc testResearchExternalContentDoc() {
    return ResearchExternalContentDoc.builder()
        .createdAt(testDate())
        .href("https://example.com/profile")
        .attachmentUrl(List.of("https://example.com/"))
        .name("Text")
        .diseaseStates(List.of("diseaseState"))
        .url(List.of("https://example.com/"))
        .companyApiCompanyId("ZFBkW915")
        .tags(List.of("tags"))
        .associatedEntities(List.of("Eve Nom"))
        .noteTaker("terra.brandon@redesignhealth.com")
        .id("ZFBkW915")
        .technologies(List.of("technologies"))
        .taxonomyTerm1(List.of("taxonomy1"))
        .taxonomyTerm2(List.of("taxonomy2"))
        .taxonomyTerm3(List.of("taxonomy13"))
        .stakeholders(List.of("stakeholders"))
        .type("type")
        .attachments(List.of(LinkRef.of("https://example.com/", "test")))
        .build();
  }

  public static Vendor testVendor() {
    return testVendor(null);
  }

  public static Vendor testVendor(CompanyVendor companyVendor) {
    var vendor = Vendor.of(VendorRef.of(TEST_ID));
    var email = "rh@redesignhealth.com";
    vendor.setName("Boomset");
    vendor.setId(1L);
    vendor.setCreated(testDate());
    vendor.setCreatedBy(email);
    vendor.setVendorType(CompanyVendorType.VENDOR);
    vendor.setVendorPointContact("longlongemail@domain.com");
    vendor.setDescription("Lorem ipsum dolor sit amet consectetur.");
    vendor.setPricing("Lorem ipsum dolor sit amet consectetur.");
    vendor.setDiscountInfo("Lorem ipsum dolor sit amet consectetur.");
    vendor.setFeedbackFromOpcos("Lorem ipsum dolor sit amet consectetur.");
    vendor.setPros("Lorem ipsum dolor sit amet consectetur.");
    vendor.setCons("Lorem ipsum dolor sit amet consectetur.");
    vendor.setFeatures("Lorem ipsum dolor sit amet consectetur.");
    vendor.setLastModifiedBy(testPersonRef().value());
    vendor.setLastModified(testDate());
    vendor.setHasPlatformAgreement(true);
    if (companyVendor != null) {
      vendor.setCompanyVendors(Set.of(companyVendor));
    }
    return vendor;
  }

  public static CompanyTaxonomy testCompanyTaxonomy() {
    CompanyTaxonomy.YamlTaxonomy careTeamCoordination =
        new CompanyTaxonomy.YamlTaxonomy("CARE_TEAM_COORDINATION", "Care Team Coordination", null);
    CompanyTaxonomy.YamlTaxonomy clinicalOperations =
        new CompanyTaxonomy.YamlTaxonomy(
            "CLINICAL_OPERATIONS", "Clinical Operations", List.of(careTeamCoordination));
    CompanyTaxonomy.YamlTaxonomy careDelivery =
        new CompanyTaxonomy.YamlTaxonomy(
            "CARE_DELIVERY", "Care Delivery", List.of(clinicalOperations));
    return new CompanyTaxonomy(List.of(careDelivery));
  }

  public static Research testResearch() {
    var research = Research.of(testResearchRef());
    research.setTitle("PCP Interviews");
    research.setAuthors(List.of(ResearchAuthor.of("test@redesignhealth.com")));
    research.setCreated(testDate());
    research.setResearchObjectives("* Objective 1\n* Objective 2");
    research.setResearchServices(List.of("Service 1", "Service 2"));
    research.setMethods(List.of("Method 1", "Method 2"));
    research.setResearchSampleSize(42L);
    research.setToplineSegments(List.of("Patients", "Other"));
    research.setCompany(testCompany());
    research.setSpecializedMethods(List.of("Q-sort Exercise"));
    research.setPatientSegments(List.of("GenZ"));
    research.setTeamRole("In-house");
    research.setDocumentLinks(List.of(testLinkRef()));
    return research;
  }

  public static LinkRef testLinkRef() {
    return LinkRef.of("https://example.com", "test.pdf");
  }

  public static Instant testDate() {
    return Instant.parse("2018-03-28T14:32:11.838Z");
  }

  public static Ceo testCeo(CeoRef ceoRef, PersonRef personRef) {
    var ceo = new Ceo();
    ceo.setLinkedinHref("https://example.com");
    ceo.setBio("Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do");
    ceo.setAdditionalInfo("Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do");
    ceo.setVisible(CeoVisible.OPT_IN);
    ceo.setBusinessFocusArea(List.of(CeoBusinessFocusArea.ECOMMERCE));
    ceo.setHealthcareSector(CeoHealthcareSector.ACUTE_CARE);
    ceo.setLocation("Atlanta");
    ceo.setCustomerSegment(List.of(CeoCustomerSegment.CONSUMER));
    ceo.setBusinessType(CeoBusinessType.B2B);
    ceo.setApiId(ceoRef);
    ceo.setEmail(personRef);
    ceo.setMarketServiceArea(List.of("California"));
    ceo.setPictureHref("https://example.com");
    return ceo;
  }

  public static Category testCategory(String name) {
    var category = Category.from(CategoryRef.of(TEST_ID));
    category.setName(name);
    return category;
  }

  public static Subcategory testSubcategory(String name, Category category) {
    var subcategory = Subcategory.of(category, SubcategoryRef.of(TEST_ID));
    subcategory.setName(name);
    return subcategory;
  }

  public static CompanyVendor testCompanyVendor() {
    var companyVendor =
        CompanyVendor.from(CompanyVendorRef.of(TEST_ID), testCompany(), testVendor());
    companyVendor.setStartDate(testDate());
    companyVendor.setEndDate(testDate());
    companyVendor.setEngagementStatus(CompanyVendorEngagementStatus.CONSIDERED);
    companyVendor.getSubcategories().add(testSubcategory("CI/CD", testCategory("Infrastructure")));
    companyVendor.getContacts().add(testCompanyVendorContact(companyVendor));
    return companyVendor;
  }

  public static CompanyVendorContact testCompanyVendorContact(CompanyVendor companyVendor) {
    return CompanyVendorContact.from(companyVendor, testPerson(), true);
  }

  public static IpMarketplaceTrack testIpMarketplaceTrack(
      IpMarketplace ipMarketplace, Person buyerPerson) {
    var ipMarketplaceTrack = new IpMarketplaceTrack();
    ipMarketplaceTrack.setIpMarketplace(ipMarketplace);
    ipMarketplaceTrack.setStatus(IpMarketplaceTrackContactInfo.REQUESTED_CONTACT_INFO);
    ipMarketplaceTrack.setBuyer(buyerPerson);
    ipMarketplaceTrack.setBuyerCompanyIpMarketplace(ipMarketplace.getCompanyIpMarketplace());
    ipMarketplaceTrack.setApiId(IpMarketplaceTrackRef.of("ipMarketPlaceTrackId"));
    ipMarketplaceTrack.setRoomId("roomId");
    ipMarketplace.setIpMarketplaceTracks(Set.of(ipMarketplaceTrack));
    return ipMarketplaceTrack;
  }
}
