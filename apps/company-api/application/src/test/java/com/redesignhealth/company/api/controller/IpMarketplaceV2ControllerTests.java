package com.redesignhealth.company.api.controller;

import static com.redesignhealth.company.api.entity.request.RoleAuthority.ROLE_OP_CO_USER;
import static com.redesignhealth.company.api.scaffolding.Fixtures.testCompanyRef;
import static com.redesignhealth.company.api.scaffolding.Fixtures.testIpMarketPlace;
import static com.redesignhealth.company.api.scaffolding.Fixtures.testIpMarketplaceCompany;
import static com.redesignhealth.company.api.scaffolding.Fixtures.testIpMarketplaceTrack;
import static com.redesignhealth.company.api.scaffolding.Fixtures.testPerson;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.notNullValue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doCallRealMethod;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;
import static org.springframework.restdocs.mockmvc.MockMvcRestDocumentation.document;
import static org.springframework.restdocs.payload.PayloadDocumentation.fieldWithPath;
import static org.springframework.restdocs.payload.PayloadDocumentation.responseFields;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.redesignhealth.company.api.client.email.EmailSender;
import com.redesignhealth.company.api.client.prometheus.ExternalPrometheusClient;
import com.redesignhealth.company.api.client.rocketchat.RocketChatClient;
import com.redesignhealth.company.api.client.rocketchat.RocketChatClientImpl;
import com.redesignhealth.company.api.client.rocketchat.dto.AuthInfo;
import com.redesignhealth.company.api.client.search.SearchClient;
import com.redesignhealth.company.api.dto.command.ipMarketplace.IpMarketplaceBuyerRequestContactInfoCommand;
import com.redesignhealth.company.api.dto.enums.CompanyIPMarketplaceType;
import com.redesignhealth.company.api.dto.enums.CompanyMemberStatus;
import com.redesignhealth.company.api.dto.enums.IpMarketplaceTrackContactInfo;
import com.redesignhealth.company.api.entity.CompanyMember;
import com.redesignhealth.company.api.entity.ref.CompanyRef;
import com.redesignhealth.company.api.entity.ref.IpMarketplaceRef;
import com.redesignhealth.company.api.entity.ref.IpMarketplaceTrackRef;
import com.redesignhealth.company.api.entity.ref.PersonRef;
import com.redesignhealth.company.api.entity.request.RoleAuthority;
import com.redesignhealth.company.api.exception.IpMarketplaceTrackNotFoundException;
import com.redesignhealth.company.api.property.IpMarketplaceConverter;
import com.redesignhealth.company.api.repository.CompanyRepository;
import com.redesignhealth.company.api.repository.IpMarketplaceRepository;
import com.redesignhealth.company.api.repository.IpMarketplaceTrackRepository;
import com.redesignhealth.company.api.repository.PersonRepository;
import com.redesignhealth.company.api.scaffolding.CommonTestConfig;
import com.redesignhealth.company.api.scaffolding.WithRedesignUser;
import com.redesignhealth.company.api.service.IpMarketplaceService;
import java.net.URI;
import java.time.Instant;
import java.util.Optional;
import java.util.Set;
import java.util.function.Consumer;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentMatchers;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.restdocs.AutoConfigureRestDocs;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.restdocs.payload.FieldDescriptor;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(IpMarketplaceV2Controller.class)
@Import({CommonTestConfig.class})
@AutoConfigureRestDocs("target/generated-snippets/ip-marketplace-v2")
public class IpMarketplaceV2ControllerTests {
  @Autowired private MockMvc mockMvc;
  @MockBean private IpMarketplaceRepository ipMarketplaceRepository;

