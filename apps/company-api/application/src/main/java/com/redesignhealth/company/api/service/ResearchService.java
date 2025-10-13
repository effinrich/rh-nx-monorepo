package com.redesignhealth.company.api.service;

import static com.redesignhealth.company.api.client.search.command.SearchIndex.RESEARCH;
import static com.redesignhealth.company.api.client.search.entity.ResearchSearchDoc.DOCUMENT_TEXT_FIELD;
import static com.redesignhealth.company.api.client.search.entity.ResearchSearchDoc.SPRINT_NAME_FIELD;
import static com.redesignhealth.company.api.dto.command.ResearchCommand.AUTHORS_FIELD;
import static com.redesignhealth.company.api.dto.command.ResearchCommand.COMPANY_ID_FIELD;
import static com.redesignhealth.company.api.dto.command.ResearchCommand.SUPPORTING_FILES_FIELD;
import static org.springframework.util.MimeTypeUtils.TEXT_PLAIN;

import com.redesignhealth.company.api.client.file.GoogleDriveClient;
import com.redesignhealth.company.api.client.search.SearchClient;
import com.redesignhealth.company.api.client.search.command.SearchDeleteDocCommand;
import com.redesignhealth.company.api.client.search.command.SearchField;
import com.redesignhealth.company.api.client.search.command.SearchIndex;
import com.redesignhealth.company.api.client.search.command.SearchIndexCommand;
import com.redesignhealth.company.api.client.search.entity.FilterOptions;
import com.redesignhealth.company.api.client.search.entity.ResearchAuthor;
import com.redesignhealth.company.api.client.search.entity.ResearchSearchDoc;
import com.redesignhealth.company.api.client.search.entity.SearchResult;
import com.redesignhealth.company.api.conflicts.ConflictsEngine;
import com.redesignhealth.company.api.dto.LinkRef;
import com.redesignhealth.company.api.dto.command.ResearchCommand;
import com.redesignhealth.company.api.entity.Company;
import com.redesignhealth.company.api.entity.ref.CompanyRef;
import com.redesignhealth.company.api.entity.ref.PersonRef;
import com.redesignhealth.company.api.entity.ref.ResearchRef;
import com.redesignhealth.company.api.entity.research.Research;
import com.redesignhealth.company.api.exception.CompanyNotFoundException;
import com.redesignhealth.company.api.exception.InvalidFieldException;
import com.redesignhealth.company.api.exception.ResearchNotFoundException;
import com.redesignhealth.company.api.exception.dto.FieldErrorDetails;
import com.redesignhealth.company.api.exception.dto.FieldErrorType;
import com.redesignhealth.company.api.expansion.Expansion;
import com.redesignhealth.company.api.property.EntityConverter;
import com.redesignhealth.company.api.property.ResearchEntityConverter;
import com.redesignhealth.company.api.repository.CompanyRepository;
import com.redesignhealth.company.api.repository.PersonRepository;
import com.redesignhealth.company.api.repository.ResearchRepository;
import com.redesignhealth.company.api.service.helper.Filter;
import com.redesignhealth.company.api.service.helper.RefGenerator;
import com.redesignhealth.company.api.taxonomy.CompanyTaxonomy;
import com.redesignhealth.company.api.util.GoogleDriveUtil;
import jakarta.annotation.Nullable;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.Hibernate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class ResearchService extends ResearchHubService<ResearchSearchDoc> {

  private final ResearchEntityConverter researchEntityConverter;
  private final SearchClient searchClient;
  private final ConflictsEngine conflictsEngine;
  private final CompanyRepository companyRepository;
  private final GoogleDriveClient researchGoogleDriveClient;
  private final PersonRepository personRepository;
  public static final List<String> VALID_SEARCH_FILTERS =
      List.of(
          ResearchSearchDoc.OPCO_SPR_NEW_FIELD,
          ResearchSearchDoc.METHODS_FIELD,
          ResearchSearchDoc.RESEARCH_SERVICES_FIELD,
          ResearchSearchDoc.TOPLINE_SEGMENTS_FIELD,
          ResearchSearchDoc.AUTHORS_FIELD + ".name",
          ResearchSearchDoc.TAXONOMY_TERM_1_FIELD,
          ResearchSearchDoc.TAXONOMY_TERM_2_FIELD,
          ResearchSearchDoc.TAXONOMY_TERM_3_FIELD);
  public static final List<SearchField> FIELDS_TO_SEARCH =
      List.of(SearchField.of(SPRINT_NAME_FIELD, 4), SearchField.of(DOCUMENT_TEXT_FIELD));
  private final CompanyTaxonomy companyTaxonomy;
  private final ResearchRepository researchRepository;
  public static final String RESEARCH_REPORT_SUPPORTING_FILES_KEY = "report_url";

  public ResearchService(
      SearchClient searchClient,
      ConflictsEngine conflictsEngine,
      CompanyRepository companyRepository,
      ResearchEntityConverter researchEntityFields,
      PersonRepository personRepository,
      GoogleDriveClient researchGoogleDriveClient,
      CompanyTaxonomy companyTaxonomy,
      ResearchRepository researchRepository) {
    super(ResearchSearchDoc.class);
    this.searchClient = searchClient;
    this.companyRepository = companyRepository;
    this.researchEntityConverter = researchEntityFields;
    this.conflictsEngine = conflictsEngine;
    this.personRepository = personRepository;
    this.researchGoogleDriveClient = researchGoogleDriveClient;
    this.companyTaxonomy = companyTaxonomy;
    this.researchRepository = researchRepository;
  }

  public Page<Research> query(
      @Nullable String q,
      List<String> queryParamFilters,
      Pageable pageable,
      List<Expansion> expansions) {
    var searchResults = query(searchClient, q, queryParamFilters, pageable, expansions);
    return new PageImpl<>(
        transformResults(searchResults.getContent()),
        searchResults.getPageable(),
        searchResults.getTotalElements());
  }

  public Research create(ResearchCommand researchCommand) {
    validate(researchCommand);

    List<String> documentTexts = getTextFromGoogleDriveLinks(researchCommand.getSupportingFiles());

    var research = save(researchCommand);

    var document = ResearchSearchDoc.from(research, documentTexts);

    var searchCommand =
        SearchIndexCommand.builder()
            .index(RESEARCH)
            .document(document)
            .documentId(document.getId())
            .build();
    searchClient.index(searchCommand);
    return research;
  }

  public List<FilterOptions> getFilters() {
    return Filter.fromOS(RESEARCH, VALID_SEARCH_FILTERS, searchClient, researchEntityConverter);
  }

  private List<Research> transformResults(List<SearchResult<ResearchSearchDoc>> searchResults) {
    var companiesToHydrate =
        searchResults.stream()
            .map(s -> s.getSource().getCompanyApiCompanyId())
            .map(CompanyRef::of)
            .collect(Collectors.toSet());
    var companiesCache =
        companyRepository.findAllByApiIdIn(companiesToHydrate).stream()
            .collect(Collectors.toMap(Company::getApiId, Function.identity()));
    var accessToCompanies =
        companiesToHydrate.stream()
            .collect(Collectors.toMap(Function.identity(), conflictsEngine::hasAccess));

    return searchResults.stream()
        .map(
            researchSearchDoc -> {
              return createResearchWithConflicts(
                  researchSearchDoc, companiesCache, accessToCompanies);
            })
        .toList();
  }

  private Research createResearchWithConflicts(
      SearchResult<ResearchSearchDoc> researchSearchDoc,
      Map<CompanyRef, Company> companyCache,
      Map<CompanyRef, Boolean> accessToCompanies) {
    var companyId = CompanyRef.of(researchSearchDoc.getSource().getCompanyApiCompanyId());
    if (companyId.value() == null || companyId.value().isEmpty())
      return Research.from(researchSearchDoc);
    if (!companyCache.containsKey(companyId)) {
      log.error("Company {} doesn't exist for research", companyId);
      return Research.from(researchSearchDoc);
    }
    var company = companyCache.get(companyId);
    companyTaxonomy.setTaxonomyTerms(company);
    return Research.from(researchSearchDoc, company, accessToCompanies.get(companyId));
  }

  private Research save(ResearchCommand researchCommand) {
    var research = Research.of(RefGenerator.of(researchRepository, ResearchRef.class));
    research.setTitle(researchCommand.getTitle());
    if (researchCommand.getAuthors() != null) {
      research.setAuthors(researchCommand.getAuthors().stream().map(ResearchAuthor::of).toList());
    }
    research.setResearchServices(researchCommand.getServices());
    research.setResearchObjectives(researchCommand.getObjectives());
    research.setMethods(researchCommand.getMethods());
    research.setResearchSampleSize(researchCommand.getSampleSize());
    research.setDocumentLinks(researchCommand.getSupportingFiles());
    research.setToplineSegments(researchCommand.getSegments());
    research.setPatientSegments(researchCommand.getAdditionalSegments());
    research.setTeamRole(researchCommand.getTeamRole());
    research.setSpecializedMethods(researchCommand.getSpecializedMethods());
    research.setCompany(
        companyRepository
            .findByApiId(CompanyRef.of(researchCommand.getCompanyId()))
            .map(
                c -> {
                  companyTaxonomy.setTaxonomyTerms(c);
                  return c;
                })
            .orElseThrow(CompanyNotFoundException::new));
    return researchRepository.save(research);
  }

  /**
   * Grab the text/plain document representation of a various Google Drive links supplied with a
   * research document.
   */
  private List<String> getTextFromGoogleDriveLinks(List<LinkRef> links) {
    List<String> documentTexts = new ArrayList<>();
    for (var link : links) {
      var documentId = GoogleDriveUtil.getDocumentIdFromLink(link.getHref());
      documentId.ifPresent(
          id -> {
            documentTexts.add(researchGoogleDriveClient.getDocument(id, TEXT_PLAIN));
          });
    }
    return documentTexts;
  }

  private void validate(ResearchCommand command) {
    List<FieldErrorDetails> fieldErrors = new ArrayList<>();
    if (command.getAuthors() != null) {
      for (var email : command.getAuthors()) {
        if (!personRepository.existsByEmail(PersonRef.of(email))) {
          fieldErrors.add(FieldErrorDetails.of(AUTHORS_FIELD, email, FieldErrorType.EXISTS));
        }
      }
    }
    if (command.getCompanyId() != null
        && !companyRepository.existsByApiId(CompanyRef.of(command.getCompanyId()))) {
      fieldErrors.add(
          FieldErrorDetails.of(COMPANY_ID_FIELD, command.getCompanyId(), FieldErrorType.EXISTS));
    }

    if (command.getSupportingFiles() != null) {
      var containsResearchLink =
          command.getSupportingFiles().stream()
              .anyMatch(f -> RESEARCH_REPORT_SUPPORTING_FILES_KEY.equals(f.getName()));
      if (!containsResearchLink) {
        fieldErrors.add(
            FieldErrorDetails.of(SUPPORTING_FILES_FIELD, FieldErrorType.CONTAINS_REPORT_URL));
      }
    }
    if (!fieldErrors.isEmpty()) {
      throw new InvalidFieldException(fieldErrors.toArray(new FieldErrorDetails[0]));
    }
  }

  @Override
  protected EntityConverter getEntityConverter() {
    return researchEntityConverter;
  }

  @Override
  protected List<SearchField> getFieldsToSearch() {
    return FIELDS_TO_SEARCH;
  }

  @Override
  SearchIndex getIndex() {
    return RESEARCH;
  }

  public void delete(ResearchRef apiId) {
    var research = get(apiId);
    searchClient.delete(
        SearchDeleteDocCommand.builder().index(getIndex()).documentId(apiId.value()).build());
    researchRepository.delete(research);
  }

  public Research get(ResearchRef apiId) {
    var research =
        researchRepository.findByApiId(apiId).orElseThrow(ResearchNotFoundException::new);
    Hibernate.initialize(research.getCompany());
    companyTaxonomy.setTaxonomyTerms(research.getCompany());
    return research;
  }
}
