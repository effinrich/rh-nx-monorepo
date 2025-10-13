package com.redesignhealth.company.api.service;

import static com.redesignhealth.company.api.client.search.command.SearchIndex.IP_MARKETPLACE;
import static com.redesignhealth.company.api.client.search.entity.IpMarketplaceSearchDoc.DISEASE;
import static com.redesignhealth.company.api.client.search.entity.IpMarketplaceSearchDoc.EXECUTIVE_SUMMARY;
import static com.redesignhealth.company.api.client.search.entity.IpMarketplaceSearchDoc.NAME;
import static com.redesignhealth.company.api.client.search.entity.IpMarketplaceSearchDoc.ORGANIZATION_TYPE;
import static com.redesignhealth.company.api.client.search.entity.IpMarketplaceSearchDoc.ORGAN_OF_FOCUS;
import static com.redesignhealth.company.api.client.search.entity.IpMarketplaceSearchDoc.REGION;
import static com.redesignhealth.company.api.client.search.entity.IpMarketplaceSearchDoc.SPECIALITIES;
import static com.redesignhealth.company.api.client.search.entity.IpMarketplaceSearchDoc.STATUS;
import static com.redesignhealth.company.api.client.search.entity.IpMarketplaceSearchDoc.TECHNOLOGY_TYPE;
import static com.redesignhealth.company.api.client.search.utils.Sanitizer.sanitizeFilters;
import static com.redesignhealth.company.api.client.search.utils.Sanitizer.sanitizePageable;
import static com.redesignhealth.company.api.entity.request.RoleAuthority.ROLE_OP_CO_USER;
import static com.redesignhealth.company.api.entity.request.RoleAuthority.ROLE_RH_ADMIN;
import static com.redesignhealth.company.api.entity.request.RoleAuthority.ROLE_RH_USER;
import static com.redesignhealth.company.api.entity.request.RoleAuthority.ROLE_SUPER_ADMIN;
import static com.redesignhealth.company.api.expansion.Expansion.METRICS;
import static com.redesignhealth.company.api.expansion.Expansion.REQUESTS;
import static com.redesignhealth.company.api.util.RhCustomCounter.BUYER_VIEW_COUNTER;
import static com.redesignhealth.company.api.util.RhCustomCounter.LABEL_BUYER_VIEW_COUNTER;

import com.redesignhealth.company.api.client.email.EmailSender;
import com.redesignhealth.company.api.client.prometheus.PrometheusClient;
import com.redesignhealth.company.api.client.rocketchat.RocketChatClient;
import com.redesignhealth.company.api.client.search.SearchClient;
import com.redesignhealth.company.api.client.search.command.SearchCommand;
import com.redesignhealth.company.api.client.search.command.SearchDeleteDocCommand;
import com.redesignhealth.company.api.client.search.command.SearchField;
import com.redesignhealth.company.api.client.search.command.SearchIndexCommand;
import com.redesignhealth.company.api.client.search.entity.FilterOptions;
import com.redesignhealth.company.api.client.search.entity.IpMarketplaceSearchDoc;
import com.redesignhealth.company.api.client.search.entity.SearchResult;
import com.redesignhealth.company.api.client.search.utils.Sanitizer;
import com.redesignhealth.company.api.dto.IpMarketplaceContactInfoSummary;
import com.redesignhealth.company.api.dto.IpMarketplaceContactInfoV2Summary;
import com.redesignhealth.company.api.dto.IpMarketplaceMetrics;
import com.redesignhealth.company.api.dto.IpMarketplaceRequestContactInfo;
import com.redesignhealth.company.api.dto.IpMarketplaceSummary;
import com.redesignhealth.company.api.dto.command.ipMarketplace.IpMarketplaceBaseCommand;
import com.redesignhealth.company.api.dto.command.ipMarketplace.IpMarketplaceBuyerRequestContactInfoCommand;
import com.redesignhealth.company.api.dto.command.ipMarketplace.IpMarketplaceContactInfoCommand;
import com.redesignhealth.company.api.dto.command.ipMarketplace.IpMarketplaceCreateCommand;
import com.redesignhealth.company.api.dto.command.ipMarketplace.IpMarketplaceSellerReleaseContactInfoCommand;
import com.redesignhealth.company.api.dto.enums.CommunicationChannel;
import com.redesignhealth.company.api.dto.enums.CompanyIPMarketplaceOrganizationType;
import com.redesignhealth.company.api.dto.enums.CompanyIPMarketplaceRegion;
import com.redesignhealth.company.api.dto.enums.CompanyIPMarketplaceType;
import com.redesignhealth.company.api.dto.enums.CompanyMemberStatus;
import com.redesignhealth.company.api.dto.enums.CompanyStatus;
import com.redesignhealth.company.api.dto.enums.IpMarketplaceOrganOfFocus;
import com.redesignhealth.company.api.dto.enums.IpMarketplacePatentGeographyValidity;
import com.redesignhealth.company.api.dto.enums.IpMarketplacePatentStatus;
import com.redesignhealth.company.api.dto.enums.IpMarketplacePreferredTerms;
import com.redesignhealth.company.api.dto.enums.IpMarketplaceSpeciality;
import com.redesignhealth.company.api.dto.enums.IpMarketplaceStatus;
import com.redesignhealth.company.api.dto.enums.IpMarketplaceTechnologyType;
import com.redesignhealth.company.api.dto.enums.IpMarketplaceTrackContactInfo;
import com.redesignhealth.company.api.dto.prometheus.PrometheusResult;
import com.redesignhealth.company.api.entity.Company;
import com.redesignhealth.company.api.entity.CompanyMember;
import com.redesignhealth.company.api.entity.IpMarketplace;
import com.redesignhealth.company.api.entity.IpMarketplaceSeller;
import com.redesignhealth.company.api.entity.IpMarketplaceTrack;
import com.redesignhealth.company.api.entity.Person;
import com.redesignhealth.company.api.entity.ref.CompanyRef;
import com.redesignhealth.company.api.entity.ref.IpMarketplaceRef;
import com.redesignhealth.company.api.entity.ref.IpMarketplaceTrackRef;
import com.redesignhealth.company.api.entity.ref.PersonRef;
import com.redesignhealth.company.api.exception.CompanyMemberNotFoundException;
import com.redesignhealth.company.api.exception.CompanyNotFoundException;
import com.redesignhealth.company.api.exception.ForbiddenIpMarketplaceException;
import com.redesignhealth.company.api.exception.ForbiddenIpMarketplaceTrackException;
import com.redesignhealth.company.api.exception.InvalidFieldException;
import com.redesignhealth.company.api.exception.IpMarketplaceNotFoundException;
import com.redesignhealth.company.api.exception.IpMarketplaceTrackNotFoundException;
import com.redesignhealth.company.api.exception.PersonNotFoundException;
import com.redesignhealth.company.api.exception.dto.FieldErrorDetails;
import com.redesignhealth.company.api.exception.dto.FieldErrorType;
import com.redesignhealth.company.api.expansion.Expansion;
import com.redesignhealth.company.api.property.IpMarketplaceConverter;
import com.redesignhealth.company.api.repository.CompanyRepository;
import com.redesignhealth.company.api.repository.IpMarketplaceRepository;
import com.redesignhealth.company.api.repository.IpMarketplaceTrackRepository;
import com.redesignhealth.company.api.repository.PersonRepository;
import com.redesignhealth.company.api.security.AuthChecks;
import com.redesignhealth.company.api.security.RedesignUserDetails;
import com.redesignhealth.company.api.service.dto.ChatRoomParameter;
import com.redesignhealth.company.api.service.helper.BuilderForException;
import com.redesignhealth.company.api.service.helper.Filter;
import com.redesignhealth.company.api.service.helper.RefGenerator;
import com.redesignhealth.company.api.util.RhCustomCounter;
import jakarta.annotation.Nullable;
import jakarta.transaction.Transactional;
import java.net.URI;
import java.time.Instant;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Random;
import java.util.Set;
import java.util.concurrent.atomic.AtomicLong;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.Hibernate;
import org.hibernate.exception.ConstraintViolationException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.thymeleaf.util.StringUtils;

