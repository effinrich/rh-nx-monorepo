package com.redesignhealth.company.api.controller;

import static com.redesignhealth.company.api.entity.request.RoleAuthority.ROLE_RH_ADMIN;
import static com.redesignhealth.company.api.entity.request.RoleAuthority.ROLE_RH_USER;
import static com.redesignhealth.company.api.scaffolding.DocUtils.apiIdField;
import static com.redesignhealth.company.api.scaffolding.DocUtils.createdField;
import static com.redesignhealth.company.api.scaffolding.DocUtils.hasPlatformAgreementField;
import static com.redesignhealth.company.api.scaffolding.DocUtils.lastModifiedField;
import static com.redesignhealth.company.api.scaffolding.DocUtils.linksField;
import static com.redesignhealth.company.api.scaffolding.DocUtils.nameVendorField;
import static com.redesignhealth.company.api.scaffolding.DocUtils.pricingField;
import static com.redesignhealth.company.api.scaffolding.DocUtils.subcategoriesField;
import static com.redesignhealth.company.api.scaffolding.Fixtures.testCategory;
import static com.redesignhealth.company.api.scaffolding.Fixtures.testCompanyRef;
import static com.redesignhealth.company.api.scaffolding.Fixtures.testCompanyVendor;
import static com.redesignhealth.company.api.scaffolding.Fixtures.testPerson;
import static com.redesignhealth.company.api.scaffolding.Fixtures.testSubcategory;
import static com.redesignhealth.company.api.scaffolding.Fixtures.testVendor;
import static org.hamcrest.Matchers.is;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.restdocs.mockmvc.MockMvcRestDocumentation.document;
import static org.springframework.restdocs.payload.PayloadDocumentation.fieldWithPath;
import static org.springframework.restdocs.payload.PayloadDocumentation.requestFields;
import static org.springframework.restdocs.payload.PayloadDocumentation.responseFields;
import static org.springframework.restdocs.payload.PayloadDocumentation.subsectionWithPath;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.redesignhealth.company.api.entity.ref.PersonRef;
import com.redesignhealth.company.api.entity.request.RoleAuthority;
import com.redesignhealth.company.api.entity.vendor.Vendor;
import com.redesignhealth.company.api.repository.PersonRepository;
import com.redesignhealth.company.api.repository.VendorRepository;
import com.redesignhealth.company.api.scaffolding.CommonTestConfig;
import com.redesignhealth.company.api.scaffolding.WithRedesignUser;
import com.redesignhealth.company.api.service.SubcategoryService;
import com.redesignhealth.company.api.service.VendorService;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentMatchers;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.restdocs.AutoConfigureRestDocs;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.MediaType;
import org.springframework.restdocs.payload.FieldDescriptor;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(VendorController.class)
@Import({CommonTestConfig.class})
@AutoConfigureRestDocs("target/generated-snippets/vendor")
public class VendorControllerTests {
  @Autowired private MockMvc mockMvc;
  @MockBean private PersonRepository personRepository;
  @MockBean private VendorRepository vendorRepository;
  @MockBean private SubcategoryService subcategoryService;

  @TestConfiguration
  static class TestConfig {

    @Bean
    public VendorService vendorService(
        VendorRepository companyVendorRepository, SubcategoryService subcategoryService) {
      return new VendorService(companyVendorRepository, subcategoryService);
    }
  }