  @MockBean private IpMarketplaceTrackRepository ipMarketplaceTrackRepository;
  @MockBean private CompanyRepository companyRepository;
  @MockBean private PersonRepository personRepository;
  @MockBean private SearchClient searchClient;
  @MockBean private EmailSender emailSender;
  @MockBean private ExternalPrometheusClient prometheusClient;
  @MockBean private RocketChatClientImpl rocketChatClient;

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
    var authInfo = new AuthInfo("userId", "authToken");
    var sellerAuthInfo = new AuthInfo("sellerId", "sellerAuthToken");
    when(companyRepository.findByApiId(testCompanyRef())).thenReturn(Optional.of(company));
    when(companyRepository.existsByCompanyIpMarketplaceActivityTypeAndApiIdIn(
            CompanyIPMarketplaceType.ENTERPRISE_SELLER, Set.of(testCompanyRef())))
        .thenReturn(true);
    when(ipMarketplaceRepository.findByApiId(IpMarketplaceRef.of("iPMarketplaceId")))
        .thenReturn(Optional.of(ipMarketplace));
    when(personRepository.findByEmail(PersonRef.of(sellerEmail)))
        .thenReturn(Optional.of(sellerPerson));
    when(rocketChatClient.login(any(PersonRef.class), any(String.class)))
        .thenReturn(Optional.of(authInfo));
    when(rocketChatClient.createRoom(
            any(AuthInfo.class), ArgumentMatchers.<PersonRef>anyList(), any(String.class)))
        .thenReturn(Optional.of("roomId"));
    when(rocketChatClient.logout(any(AuthInfo.class))).thenReturn(Optional.of(true));
    when(rocketChatClient.createAuthUserToken(
            eq(authInfo), eq(PersonRef.of(sellerEmail.replace('@', '.')))))
        .thenReturn(Optional.of(sellerAuthInfo));
    doCallRealMethod()
        .when(rocketChatClient)
        .withLogin(any(PersonRef.class), any(String.class), any(Consumer.class));
    testIpMarketplaceTrack(ipMarketplace, buyerPerson);
    var ipMarketPlaceTrack =
        ipMarketplace.getIpMarketplaceTracks().stream()
            .findFirst()
            .orElseThrow(IpMarketplaceTrackNotFoundException::new);
    ipMarketPlaceTrack.setApiId(IpMarketplaceTrackRef.of("iPMarketplaceTrackId"));
    ipMarketPlaceTrack.setRoomId(null);
    when(ipMarketplaceTrackRepository.findByApiId(IpMarketplaceTrackRef.of("iPMarketplaceTrackId")))
        .thenReturn(ipMarketplace.getIpMarketplaceTracks().stream().findFirst());
    mockMvc
        .perform(
            put(
                    "/me/v2/ip-marketplace/{ipMarketplaceId}/contact-info/{ipMarketplaceTrackId}",
                    "iPMarketplaceId",
                    "iPMarketplaceTrackId")
                .contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.date", notNullValue()))
        .andDo(
            document(
                "process-contact-info-release",
                responseFields(dateField(), ipMarketplaceTrackApiField(), chatRoomIdField())));
    verify(rocketChatClient)
        .createRoom(any(AuthInfo.class), ArgumentMatchers.<PersonRef>anyList(), any(String.class));

    verifyNoInteractions(emailSender);
  }

  @Test
  @WithRedesignUser(
      role = RoleAuthority.ROLE_OP_CO_USER,
      email = "buyer@buyer.com",
      memberOf = "buyerCompany")
  public void testProcessInfo_for_Seller_Should_Fail_If_Not_A_Seller() throws Exception {
    mockMvc
        .perform(
            put(
                    "/me/v2/ip-marketplace/{ipMarketplaceId}/contact-info/{ipMarketplaceTrackId}",
                    "iPMarketplaceId",
                    "iPMarketplaceTrackId")
                .contentType(MediaType.APPLICATION_JSON)
                .header("RH-Google-Access-Token", "Google_Token")
                .header("Authorization", "Auth authId"))
        .andExpect(status().isForbidden())
        .andExpect(
            jsonPath("$.message", is("Only Seller can release contact info action in V2 api")));
  }