@org.springframework.stereotype.Service
@Slf4j
public class IpMarketplaceService {
  private final IpMarketplaceRepository ipMarketplaceRepository;
  private final CompanyRepository companyRepository;
  private final PersonRepository personRepository;
  private final IpMarketplaceTrackRepository ipMarketplaceTrackRepository;
  private final SearchClient searchClient;
  private final IpMarketplaceConverter ipMarketplaceConverter;
  public static final List<SearchField> FIELDS_TO_SEARCH =
      List.of(
          SearchField.of(NAME, 2),
          SearchField.of(EXECUTIVE_SUMMARY, 2),
          SearchField.of(DISEASE, 2));
  public static final List<String> VALID_SEARCH_FILTERS =
      List.of(ORGANIZATION_TYPE, REGION, SPECIALITIES, TECHNOLOGY_TYPE, ORGAN_OF_FOCUS, STATUS);
  private final EmailSender emailSender;
  private final PrometheusClient prometheusClient;
  private final RocketChatClient rocketChatClient;

  private final Set<String> existingBuyerViews;

  private final URI portalHostname;
  private final Random rand;
  private final String rocketChatUserNotification;

  private final String rocketChatPasswordNotification;

  public IpMarketplaceService(
      IpMarketplaceRepository ipMarketplaceRepository,
      CompanyRepository companyRepository,
      PersonRepository personRepository,
      SearchClient searchClient,
      IpMarketplaceConverter ipMarketplaceConverter,
      IpMarketplaceTrackRepository ipMarketplaceTrackRepository,
      EmailSender emailSender,
      PrometheusClient prometheusClient,
      @Value("${notification.portal.hostname}") URI portalHostname,
      RocketChatClient rocketChatClient,
      @Value("${rocket-chat-service.notifications.username}") String rocketChatUserNotification,
      @Value("${rocket-chat-service.notifications.password}")
          String rocketChatPasswordNotification) {
    this.ipMarketplaceRepository = ipMarketplaceRepository;
    this.companyRepository = companyRepository;
    this.personRepository = personRepository;
    this.searchClient = searchClient;
    this.ipMarketplaceConverter = ipMarketplaceConverter;
    this.ipMarketplaceTrackRepository = ipMarketplaceTrackRepository;
    this.emailSender = emailSender;
    this.prometheusClient = prometheusClient;
    this.rocketChatClient = rocketChatClient;
    this.existingBuyerViews = new HashSet<>();
    setExistingBuyerViews(this.existingBuyerViews);
    this.portalHostname = portalHostname;
    rand = new Random();
    this.rocketChatUserNotification = rocketChatUserNotification;
    this.rocketChatPasswordNotification = rocketChatPasswordNotification;
  }

