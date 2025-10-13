package com.redesignhealth.company.api.service;

import static com.redesignhealth.company.api.client.search.command.SearchIndex.CEO_DIRECTORY;
import static com.redesignhealth.company.api.client.search.entity.CeoDirectoryDoc.ADDITIONAL_INFO;
import static com.redesignhealth.company.api.client.search.entity.CeoDirectoryDoc.BIO;
import static com.redesignhealth.company.api.client.search.entity.CeoDirectoryDoc.BUSINESS_FOCUS_AREA;
import static com.redesignhealth.company.api.client.search.entity.CeoDirectoryDoc.BUSINESS_TYPE;
import static com.redesignhealth.company.api.client.search.entity.CeoDirectoryDoc.CUSTOMER_SEGMENT;
import static com.redesignhealth.company.api.client.search.entity.CeoDirectoryDoc.HEALTHCARE_SECTOR;
import static com.redesignhealth.company.api.client.search.entity.CeoDirectoryDoc.MEMBER;
import static com.redesignhealth.company.api.client.search.entity.CompanyDoc.FUNDRAISE_STATUS;
import static com.redesignhealth.company.api.client.search.entity.CompanyDoc.NAME;
import static com.redesignhealth.company.api.client.search.entity.MemberDoc.COMPANY;
import static com.redesignhealth.company.api.client.search.utils.Sanitizer.sanitizeHighlightedText;
import static com.redesignhealth.company.api.expansion.Expansion.HIGHLIGHTED_TEXT;
import static com.redesignhealth.company.api.expansion.Expansion.MEMBER_OF;