  @Test
  @WithRedesignUser(
      role = RoleAuthority.ROLE_OP_CO_USER,
      email = "seller@seller.com",
      memberOf = "1KlMnh9a")
  public void testProcessInfo_for_Seller_Should_Not_Call_To_Rocket_Chat_Client_If_Room_Was_Created()
      throws Exception {
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
    var authInfo = new AuthInfo("userId", "authToken");
    when(companyRepository.findByApiId(testCompanyRef())).thenReturn(Optional.of(company));
    when(companyRepository.existsByCompanyIpMarketplaceActivityTypeAndApiIdIn(
            CompanyIPMarketplaceType.ENTERPRISE_SELLER, Set.of(testCompanyRef())))
        .thenReturn(true);
    when(ipMarketplaceRepository.findByApiId(IpMarketplaceRef.of("iPMarketplaceId")))
        .thenReturn(Optional.of(ipMarketplace));
    when(personRepository.findByEmail(PersonRef.of(sellerEmail)))
        .thenReturn(Optional.of(sellerPerson));
    testIpMarketplaceTrack(ipMarketplace, buyerPerson);
    var ipMarketPlaceTrack =
        ipMarketplace.getIpMarketplaceTracks().stream()
            .findFirst()
            .orElseThrow(IpMarketplaceTrackNotFoundException::new);
    ipMarketPlaceTrack.setApiId(IpMarketplaceTrackRef.of("iPMarketplaceTrackId"));
    ipMarketPlaceTrack.setDateReleasedSellerContactInfo(Instant.now());
    ipMarketPlaceTrack.setStatus(IpMarketplaceTrackContactInfo.RELEASED_CONTACT_INFO);
    when(ipMarketplaceTrackRepository.findByApiId(IpMarketplaceTrackRef.of("iPMarketplaceTrackId")))
        .thenReturn(ipMarketplace.getIpMarketplaceTracks().stream().findFirst());
    mockMvc
        .perform(
            put(
                    "/me/v2/ip-marketplace/{ipMarketplaceId}/contact-info/{ipMarketplaceTrackId}",
                    "iPMarketplaceId",
                    "iPMarketplaceTrackId")
                .contentType(MediaType.APPLICATION_JSON)
                .header("RH-Google-Access-Token", "Google_Token")
                .header("Authorization", "Auth authId"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.date", notNullValue()))
        .andExpect(jsonPath("$.ipMarketplaceTrackApi", notNullValue()))
        .andExpect(jsonPath("$.chatRoomId", notNullValue()));
    verifyNoInteractions(rocketChatClient);
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
        .perform(post("/me/v2/ip-marketplace/{ipMarketplaceId}/contact-info", "iPMarketplaceId"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.date", notNullValue()))
        .andDo(
            document(
                "process-contact-info-request",
                responseFields(dateField(), ipMarketplaceTrackApiField())));
    verify(emailSender)
        .sendBuyerRequestChat(any(IpMarketplaceBuyerRequestContactInfoCommand.class));
    verifyNoInteractions(rocketChatClient);
  }

  @Test
  @WithRedesignUser(
      role = RoleAuthority.ROLE_OP_CO_USER,
      email = "seller@seller.com",
      memberOf = "sellerCompany")
  public void testProcessInfo_for_Buyer_Should_Fail_If_Not_A_Buyer() throws Exception {
    mockMvc
        .perform(post("/me/v2/ip-marketplace/{ipMarketplaceId}/contact-info", "iPMarketplaceId"))
        .andExpect(status().isForbidden())
        .andExpect(jsonPath("$.message", is("Only Buyer can request contact info V2 API")));
  }

  private FieldDescriptor dateField() {
    return fieldWithPath("date")
        .description(
            "When the contact info was requested or released, depending on who is using the endpoint (SELLER or BUYER)");
  }

  private FieldDescriptor ipMarketplaceTrackApiField() {
    return fieldWithPath("ipMarketplaceTrackApi").description("id for the request contact info");
  }

  private FieldDescriptor chatRoomIdField() {
    return fieldWithPath("chatRoomId").description("identifier fo chat room");
  }
}