  public IpMarketplaceSummary create(IpMarketplaceCreateCommand command) {
    var companyRef = CompanyRef.of(command.getCompanyId());
    var company =
        companyRepository
            .findByApiId(companyRef)
            .orElseThrow(
                () ->
                    new InvalidFieldException(
                        FieldErrorDetails.builder()
                            .name("companyId")
                            .rejectedValue(Objects.toString(companyRef.getApiId()))
                            .type(FieldErrorType.EXISTS)
                            .build()));
    if (!isAnIpMarketPlaceCompanySeller(company))
      BuilderForException.buildInvalidFieldException(
          "companyId", command.getCompanyId(), "Company should be a IP Marketplace Company Seller");
    var requester = AuthChecks.getPrincipal();
    var isASeller = isASeller(requester);
    var isABuyer = isABuyer(requester);
    var isAnOpCoUser = AuthChecks.hasRole(ROLE_OP_CO_USER);
    if ((isAnOpCoUser && isABuyer) || AuthChecks.hasRole(ROLE_RH_USER))
      throw new ForbiddenIpMarketplaceException(
          "Buyers or RH users can't create IP records for the marketplace");

    if (isAnOpCoUser && isASeller && !requester.getUsername().equals(command.getEmail())) {
      BuilderForException.buildInvalidFieldException(
          "email",
          command.getEmail(),
          "Email should be equals to the seller trying to create the IP Record");
    }

    var person = getSeller(command.getEmail(), company);
    validateInputRestrictions(command);
    var ipMarketplaceRef = RefGenerator.of(ipMarketplaceRepository, IpMarketplaceRef.class);
    var ipMarketplace = new IpMarketplace();
    ipMarketplace.setApiId(ipMarketplaceRef);
    ipMarketplace.setCompanyIpMarketplace(company.getCompanyIpMarketplace());
    var ipMarketPlaceSeller = new IpMarketplaceSeller();
    ipMarketPlaceSeller.setIpMarketplace(ipMarketplace);
    ipMarketPlaceSeller.setSeller(person);
    ipMarketplace.setIpMarketplaceSeller(ipMarketPlaceSeller);
    setIpMarketPlace(ipMarketplace, command);
    ipMarketplaceRepository.save(ipMarketplace);
    upsertOS(ipMarketplace);
    return IpMarketplaceSummary.from(ipMarketplace);
  }

  public IpMarketplaceSummary update(IpMarketplaceRef apiId, IpMarketplaceBaseCommand command) {
    var ipMarketplace =
        ipMarketplaceRepository.findByApiId(apiId).orElseThrow(IpMarketplaceNotFoundException::new);
    var requester = AuthChecks.getPrincipal();
    var isASeller = isASeller(requester);
    var isABuyer = isABuyer(requester);
    var isAnOpCoUser = AuthChecks.hasRole(ROLE_OP_CO_USER);
    if ((isAnOpCoUser && isABuyer) || AuthChecks.hasRole(ROLE_RH_USER))
      throw new ForbiddenIpMarketplaceException(
          "Buyers or RH users can't update IP records for the marketplace");
    if (isAnOpCoUser
        && isASeller
        && !ipMarketplace
            .getIpMarketplaceSeller()
            .getSeller()
            .getEmail()
            .equals(PersonRef.of(requester.getUsername()))) {
      throw new ForbiddenIpMarketplaceException("Only owners of the IP record can edit it.");
    }
    validateInputRestrictions(command);
    var person =
        getSeller(command.getEmail(), ipMarketplace.getCompanyIpMarketplace().getCompany());
    ipMarketplace.getIpMarketplaceSeller().setSeller(person);
    setIpMarketPlace(ipMarketplace, command);
    ipMarketplaceRepository.save(ipMarketplace);
    upsertOS(ipMarketplace);
    return IpMarketplaceSummary.from(ipMarketplace);
  }

  @Transactional
  public Page<IpMarketplaceSummary> query(
      @Nullable String q,
      List<String> queryParamFilters,
      Pageable pageable,
      List<Expansion> expansions) {
    var requester = AuthChecks.getPrincipal();
    var isASeller = isASeller(requester);
    var isABuyer = isABuyer(requester);
    validationExpand(isASeller, isABuyer, expansions);
    if (isASeller) {
      var company =
          requester.getMemberOf().stream()
              .map(x -> companyRepository.findByApiId(x).orElseThrow(CompanyNotFoundException::new))
              .toList()
              .get(0);
      var filterString = String.format("companyId,%s", company.getApiId().value());
      queryParamFilters.add(filterString);
    } else if ((AuthChecks.hasRole(ROLE_OP_CO_USER) && !isABuyer)
        || AuthChecks.hasRole(ROLE_RH_USER))
      throw new ForbiddenIpMarketplaceException(
          "Only members from ENTERPRISE_SELLER and ENTERPRISE_BUYER companies can query the IP Marketplace info");

    var sanitizedPageable = sanitizePageable(pageable, ipMarketplaceConverter);
    var sanitizedFilters = sanitizeFilters(queryParamFilters, ipMarketplaceConverter);
    var command =
        SearchCommand.builder()
            .index(IP_MARKETPLACE)
            .fields(FIELDS_TO_SEARCH)
            .query(q)
            .filters(sanitizedFilters)
            .searchAsYouType(true)
            .build();
    var results = searchClient.search(command, sanitizedPageable, IpMarketplaceSearchDoc.class);
    return new PageImpl<>(
        transformResults(results.getContent(), expansions, requester, isASeller, isABuyer),
        results.getPageable(),
        results.getTotalElements());
  }