  @Test
  @WithRedesignUser(role = ROLE_RH_ADMIN)
  public void testGetVendors_Get_One_For_q_parameter_And_Filter() throws Exception {
    var vendor = testVendor(testCompanyVendor());
    vendor.setSubcategories(Set.of(testSubcategory("Subcategory", testCategory("Infrastructure"))));
    when(vendorRepository.findAll(any(Specification.class), any(Pageable.class)))
        .thenReturn(new PageImpl(List.of(vendor)));
    mockMvc
        .perform(get("/vendor?q=query&filter=category,Infrastructure"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.content[0].name", is("Boomset")))
        .andDo(
            document(
                "query",
                responseFields(subsectionWithPath("content").description("Vendor"), linksField())
                    .andWithPrefix(
                        "content[].",
                        nameVendorField(),
                        apiIdField(),
                        pricingField(),
                        contactsField(),
                        vendorTypeField(),
                        vendorPointContactField(),
                        descriptionField(),
                        prosField(),
                        discountInfoField(),
                        feedbackFromOpCosField(),
                        consField(),
                        createdField(),
                        lastModifiedField(),
                        featuresField())));
  }

  @Test
  @WithRedesignUser(role = ROLE_RH_USER)
  public void testQuery_hide_vendor_PoC_for_OpCo_user() throws Exception {
    var vendor = testVendor(testCompanyVendor());
    vendor.setSubcategories(Set.of(testSubcategory("Subcategory", testCategory("Infrastructure"))));
    when(vendorRepository.findAll(any(Specification.class), any(Pageable.class)))
        .thenReturn(new PageImpl(List.of(vendor)));
    mockMvc
        .perform(get("/vendor?q=query&filter=category,Infrastructure"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.content[0].name", is("Boomset")))
        .andExpect(jsonPath("$.content[0].vendorPointContact", is("longlongemail@domain.com")));
  }

  @Test
  @WithRedesignUser(role = ROLE_RH_ADMIN, email = "adminUser@redesignhealth.com")
  public void testCreateVendorData_Is_OK_First_Time() throws Exception {
    var vendor = testVendor(testCompanyVendor());
    when(vendorRepository.save(ArgumentMatchers.any(Vendor.class))).thenReturn(vendor);
    when(personRepository.findByEmail(PersonRef.of(vendor.getCreatedBy())))
        .thenReturn(Optional.of(testPerson()));

    var payload =
        """
      {
      	"name": "Boomster",
      	"subcategories": [{
      		"category": {
      			"apiId": "category_id",
      			"name": "category"
      		},
      		"apiId": "subcategory_id",
      		"name": "subcategory"
      	}],
        "vendorType": "VENDOR",
        "vendorPointContact": "longlongemail@domain.com",
        "description": "Lorem ipsum dolor sit amet consectetur.",
        "pros": "Justo pulvinar est tortor ut pretium ultrices vitae penatibus libero.",
        "pricing": "$3750/month for up to 35k patients",
        "discountInfo": "Risus pretium scelerisque egestas in",
        "feedbackFromOpCos": "Odio consectetur feugiat in penatibus posuere.",
        "cons": "Justo pulvinar est tortor ut pretium ultrices vitae penatibus libero. ",
        "features": "Viverra adipiscing hendrerit magna a a odio ac.",
        "hasPlatformAgreement": true
        }
      """;
    mockMvc
        .perform(post("/vendor").contentType(MediaType.APPLICATION_JSON).content(payload))
        .andExpect(status().isCreated())
        .andDo(
            document(
                "create-vendor-data",
                requestFields(
                        nameVendorField(),
                        vendorTypeField(),
                        vendorPointContactField(),
                        descriptionField(),
                        prosField(),
                        pricingField(),
                        discountInfoField(),
                        feedbackFromOpCosField(),
                        consField(),
                        featuresField(),
                        hasPlatformAgreementField())
                    .andWithPrefix("subcategories[].", subcategoriesField()),
                responseFields(
                    nameVendorField(),
                    pricingField(),
                    apiIdField(),
                    vendorTypeField(),
                    vendorPointContactField(),
                    descriptionField(),
                    prosField(),
                    discountInfoField(),
                    feedbackFromOpCosField(),
                    consField(),
                    featuresField(),
                    hasPlatformAgreementField(),
                    createdField(),
                    lastModifiedField(),
                    linksField())));
  }

  @Test
  @WithRedesignUser(role = ROLE_RH_ADMIN, email = "adminUser@redesignhealth.com")
  public void testCreateVendorData_Data_Should_Be_Created_If_Subcategory_Info_Is_Not_Defined()
      throws Exception {
    var person = testPerson(ROLE_RH_ADMIN);
    var email = "rh@redesignhealth.com";
    when(vendorRepository.save(ArgumentMatchers.any(Vendor.class))).thenReturn(testVendor());
    when(personRepository.findByEmail(PersonRef.of(email))).thenReturn(Optional.of(person));
    when(personRepository.findByEmail(PersonRef.of("adminUser@redesignhealth.com")))
        .thenReturn(Optional.of(person));
    var payload =
        """
    {
      "name": "Boomset",
      	"subcategories": [{
      		"category": {
      			"apiId": "category_id",
      			"name": "category"
      		},
      		"apiId": null,
      		"name": null
      	}],
      "vendorType": "VENDOR",
      "vendorPointContact": "longlongemail@domain.com",
      "description": "Lorem ipsum dolor sit amet consectetur.",
      "pros": "Justo pulvinar est tortor ut pretium ultrices vitae penatibus libero.",
      "pricing": "$3750/month for up to 35k patients",
      "discountInfo": "Risus pretium scelerisque egestas in",
      "feedbackFromOpCos": "Odio consectetur feugiat in penatibus posuere.",
      "cons": "Justo pulvinar est tortor ut pretium ultrices vitae penatibus libero. ",
      "features": "Viverra adipiscing hendrerit magna a a odio ac."
      }
      """;

    mockMvc
        .perform(post("/vendor").contentType(MediaType.APPLICATION_JSON).content(payload))
        .andExpect(status().isCreated())
        .andExpect(jsonPath("$.name", is("Boomset")));
  }

  @Test
  @WithRedesignUser(role = ROLE_RH_ADMIN)
  public void testCreateVendorData_422s_Vendor_Name_Duplicated() throws Exception {

    when(vendorRepository.existsByName("Boomset")).thenReturn(true);

    mockMvc
        .perform(
            post("/vendor")
                .contentType(MediaType.APPLICATION_JSON)
                .content(
                    """
            {
            "name": "Boomset",
            "subcategories": [{
      		"category": {
      			"apiId": "category_id",
      			"name": "category"
      		},
      		"apiId": null,
      		"name": null
      	}]
            }
            """))
        .andExpect(status().isUnprocessableEntity())
        .andExpect(jsonPath("$.errors[0].name", is("name")))
        .andExpect(jsonPath("$.errors[0].rejectedValue", is("Boomset")))
        .andExpect(jsonPath("$.errors[0].description", is("must be unique")));
    ;
  }

  @Test
  @WithRedesignUser(role = ROLE_RH_ADMIN)
  public void testCreateVendorData_Should_Fail_If_Subcategories_Is_Not_Sent() throws Exception {

    var payload =
        """
    {
      "name": "Boomster",
      "vendorType": "VENDOR",
      "vendorPointContact": "longlongemail@domain.com",
      "description": "Lorem ipsum dolor sit amet consectetur.",
      "pros": "Justo pulvinar est tortor ut pretium ultrices vitae penatibus libero.",
      "pricing": "$3750/month for up to 35k patients",
      "discountInfo": "Risus pretium scelerisque egestas in",
      "feedbackFromOpCos": "Odio consectetur feugiat in penatibus posuere.",
      "cons": "Justo pulvinar est tortor ut pretium ultrices vitae penatibus libero. ",
      "features": "Viverra adipiscing hendrerit magna a a odio ac."
      }
    """;
    mockMvc
        .perform(post("/vendor").contentType(MediaType.APPLICATION_JSON).content(payload))
        .andExpect(status().isUnprocessableEntity())
        .andExpect(jsonPath("$.errors[0].name", is("subcategories")))
        .andExpect(jsonPath("$.errors[0].description", is("must not be empty")));
  }

  @Test
  @WithRedesignUser(role = ROLE_RH_ADMIN, email = "adminUser@redesignhealth.com")
  public void testUpdateVendorData_Is_OK() throws Exception {
    var vendor = testVendor(testCompanyVendor());
    when(vendorRepository.findByApiId(vendor.getApiId())).thenReturn(Optional.of(vendor));
    when(vendorRepository.save(ArgumentMatchers.any(Vendor.class))).thenReturn(vendor);

    when(personRepository.findByEmail(PersonRef.of(testVendor().getLastModifiedBy())))
        .thenReturn(Optional.of(testPerson()));
    when(subcategoryService.processSubcategories(any()))
        .thenReturn(Set.of(testSubcategory("subcategory", testCategory("category"))));
    var payload =
        """

      {
      	"subcategories": [{
      		"category": {
      			"apiId": "category_id",
      			"name": "category"
      		},
      		"apiId": "subcategory_id",
      		"name": "subcategory"
      	}],
        "vendorType": "VENDOR",
        "vendorPointContact": "longlongemail@domain.com",
        "description": "Lorem ipsum dolor sit amet consectetur.",
        "pros": "Justo pulvinar est tortor ut pretium ultrices vitae penatibus libero.",
        "pricing": "$3750/month for up to 35k patients",
        "discountInfo": "Risus pretium scelerisque egestas in",
        "feedbackFromOpCos": "Odio consectetur feugiat in penatibus posuere.",
        "cons": "Justo pulvinar est tortor ut pretium ultrices vitae penatibus libero. ",
        "features": "Viverra adipiscing hendrerit magna a a odio ac.",
        "hasPlatformAgreement": true
        }
      """;

    mockMvc
        .perform(
            put("/vendor/{id}", vendor.getApiId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(payload))
        .andExpect(status().isOk())
        .andDo(
            document(
                "update-vendor-data",
                requestFields(
                        vendorTypeField(),
                        vendorPointContactField(),
                        descriptionField(),
                        prosField(),
                        discountInfoField(),
                        feedbackFromOpCosField(),
                        consField(),
                        pricingField(),
                        featuresField(),
                        hasPlatformAgreementField())
                    .andWithPrefix("subcategories[].", subcategoriesField()),
                responseFields(
                        nameVendorField(),
                        pricingField(),
                        apiIdField(),
                        vendorTypeField(),
                        vendorPointContactField(),
                        descriptionField(),
                        prosField(),
                        discountInfoField(),
                        feedbackFromOpCosField(),
                        consField(),
                        featuresField(),
                        createdField(),
                        lastModifiedField(),
                        hasPlatformAgreementField(),
                        linksField())
                    .andWithPrefix("subcategories[].", subcategoriesField())));
  }

  @Test
  @WithRedesignUser(role = ROLE_RH_ADMIN)
  public void testGet_okay() throws Exception {
    var vendor = testVendor(testCompanyVendor());
    when(vendorRepository.findByApiId(vendor.getApiId())).thenReturn(Optional.of(vendor));
    mockMvc
        .perform(get("/vendor/{id}", testVendor().getApiId()))
        .andExpect(status().isOk())
        .andDo(
            document(
                "get",
                responseFields(
                    nameVendorField(),
                    pricingField(),
                    apiIdField(),
                    vendorTypeField(),
                    contactsField(),
                    vendorPointContactField(),
                    descriptionField(),
                    prosField(),
                    discountInfoField(),
                    feedbackFromOpCosField(),
                    consField(),
                    hasPlatformAgreementField(),
                    featuresField(),
                    createdField(),
                    lastModifiedField(),
                    linksField())));
  }

  @Test
  @WithRedesignUser(role = ROLE_RH_ADMIN)
  public void testGet_not_found() throws Exception {
    var vendor = testVendor(testCompanyVendor());
    when(vendorRepository.findByApiId(vendor.getApiId())).thenReturn(Optional.empty());
    mockMvc.perform(get("/vendor/{id}", testVendor().getApiId())).andExpect(status().isNotFound());
  }

  @Test
  @WithRedesignUser(role = RoleAuthority.ROLE_RH_ADMIN)
  public void testDelete_is_okay() throws Exception {
    var vendor = testVendor();
    when(vendorRepository.findByApiId(vendor.getApiId())).thenReturn(Optional.of(vendor));
    mockMvc
        .perform(delete("/vendor/{companyVendorId}", testCompanyRef(), vendor.getApiId()))
        .andExpect(status().isNoContent())
        .andDo(document("delete"));
  }

  public static FieldDescriptor contactsField() {
    return subsectionWithPath("contacts").description("OpCo contacts");
  }

  public static FieldDescriptor vendorTypeField() {
    return subsectionWithPath("vendorType").description("Vendor Type: VENDOR/AGENCY/CONTRACTOR");
  }

  public static FieldDescriptor vendorPointContactField() {
    return fieldWithPath("vendorPointContact").description("Main contact on the vendor");
  }

  public static FieldDescriptor descriptionField() {
    return fieldWithPath("description").description("vendor description");
  }

  public static FieldDescriptor prosField() {
    return fieldWithPath("pros").description("vendor pros");
  }

  public static FieldDescriptor discountInfoField() {
    return fieldWithPath("discountInfo").description("vendor discount info");
  }

  public static FieldDescriptor feedbackFromOpCosField() {
    return fieldWithPath("feedbackFromOpCos").description("feedback from OpCos");
  }

  public static FieldDescriptor consField() {
    return fieldWithPath("cons").description("vendor pros");
  }

  public static FieldDescriptor featuresField() {
    return fieldWithPath("features").description("vendor features");
  }
}
