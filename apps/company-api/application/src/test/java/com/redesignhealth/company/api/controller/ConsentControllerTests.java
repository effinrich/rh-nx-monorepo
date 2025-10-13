package com.redesignhealth.company.api.controller;

import static com.redesignhealth.company.api.entity.Consent.Type.TERMS_OF_SERVICE;
import static com.redesignhealth.company.api.scaffolding.DocUtils.linksField;
import static com.redesignhealth.company.api.scaffolding.Fixtures.testConsent;
import static com.redesignhealth.company.api.scaffolding.Fixtures.testPerson;
import static org.mockito.AdditionalAnswers.returnsFirstArg;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.restdocs.hypermedia.HypermediaDocumentation.linkWithRel;
import static org.springframework.restdocs.hypermedia.HypermediaDocumentation.links;
import static org.springframework.restdocs.mockmvc.MockMvcRestDocumentation.document;
import static org.springframework.restdocs.payload.PayloadDocumentation.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.redesignhealth.company.api.entity.ref.PersonRef;
import com.redesignhealth.company.api.repository.ConsentRepository;
import com.redesignhealth.company.api.repository.PersonRepository;
import com.redesignhealth.company.api.scaffolding.CommonTestConfig;
import com.redesignhealth.company.api.scaffolding.WithRedesignUser;
import com.redesignhealth.company.api.service.ConsentService;
import java.util.Optional;
import org.hamcrest.Matchers;
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

@WebMvcTest(ConsentController.class)
@Import({CommonTestConfig.class})
@AutoConfigureRestDocs("target/generated-snippets/consent")
public class ConsentControllerTests {

  @Autowired private MockMvc mockMvc;

  @MockBean ConsentRepository consentRepository;

  @MockBean PersonRepository personRepository;

  @TestConfiguration
  static class TestConfig {
    @Bean
    public ConsentService consentService(
        ConsentRepository consentRepository, PersonRepository personRepository) {
      return new ConsentService(consentRepository, personRepository);
    }
  }

  @Test
  @WithRedesignUser(email = "test@redesignhealth.com")
  public void testGet_returnsResult() throws Exception {
    var person = testPerson();
    var consent = testConsent(person);
    when(personRepository.findByEmail(PersonRef.of("test@redesignhealth.com")))
        .thenReturn(Optional.of(person));
    when(consentRepository.findByTypeAndPerson(TERMS_OF_SERVICE, testPerson()))
        .thenReturn(Optional.of(consent));

    mockMvc
        .perform(get("/me/consent/{type}", TERMS_OF_SERVICE))
        .andExpect(status().isOk())
        .andDo(
            document(
                "get",
                responseFields(typeField(), acceptedField(), versionField(), linksField()),
                links(meLink())));
  }

  @Test
  @WithRedesignUser(email = "test@redesignhealth.com")
  public void testGet_handles404() throws Exception {
    when(personRepository.findByEmail(PersonRef.of("test@redesignhealth.com")))
        .thenReturn(Optional.of(testPerson()));
    when(consentRepository.findByTypeAndPerson(TERMS_OF_SERVICE, testPerson()))
        .thenReturn(Optional.empty());

    mockMvc.perform(get("/me/consent/{type}", TERMS_OF_SERVICE)).andExpect(status().isNotFound());
  }

  @Test
  @WithRedesignUser(email = "test@redesignhealth.com")
  public void testUpsert_handlesNewEntry() throws Exception {
    when(personRepository.findByEmail(PersonRef.of("test@redesignhealth.com")))
        .thenReturn(Optional.of(testPerson()));
    when(consentRepository.save(any())).then(returnsFirstArg());

    mockMvc
        .perform(
            put("/me/consent/{type}", TERMS_OF_SERVICE)
                .contentType(MediaType.APPLICATION_JSON)
                .content(
                    """
            {
              "accepted": "2018-03-28T14:32:11.838Z",
              "version": "1"
            }
        """))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.type.displayName", Matchers.is("Terms of service")))
        .andExpect(jsonPath("$.accepted", Matchers.is("2018-03-28T14:32:11.838Z")))
        .andExpect(jsonPath("$.version", Matchers.is("1")))
        .andDo(
            document(
                "upsert",
                requestFields(acceptedField(), versionField()),
                responseFields(typeField(), acceptedField(), versionField(), linksField()),
                links(meLink())));
  }

  private LinkDescriptor meLink() {
    return linkWithRel("me").description("Person the consent was accepted for.");
  }

  private FieldDescriptor acceptedField() {
    return fieldWithPath("accepted")
        .description("Format: ISO 8601 timestamp. When person last accepted a consent.");
  }

  private FieldDescriptor versionField() {
    return fieldWithPath("version")
        .description(
            "Version of consent form. Left up to client to determine (max 255 characters).");
  }

  private FieldDescriptor typeField() {
    return subsectionWithPath("type").description("Type of consent form. Unique per person.");
  }
}