  @Transactional
  public IpMarketplaceSummary get(IpMarketplaceRef apiId, List<Expansion> expansions) {
    var requester = AuthChecks.getPrincipal();
    var isASeller = isASeller(requester);
    var isABuyer = isABuyer(requester);
    if ((AuthChecks.hasRole(ROLE_OP_CO_USER) && !isABuyer && !isASeller)
        || AuthChecks.hasRole(ROLE_RH_USER))
      throw new ForbiddenIpMarketplaceException(
          "Only members from ENTERPRISE_SELLER and ENTERPRISE_BUYER companies can query the IP Marketplace info");

    validationExpand(isASeller, isABuyer, expansions);
    var ipMarketplace =
        ipMarketplaceRepository.findByApiId(apiId).orElseThrow(IpMarketplaceNotFoundException::new);
    if (AuthChecks.hasRole(ROLE_OP_CO_USER) && isABuyer(requester))
      RhCustomCounter.increment(requester.getUsername(), apiId.value(), existingBuyerViews);
    if (expansions.isEmpty()) {
      return IpMarketplaceSummary.from(ipMarketplace, isABuyer);
    } else {
      Hibernate.initialize(ipMarketplace.getIpMarketplaceTracks());
      IpMarketplaceMetrics ipMarketplaceMetrics = null;
      if (expansions.contains(METRICS)) {
        var requestCount = ipMarketplace.getIpMarketplaceTracks().size();
        var viewCount = countIpMarketPlaceIdView(apiId);
        ipMarketplaceMetrics = new IpMarketplaceMetrics(viewCount, requestCount);
      }
      List<IpMarketplaceRequestContactInfo> ipMarketplaceRequestContactInfos;
      if (expansions.contains(REQUESTS)) {
        var email = PersonRef.of(requester.getUsername());
        ipMarketplaceRequestContactInfos = new ArrayList<>();
        hydrateIpMarketplaceRequests(
            ipMarketplaceRequestContactInfos, email, ipMarketplace, isABuyer);
      } else {
        ipMarketplaceRequestContactInfos = null;
      }
      return IpMarketplaceSummary.from(
          ipMarketplace, ipMarketplaceMetrics, ipMarketplaceRequestContactInfos, isABuyer);
    }
  }

  @Transactional
  public IpMarketplaceContactInfoSummary processContactInfo(
      IpMarketplaceContactInfoCommand command, IpMarketplaceRef apiId) {
    var requester = AuthChecks.getPrincipal();

    if (isASeller(requester)) {
      return handleSellerRelease(
          command,
          apiId,
          requester.getUsername(),
          CommunicationChannel.EMAIL,
          ChatRoomParameter.of());
    } else if (isABuyer(requester)) {
      return handleBuyerRequest(apiId, requester.getUsername(), CommunicationChannel.EMAIL);
    } else
      throw new ForbiddenIpMarketplaceTrackException(
          "Only Seller and Buyer can request contact info actions");
  }

  @Transactional
  public IpMarketplaceContactInfoV2Summary createChatRoom(
      IpMarketplaceRef apiId, IpMarketplaceTrackRef ipMarketplaceTrackRef) {
    var requester = AuthChecks.getPrincipal();
    if (!isASeller(requester))
      throw new ForbiddenIpMarketplaceTrackException(
          "Only Seller can release contact info action in V2 api");
    var ipMarketplaceTrack =
        ipMarketplaceTrackRepository
            .findByApiId(ipMarketplaceTrackRef)
            .orElseThrow(IpMarketplaceTrackNotFoundException::new);
    if (!ipMarketplaceTrack.getIpMarketplace().getApiId().equals(apiId))
      throw new ForbiddenIpMarketplaceTrackException(
          "This request for contact info doesn't belong to this IP marketplace");
    if (ipMarketplaceTrack.getRoomId() != null)
      return new IpMarketplaceContactInfoV2Summary(
          ipMarketplaceTrack.getApiId(),
          ipMarketplaceTrack.getRoomId(),
          ipMarketplaceTrack.getDateReleasedSellerContactInfo());
    var command = IpMarketplaceContactInfoCommand.of(ipMarketplaceTrack.getBuyer().getEmail());
    // roomName could not contain spaces or special characters
    var roomName =
        String.format(
            "%s%d",
            Sanitizer.sanitizeNameAsAlphaNumeric(ipMarketplaceTrack.getIpMarketplace().getName()),
            rand.nextInt(Integer.MAX_VALUE));
    var chatRoomParameter =
        ChatRoomParameter.of(
            ipMarketplaceTrack,
            this.rocketChatUserNotification,
            this.rocketChatPasswordNotification,
            roomName);
    return (IpMarketplaceContactInfoV2Summary)
        handleSellerRelease(
            command, apiId, requester.getUsername(), CommunicationChannel.CHAT, chatRoomParameter);
  }

  public IpMarketplaceContactInfoV2Summary requestChatRoom(IpMarketplaceRef ipMarketplaceRef) {
    var requester = AuthChecks.getPrincipal();
    if (!isABuyer(requester))
      throw new ForbiddenIpMarketplaceTrackException("Only Buyer can request contact info V2 API");
    return (IpMarketplaceContactInfoV2Summary)
        handleBuyerRequest(ipMarketplaceRef, requester.getUsername(), CommunicationChannel.CHAT);
  }