import com.redesignhealth.company.api.client.search.SearchClient;
import com.redesignhealth.company.api.client.search.command.SearchCommand;
import com.redesignhealth.company.api.client.search.command.SearchDeleteDocCommand;
import com.redesignhealth.company.api.client.search.command.SearchField;
import com.redesignhealth.company.api.client.search.command.SearchIndexCommand;
import com.redesignhealth.company.api.client.search.entity.CeoDirectoryDoc;
import com.redesignhealth.company.api.client.search.entity.FilterOptions;
import com.redesignhealth.company.api.client.search.entity.MemberDoc;
import com.redesignhealth.company.api.client.search.entity.SearchResult;
import com.redesignhealth.company.api.dto.CeoSummary;
import com.redesignhealth.company.api.dto.SearchFilter;
import com.redesignhealth.company.api.dto.command.CeoBaseCommand;
import com.redesignhealth.company.api.dto.command.CeoCreateCommand;
import com.redesignhealth.company.api.dto.enums.CompanyMemberStatus;
import com.redesignhealth.company.api.entity.Ceo;
import com.redesignhealth.company.api.entity.Person;
import com.redesignhealth.company.api.entity.ref.CeoRef;
import com.redesignhealth.company.api.entity.ref.CompanyRef;
import com.redesignhealth.company.api.entity.ref.PersonRef;
import com.redesignhealth.company.api.entity.request.RoleAuthority;
import com.redesignhealth.company.api.exception.CeoNotFoundException;
import com.redesignhealth.company.api.exception.ForbiddenEditCeoInfoException;
import com.redesignhealth.company.api.exception.InvalidFieldException;
import com.redesignhealth.company.api.exception.dto.FieldErrorType;
import com.redesignhealth.company.api.expansion.Expansion;
import com.redesignhealth.company.api.property.CeoDirectoryConverter;
import com.redesignhealth.company.api.repository.CeoRepository;
import com.redesignhealth.company.api.repository.CompanyRepository;
import com.redesignhealth.company.api.repository.PersonRepository;
import com.redesignhealth.company.api.security.AuthChecks;
import com.redesignhealth.company.api.service.helper.BuilderForException;
import com.redesignhealth.company.api.service.helper.Filter;
import com.redesignhealth.company.api.service.helper.RefGenerator;
import com.redesignhealth.company.api.util.ApiToSearchConverter;
import jakarta.annotation.Nullable;
import jakarta.transaction.Transactional;
import java.util.List;
import java.util.Set;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class CeoService {
  private final CeoRepository ceoRepository;
  private final PersonRepository personRepository;
  private final CompanyRepository companyRepository;

  private final Set<String> validLocations;

  private final SearchClient searchClient;

  private final CeoDirectoryConverter ceoDirectoryConverter;

  public static final List<SearchField> FIELDS_TO_SEARCH =
      List.of(
          SearchField.of(MEMBER + "." + COMPANY + "." + NAME, 2),
          SearchField.of(MEMBER + "." + MemberDoc.GIVEN_NAME, 2),
          SearchField.of(MEMBER + "." + MemberDoc.FAMILY_NAME, 2),
          SearchField.of(ADDITIONAL_INFO, 1),
          SearchField.of(BIO, 1));

  public static final List<String> VALID_SEARCH_FILTERS =
      List.of(
          BUSINESS_TYPE,
          MEMBER + "." + COMPANY + "." + FUNDRAISE_STATUS,
          CUSTOMER_SEGMENT,
          HEALTHCARE_SECTOR,
          BUSINESS_FOCUS_AREA);

  public CeoService(
      CeoRepository ceoRepository,
      PersonRepository personRepository,
      @Value("${ceo-data.valid-locations}") Set<String> validLocations,
      SearchClient searchClient,
      CeoDirectoryConverter ceoDirectoryConverter,
      CompanyRepository companyRepository) {
    this.ceoRepository = ceoRepository;
    this.personRepository = personRepository;
    this.validLocations = validLocations;
    this.searchClient = searchClient;
    this.ceoDirectoryConverter = ceoDirectoryConverter;
    this.companyRepository = companyRepository;
  }

  @Transactional
  public CeoSummary create(CeoCreateCommand command) {
    if (command.getEmail() == null || command.getEmail().isBlank())
      throw new InvalidFieldException(
          BuilderForException.buildError("email", command.getEmail(), "Email is required"));
    var personRef = PersonRef.of(command.getEmail());
    var person =
        personRepository
            .findByEmail(personRef, MEMBER_OF)
            .orElseThrow(
                () -> {
                  throw new InvalidFieldException(
                      BuilderForException.buildError(
                          "email", personRef.value(), FieldErrorType.EXISTS.getDescription()));
                });
    if (person.getMemberOf().stream()
            .filter(x -> x.getStatus().equals(CompanyMemberStatus.ACTIVE))
            .toList()
            .size()
        > 1)
      throw new InvalidFieldException(
          BuilderForException.buildError(
              "email", personRef.value(), "CEO only can be active in one Company"));
    if (ceoRepository.existsCeoByEmail(personRef))
      throw new InvalidFieldException(
          BuilderForException.buildError(
              "email", personRef.value(), FieldErrorType.UNIQUE.getDescription()));
    checkLocations(command.getLocation());
    var ceoRef = RefGenerator.of(ceoRepository, CeoRef.class);
    var ceo = new Ceo();
    ceo.setEmail(personRef);
    ceo.setApiId(ceoRef);
    setCeo(ceo, command);
    ceoRepository.save(ceo);
    upsertOS(ceo, person);
    return CeoSummary.from(ceo, person);
  }

  public CeoSummary update(CeoBaseCommand command, CeoRef apiId) {
    var editorRole = AuthChecks.getPrincipal().getAuthorities().stream().findFirst().orElse(null);
    var ceo = ceoRepository.findCeoByApiId(apiId).orElseThrow(CeoNotFoundException::new);
    if (editorRole != null
        && RoleAuthority.valueOf(editorRole.getAuthority()).equals(RoleAuthority.ROLE_RH_USER))
      throw new ForbiddenEditCeoInfoException(
          "Only the CEO, and Admin or SuperAdmin can edit the info");
    if (editorRole != null
        && RoleAuthority.valueOf(editorRole.getAuthority()).equals(RoleAuthority.ROLE_OP_CO_USER)
        && !ceo.getEmail().value().equals(AuthChecks.getPrincipal().getUsername()))
      throw new ForbiddenEditCeoInfoException(
          "Only a CEO can edit its information for ROLE_OP_CO_USER");

    checkLocations(command.getLocation());
    setCeo(ceo, command);
    ceoRepository.save(ceo);
    upsertOS(ceo, ceo.getPerson());
    return CeoSummary.from(ceo, ceo.getPerson());
  }

  public CeoSummary get(CeoRef apiId) {
    var ceo = ceoRepository.findCeoByApiId(apiId).orElseThrow(CeoNotFoundException::new);
    return CeoSummary.from(ceo, ceo.getPerson());
  }

  public Page<CeoSummary> query(
      @Nullable String q,
      List<String> queryParamFilters,
      Pageable pageable,
      List<Expansion> expansions) {
    var browserRole = AuthChecks.getPrincipal().getAuthorities().stream().findFirst().orElse(null);
    if (browserRole != null
        && RoleAuthority.valueOf(browserRole.getAuthority()).equals(RoleAuthority.ROLE_OP_CO_USER))
      queryParamFilters.add("visible,OPT_IN");
    var sanitizedPageable = sanitizePageable(pageable);
    var sanitizedFilters = sanitizeFilters(queryParamFilters);
    var shouldHighlightText = expansions.contains(HIGHLIGHTED_TEXT);
    var command =
        SearchCommand.builder()
            .index(CEO_DIRECTORY)
            .fields(FIELDS_TO_SEARCH)
            .highlight(shouldHighlightText)
            .query(q)
            .filters(sanitizedFilters)
            .build();
    var results = searchClient.search(command, sanitizedPageable, CeoDirectoryDoc.class);
    var sanitizedResults =
        results.getContent().stream()
            .map((result) -> sanitizeHighlightedText(result, ceoDirectoryConverter))
            .toList();
    return new PageImpl<>(
        transformResults(sanitizedResults), results.getPageable(), results.getTotalElements());
  }

  public void delete(CeoRef apiId) {
    var ceo = ceoRepository.findCeoByApiId(apiId).orElseThrow(CeoNotFoundException::new);
    searchClient.delete(
        SearchDeleteDocCommand.builder().documentId(apiId.value()).index(CEO_DIRECTORY).build());
    ceoRepository.delete(ceo);
  }

  public List<FilterOptions> getFilters() {
    return Filter.fromOS(CEO_DIRECTORY, VALID_SEARCH_FILTERS, searchClient, ceoDirectoryConverter);
  }

  private void checkLocations(String location) {
    if (location != null && !location.isBlank() && !validLocations.contains(location.toLowerCase()))
      throw new InvalidFieldException(
          BuilderForException.buildError(
              "location", location, FieldErrorType.EXISTS.getDescription()));
  }

  private void setCeo(Ceo ceo, CeoBaseCommand command) {
    ceo.setPictureHref(command.getPictureHref());
    ceo.setBusinessType(command.getBusinessType());
    ceo.setLocation(command.getLocation());
    ceo.setMarketServiceArea(command.getMarketServiceArea());
    ceo.setCustomerSegment(command.getCustomerSegment());
    ceo.setHealthcareSector(command.getHealthcareSector());
    ceo.setBusinessFocusArea(command.getBusinessFocusArea());
    ceo.setBio(command.getBio());
    ceo.setAdditionalInfo(command.getAdditionalInfo());
    ceo.setVisible(command.getVisible());
    ceo.setLinkedinHref(command.getLinkedinHref());
  }

  private void upsertOS(Ceo ceo, Person person) {
    var ceoDirectoryDoc = CeoDirectoryDoc.from(ceo, person);
    searchClient.index(
        SearchIndexCommand.builder()
            .index(CEO_DIRECTORY)
            .document(ceoDirectoryDoc)
            .documentId(ceo.getApiId().value())
            .build());
  }

  // TO-DO in separated ticket move those methods to the static methods in Transformation class
  private Pageable sanitizePageable(Pageable pageable) {
    var sanitizedSort =
        ApiToSearchConverter.convertSort(
            pageable.getSort(), ceoDirectoryConverter.getApiToSearch());
    return PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), sanitizedSort);
  }

  // TO-DO in separated ticket move those methods to the static methods in Transformation class
  private List<SearchFilter> sanitizeFilters(List<String> queryParamFilters) {
    var filters = SearchCommand.convertQueryParams(queryParamFilters);
    return ApiToSearchConverter.convertFilters(filters, ceoDirectoryConverter.getApiToSearch());
  }

  private List<CeoSummary> transformResults(List<SearchResult<CeoDirectoryDoc>> searchResults) {
    return searchResults.stream()
        .map(
            searchResult -> {
              var company =
                  companyRepository.findByApiId(
                      CompanyRef.of(searchResult.getSource().getMember().getCompany().getId()));
              var ceo = Ceo.from(searchResult);
              var member = searchResult.getSource().getMember();
              return CeoSummary.from(
                  ceo, company, member.getEmail(), member.getGivenName(), member.getFamilyName());
            })
        .toList();
  }
}