  public List<FilterOptions> getFilters() {
    var filterOptions =
        Filter.fromOS(IP_MARKETPLACE, VALID_SEARCH_FILTERS, searchClient, ipMarketplaceConverter);
    updateTermDisplayName(filterOptions, ipMarketplaceConverter.getApiToSearch());
    return filterOptions;
  }

  public void delete(IpMarketplaceRef apiId) {
    var ipMarketplace =
        ipMarketplaceRepository.findByApiId(apiId).orElseThrow(IpMarketplaceNotFoundException::new);
    searchClient.delete(
        SearchDeleteDocCommand.builder().documentId(apiId.value()).index(IP_MARKETPLACE).build());
    ipMarketplaceRepository.delete(ipMarketplace);
    ;
  }

  private IpMarketplaceContactInfoSummary handleSellerRelease(
      IpMarketplaceContactInfoCommand command,
      IpMarketplaceRef apiId,
      String emailRequester,
      CommunicationChannel communicationChannel,
      ChatRoomParameter chatRoomParameter) {
    if (command.getBuyerEmail() == null
        || command.getBuyerEmail().isEmpty()
        || StringUtils.isEmpty(command.getBuyerEmail().get().getEmail()))
      BuilderForException.buildInvalidFieldException(
          "buyerEmail",
          "",
          "The field is required with some value when is a Seller trying release contact info");
    var ipMarketPlace =
        ipMarketplaceRepository.findByApiId(apiId).orElseThrow(IpMarketplaceNotFoundException::new);
    var ipMarketplaceTrack = chatRoomParameter.getIpMarketplaceTrack();
    if (ipMarketplaceTrack == null) {
      Hibernate.initialize(ipMarketPlace.getIpMarketplaceTracks());
      ipMarketplaceTrack =
          ipMarketPlace.getIpMarketplaceTracks().stream()
              .filter(
                  x ->
                      x.getBuyer().getEmail().value().equals(command.getBuyerEmail().get().value()))
              .findFirst()
              .orElseThrow(
                  () ->
                      new InvalidFieldException(
                          FieldErrorDetails.builder()
                              .name("email")
                              .rejectedValue(command.getBuyerEmail().get())
                              .type(FieldErrorType.EXISTS)
                              .build()));
    }
    if (ipMarketplaceTrack.getStatus().equals(IpMarketplaceTrackContactInfo.RELEASED_CONTACT_INFO))
      throw new ForbiddenIpMarketplaceTrackException(
          "The contact information was released for this IP record and this buyer");
    var seller =
        personRepository
            .findByEmail(PersonRef.of(emailRequester))
            .orElseThrow(PersonNotFoundException::new);
    if (!ipMarketPlace.getIpMarketplaceSeller().getSeller().equals(seller))
      throw new ForbiddenIpMarketplaceTrackException(
          "The requester only can release the contact info for its own IP records");
    ipMarketplaceTrack.setStatus(IpMarketplaceTrackContactInfo.RELEASED_CONTACT_INFO);
    ipMarketplaceTrack.setDateReleasedSellerContactInfo(Instant.now());
    if (communicationChannel == CommunicationChannel.CHAT) {
      createChatRoom(
          command.getBuyerEmail().orElse(PersonRef.of("")),
          chatRoomParameter,
          PersonRef.of(emailRequester.replace('@', '.')));
    }
    ipMarketplaceTrackRepository.save(ipMarketplaceTrack);
    if (communicationChannel == CommunicationChannel.EMAIL) {
      var ipMarketplaceSellerReleaseContactInfo =
          IpMarketplaceSellerReleaseContactInfoCommand.from(
              ipMarketplaceTrack.getIpMarketplace(),
              ipMarketplaceTrack.getBuyer(),
              this.portalHostname);
      emailSender.sendSellerReleaseContactInfo(ipMarketplaceSellerReleaseContactInfo);
    }
    return (communicationChannel.equals(CommunicationChannel.EMAIL))
        ? new IpMarketplaceContactInfoSummary(ipMarketplaceTrack.getDateReleasedSellerContactInfo())
        : new IpMarketplaceContactInfoV2Summary(
            ipMarketplaceTrack.getApiId(),
            ipMarketplaceTrack.getRoomId(),
            ipMarketplaceTrack.getDateReleasedSellerContactInfo());
  }

  private IpMarketplaceContactInfoSummary handleBuyerRequest(
      IpMarketplaceRef apiId, String emailRequester, CommunicationChannel communicationChannel) {
    var buyer =
        personRepository
            .findByEmail(PersonRef.of(emailRequester))
            .orElseThrow(PersonNotFoundException::new);
    var ipMarketPlace =
        ipMarketplaceRepository.findByApiId(apiId).orElseThrow(IpMarketplaceNotFoundException::new);
    var ipMarketplaceTrack = new IpMarketplaceTrack();
    var ipMarketplaceTrackRef =
        RefGenerator.of(ipMarketplaceTrackRepository, IpMarketplaceTrackRef.class);
    ipMarketplaceTrack.setApiId(ipMarketplaceTrackRef);
    ipMarketplaceTrack.setIpMarketplace(ipMarketPlace);
    ipMarketplaceTrack.setBuyer(buyer);
    var buyerCompanyIpMarketPlace =
        buyer.getMemberOf().stream()
            .filter(x -> x.getStatus().equals(CompanyMemberStatus.ACTIVE))
            .findFirst()
            .orElseThrow(CompanyNotFoundException::new)
            .getCompany()
            .getCompanyIpMarketplace();
    ipMarketplaceTrack.setBuyerCompanyIpMarketplace(buyerCompanyIpMarketPlace);
    ipMarketplaceTrack.setStatus(IpMarketplaceTrackContactInfo.REQUESTED_CONTACT_INFO);
    ipMarketplaceTrack.setDateRequested(Instant.now());
    try {
      ipMarketplaceTrackRepository.saveAndFlush(ipMarketplaceTrack);
      var buyerCompanyName =
          ipMarketplaceTrack.getBuyer().getMemberOf().stream()
              .findFirst()
              .orElseThrow(CompanyMemberNotFoundException::new)
              .getCompany()
              .getName();
      var seller = ipMarketPlace.getIpMarketplaceSeller().getSeller();
      var ipMarketplaceBuyerRequestContactInfoCommand =
          IpMarketplaceBuyerRequestContactInfoCommand.of(
              seller.getGivenName(),
              buyerCompanyName,
              ipMarketPlace.getName(),
              seller.getEmail().getEmail(),
              this.portalHostname);
      if (communicationChannel.equals(CommunicationChannel.EMAIL))
        emailSender.sendBuyerRequestContactInfo(ipMarketplaceBuyerRequestContactInfoCommand);
      else emailSender.sendBuyerRequestChat(ipMarketplaceBuyerRequestContactInfoCommand);
    } catch (DataIntegrityViolationException e) {
      if (e.getCause() instanceof ConstraintViolationException) {
        throw new ForbiddenIpMarketplaceTrackException(
            "Buyer requested the contact info for this IP record in a previous time, only can do it once time.");
      }
      throw e;
    }
    return (communicationChannel.equals(CommunicationChannel.EMAIL))
        ? new IpMarketplaceContactInfoSummary(ipMarketplaceTrack.getDateRequested())
        : new IpMarketplaceContactInfoV2Summary(
            ipMarketplaceTrack.getApiId(), null, ipMarketplaceTrack.getDateRequested());
  }

  private boolean isAnIpMarketPlaceCompanySeller(Company company) {
    Hibernate.initialize(company.getCompanyIpMarketplace());
    return company.getCompanyIpMarketplace() != null
        && company
            .getCompanyIpMarketplace()
            .getActivityType()
            .equals(CompanyIPMarketplaceType.ENTERPRISE_SELLER);
  }

  private void validateCompanyMemberStatus(
      CompanyMember companyMember, PersonRef personRef, CompanyRef companyRef) {
    if (!companyMember.getStatus().equals(CompanyMemberStatus.ACTIVE))
      BuilderForException.buildInvalidFieldException(
          "email", personRef.value(), "Member should be active");
    if (!companyMember.getCompany().getStatus().equals(CompanyStatus.ACTIVE))
      BuilderForException.buildInvalidFieldException(
          "companyId", companyRef.getApiId(), "Company should be active");
  }

  private void validateInputRestrictions(IpMarketplaceBaseCommand command) {
    List<FieldErrorDetails> errors = new ArrayList<>();
    if (command.getLicenseRestriction() != null
        && !command.getLicenseRestriction()
        && command.getAboutLicenseRestriction() != null)
      errors.add(
          BuilderForException.buildError(
              "aboutLicenseRestriction",
              command.getAboutLicenseRestriction(),
              "About restriction is only filled when License restriction is true"));
    if (command.getLicenseRestriction() == null && command.getAboutLicenseRestriction() != null)
      errors.add(
          BuilderForException.buildError(
              "aboutLicenseRestriction",
              command.getAboutLicenseRestriction(),
              "About restriction is only filled when License restriction is sent and its value is true"));
    if (command.getPatentStatus() != null
        && !command.getPatentStatus().equals(IpMarketplacePatentStatus.OTHER)
        && command.getPatentStatusOtherInfo() != null)
      errors.add(
          BuilderForException.buildError(
              "patentStatusOtherInfo",
              command.getPatentStatusOtherInfo(),
              "Patent Status Other Info only filled when the Patent Status is OTHER"));
    if (command.getPatentStatus() == null && command.getPatentStatusOtherInfo() != null)
      errors.add(
          BuilderForException.buildError(
              "patentStatusOtherInfo",
              command.getPatentStatusOtherInfo(),
              "Patent Status Other Info only filled when the Patent Status is sent and its value is OTHER"));
    if (command.getPatentGeographicValidity() != null
        && !command
            .getPatentGeographicValidity()
            .contains(IpMarketplacePatentGeographyValidity.OTHER)
        && command.getPatentGeographicValidityOther() != null)
      errors.add(
          BuilderForException.buildError(
              "patentGeographicValidityOther",
              command.getPatentGeographicValidityOther(),
              "Patent Geographic Validity Other only filled when the Patent Geographic Validity contains in its values OTHER"));
    if (command.getPreferredTerms() != null
        && !command.getPreferredTerms().contains(IpMarketplacePreferredTerms.OTHER)
        && command.getPreferredTermsOther() != null)
      errors.add(
          BuilderForException.buildError(
              "preferredTermsOther",
              command.getPreferredTermsOther(),
              "Preferred Terms Other only filled when the Preferred Terms contains in its values OTHER"));
    if (!errors.isEmpty()) throw new InvalidFieldException(errors);
  }

  private void setIpMarketPlace(IpMarketplace ipMarketplace, IpMarketplaceBaseCommand command) {
    ipMarketplace.setName(command.getName());
    ipMarketplace.setExecutiveSummary(command.getExecutiveSummary());
    ipMarketplace.setTherapeuticNeedOrTrendsBeingAddressed(
        command.getTherapeuticNeedOrTrendsBeingAddressed());
    ipMarketplace.setTechnologyOverview(command.getTechnologyOverview());
    ipMarketplace.setLicenseRestriction(command.getLicenseRestriction());
    ipMarketplace.setAboutLicenseRestriction(command.getAboutLicenseRestriction());
    ipMarketplace.setPreferredTerms(command.getPreferredTerms());
    ipMarketplace.setAssociatedFilesOrMedia(command.getAssociatedFilesOrMedia());
    ipMarketplace.setPatentStatus(command.getPatentStatus());
    ipMarketplace.setPatentStatusOtherInfo(command.getPatentStatusOtherInfo());
    ipMarketplace.setPatentIssueDate(command.getPatentIssueDate());
    ipMarketplace.setPatentGeographicValidity(command.getPatentGeographicValidity());
    ipMarketplace.setPatentGeographicValidityOther(command.getPatentGeographicValidityOther());
    ipMarketplace.setDisease(command.getDisease());
    ipMarketplace.setOrganOfFocus(command.getOrganOfFocus());
    ipMarketplace.setSpeciality(command.getSpeciality());
    ipMarketplace.setTechnologyType(command.getTechnologyType());
    ipMarketplace.setSellerSummaryTechTransferApproach(
        command.getSellerSummaryTechTransferApproach());
    ipMarketplace.setResponsibleInventor(command.getResponsibleInventor());
    ipMarketplace.setPatentStatusHref(command.getPatentStatusHref());
    ipMarketplace.setTechnologyLevelOfMaturity(command.getTechnologyLevelOfMaturity());
    ipMarketplace.setFreedomToOperateCertification(command.getFreedomToOperateCertification());
    ipMarketplace.setCopyrighted(command.isCopyrighted());
    ipMarketplace.setLegalPatentabilityAssessmentAvailable(
        command.isLegalPatentabilityAssessmentAvailable());
    ipMarketplace.setPreferredTermsOther(command.getPreferredTermsOther());
    ipMarketplace.setStatus(
        (command.getStatus() == null) ? IpMarketplaceStatus.ACTIVE : command.getStatus());
  }

  private void upsertOS(IpMarketplace ipMarketplace) {
    var ipMarketplaceDoc = IpMarketplaceSearchDoc.from(ipMarketplace);
    searchClient.index(
        SearchIndexCommand.builder()
            .index(IP_MARKETPLACE)
            .document(ipMarketplaceDoc)
            .documentId(ipMarketplace.getApiId().value())
            .build());
  }

  private Person getSeller(String email, Company company) {
    var personRef = PersonRef.of(email);
    var person =
        personRepository
            .findByEmail(personRef, Expansion.MEMBER_OF)
            .orElseThrow(
                () ->
                    new InvalidFieldException(
                        FieldErrorDetails.builder()
                            .name("email")
                            .rejectedValue(Objects.toString(personRef.value()))
                            .type(FieldErrorType.EXISTS)
                            .build()));
    if (person.getMemberOf() != null) {
      var companyMember =
          person.getMemberOf().stream()
              .filter(x -> x.getCompany().equals(company))
              .findFirst()
              .orElseThrow(
                  () ->
                      new InvalidFieldException(
                          FieldErrorDetails.builder()
                              .name("email")
                              .rejectedValue(Objects.toString(personRef.value()))
                              .type("person doesn't belongs to the company")
                              .build()));
      validateCompanyMemberStatus(companyMember, personRef, company.getApiId());
    } else {
      BuilderForException.buildInvalidFieldException(
          "email", personRef.value(), "person doesn't belongs to the company");
    }
    return person;
  }

  private List<IpMarketplaceSummary> transformResults(
      List<SearchResult<IpMarketplaceSearchDoc>> searchResults,
      List<Expansion> expansions,
      RedesignUserDetails requester,
      boolean isASeller,
      boolean isABuyer) {
    return searchResults.stream()
        .map(
            ipMarketplaceSearchResult -> {
              var ipMarketplace =
                  ipMarketplaceRepository
                      .findByApiId(IpMarketplaceRef.of(ipMarketplaceSearchResult.getId()))
                      .orElseThrow(IpMarketplaceNotFoundException::new);
              if (expansions.isEmpty()) {
                return IpMarketplaceSummary.from(ipMarketplace, isABuyer);
              } else {
                Hibernate.initialize(ipMarketplace.getIpMarketplaceTracks());
                IpMarketplaceMetrics ipMarketplaceMetrics = null;
                var isAdmin =
                    AuthChecks.hasRole(ROLE_RH_ADMIN) || AuthChecks.hasRole(ROLE_SUPER_ADMIN);
                if ((isASeller || isAdmin) && expansions.contains(METRICS)) {
                  var requestCount = ipMarketplace.getIpMarketplaceTracks().size();
                  var viewCount = countIpMarketPlaceIdView(ipMarketplace.getApiId());
                  ipMarketplaceMetrics = new IpMarketplaceMetrics(viewCount, requestCount);
                }
                List<IpMarketplaceRequestContactInfo> ipMarketplaceRequestContactInfos;
                if ((isABuyer || isASeller) & expansions.contains(REQUESTS)) {
                  ipMarketplaceRequestContactInfos = new ArrayList<>();
                  var email = PersonRef.of(requester.getUsername());
                  hydrateIpMarketplaceRequests(
                      ipMarketplaceRequestContactInfos, email, ipMarketplace, isABuyer);
                } else {
                  ipMarketplaceRequestContactInfos = null;
                }
                var key =
                    RhCustomCounter.sanitizeEmail(requester.getUsername())
                        + "_"
                        + ipMarketplace.getApiId().getApiId();
                return IpMarketplaceSummary.from(
                    ipMarketplace,
                    ipMarketplaceMetrics,
                    ipMarketplaceRequestContactInfos,
                    isABuyer,
                    this.existingBuyerViews.contains(key));
              }
            })
        .toList();
  }

  private boolean isASeller(RedesignUserDetails requester) {
    return isASellerOrBuyer(requester, CompanyIPMarketplaceType.ENTERPRISE_SELLER);
  }

  private boolean isABuyer(RedesignUserDetails requester) {
    return isASellerOrBuyer(requester, CompanyIPMarketplaceType.ENTERPRISE_BUYER);
  }

  private boolean isASellerOrBuyer(
      RedesignUserDetails requester, CompanyIPMarketplaceType companyIPMarketplaceType) {
    return requester.getMemberOf() != null
        && companyRepository.existsByCompanyIpMarketplaceActivityTypeAndApiIdIn(
            companyIPMarketplaceType, requester.getMemberOf());
  }

  private void setExistingBuyerViews(Set<String> existingBuyerViews) {
    var suffix = "_total";
    var response = prometheusClient.getCounterValues(BUYER_VIEW_COUNTER + suffix);
    if (response != null)
      for (PrometheusResult prometheusResult : response.getData().getResult()) {
        existingBuyerViews.add(prometheusResult.getMetric().get(LABEL_BUYER_VIEW_COUNTER));
      }
  }

  private void updateTermDisplayName(
      List<FilterOptions> filterOptions, Map<String, String> apiToSearch) {
    for (FilterOptions filterOption : filterOptions) {
      switch (apiToSearch.get(filterOption.getField())) {
        case ORGANIZATION_TYPE -> filterOption.updateTermDisplayName(
            CompanyIPMarketplaceOrganizationType.values());
        case REGION -> filterOption.updateTermDisplayName(CompanyIPMarketplaceRegion.values());
        case SPECIALITIES -> filterOption.updateTermDisplayName(IpMarketplaceSpeciality.values());
        case TECHNOLOGY_TYPE -> filterOption.updateTermDisplayName(
            IpMarketplaceTechnologyType.values());
        case ORGAN_OF_FOCUS -> filterOption.updateTermDisplayName(
            IpMarketplaceOrganOfFocus.values());
      }
    }
  }

  // Each  entry in existing existingBuyerViews is of this way:
  // email + ip_market_place_id.
  // The email is sanitized to remove chars not admitted by prometheus.
  // Example: selle.company@seller.com => seller_company_seller_com.
  // the final entry is seller_company_seller_com_ip_market_place_id
  // for this reason to count the number of views for the ip_market_place_id is take the last
  // element in the array
  private long countIpMarketPlaceIdView(IpMarketplaceRef ipMarketplaceRef) {
    String keySeparator = "_";
    AtomicLong count = new AtomicLong();
    existingBuyerViews.forEach(
        x -> {
          var key = x.split(keySeparator);
          if (key[key.length - 1].equals(ipMarketplaceRef.value())) count.incrementAndGet();
        });
    return count.get();
  }

  private void validationExpand(boolean isASeller, boolean isABuyer, List<Expansion> expansions) {
    if (isASeller) {
      if (!expansions.isEmpty() && !expansions.contains(METRICS) && !expansions.contains(REQUESTS))
        BuilderForException.buildInvalidFieldException(
            "expand",
            Objects.toString(expansions),
            "A Seller can only expand only 'metrics' and 'requests'");
    }
    if (isABuyer) {
      if (!expansions.isEmpty() && !expansions.contains(REQUESTS))
        BuilderForException.buildInvalidFieldException(
            "expand",
            Objects.toString(expansions),
            "The only expansion allowed for a Buyer or Admin is 'requests'");
    }
  }

  private void hydrateIpMarketplaceRequests(
      List<IpMarketplaceRequestContactInfo> ipMarketplaceRequestContactInfos,
      PersonRef email,
      IpMarketplace ipMarketplace,
      boolean isABuyer) {
    ipMarketplace
        .getIpMarketplaceTracks()
        .forEach(
            x -> {
              if (!isABuyer)
                ipMarketplaceRequestContactInfos.add(IpMarketplaceRequestContactInfo.from(x));
              else if (x.getBuyer().getEmail().equals(email))
                ipMarketplaceRequestContactInfos.add(IpMarketplaceRequestContactInfo.from(x));
            });
  }

  private void createChatRoom(
      PersonRef buyerEmail, ChatRoomParameter chatRoomParameter, PersonRef sellerEmail) {
    this.rocketChatClient.withLogin(
        PersonRef.of(chatRoomParameter.getUsername()),
        chatRoomParameter.getPassword(),
        (authInfo) -> {
          var sellerAuthInfo = this.rocketChatClient.createAuthUserToken(authInfo, sellerEmail);
          sellerAuthInfo
              .flatMap(
                  info ->
                      this.rocketChatClient.createRoom(
                          info,
                          List.of(buyerEmail, PersonRef.of(this.rocketChatUserNotification)),
                          chatRoomParameter.getRoomName()))
              .ifPresent(chatRoomParameter.getIpMarketplaceTrack()::setRoomId);
        });
  }
}
