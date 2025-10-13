package com.redesignhealth.company.api.service;

import static com.redesignhealth.company.api.client.search.command.SearchIndex.EXPERT_NOTE;
import static com.redesignhealth.company.api.client.search.entity.ExpertNoteSearchDoc.ASSOCIATED_ENTITIES_FIELD;
import static com.redesignhealth.company.api.client.search.entity.ExpertNoteSearchDoc.INTERVIEWEE_COMPANY_FIELD;
import static com.redesignhealth.company.api.client.search.entity.ExpertNoteSearchDoc.INTERVIEWEE_NAME_FIELD;
import static com.redesignhealth.company.api.client.search.entity.ExpertNoteSearchDoc.NOTE_RAW_FIELD;
import static com.redesignhealth.company.api.client.search.entity.ExpertNoteSearchDoc.STAKEHOLDERS_FIELD;
import static com.redesignhealth.company.api.client.search.entity.ExpertNoteSearchDoc.TAGS_FIELD;
import static com.redesignhealth.company.api.client.search.entity.ExpertNoteSearchDoc.TAXONOMY_TERM_1_FIELD;
import static com.redesignhealth.company.api.client.search.entity.ExpertNoteSearchDoc.TAXONOMY_TERM_2_FIELD;
import static com.redesignhealth.company.api.client.search.entity.ExpertNoteSearchDoc.TAXONOMY_TERM_3_FIELD;
import static org.springframework.http.MediaType.TEXT_PLAIN;

import com.google.common.collect.Sets;
import com.redesignhealth.company.api.client.file.GoogleDriveClient;
import com.redesignhealth.company.api.client.search.SearchClient;
import com.redesignhealth.company.api.client.search.command.SearchDeleteDocCommand;
import com.redesignhealth.company.api.client.search.command.SearchField;
import com.redesignhealth.company.api.client.search.command.SearchIndex;
import com.redesignhealth.company.api.client.search.command.SearchIndexCommand;
import com.redesignhealth.company.api.client.search.entity.ExpertNoteSearchDoc;
import com.redesignhealth.company.api.client.search.entity.FilterOptions;
import com.redesignhealth.company.api.client.search.entity.SearchResult;
import com.redesignhealth.company.api.conflicts.ConflictsEngine;
import com.redesignhealth.company.api.dto.command.ExpertNoteCommand;
import com.redesignhealth.company.api.entity.Company;
import com.redesignhealth.company.api.entity.ExpertNote;
import com.redesignhealth.company.api.entity.ref.CompanyRef;
import com.redesignhealth.company.api.entity.ref.ExpertNoteRef;
import com.redesignhealth.company.api.exception.ExpertNoteNotFoundException;
import com.redesignhealth.company.api.exception.InvalidFieldException;
import com.redesignhealth.company.api.exception.dto.FieldErrorDetails;
import com.redesignhealth.company.api.exception.dto.FieldErrorType;
import com.redesignhealth.company.api.expansion.Expansion;
import com.redesignhealth.company.api.property.EntityConverter;
import com.redesignhealth.company.api.property.ExpertNoteEntityConverter;
import com.redesignhealth.company.api.repository.CompanyRepository;
import com.redesignhealth.company.api.repository.ExpertNoteRepository;
import com.redesignhealth.company.api.repository.PersonRepository;
import com.redesignhealth.company.api.service.helper.Filter;
import com.redesignhealth.company.api.service.helper.RefGenerator;
import com.redesignhealth.company.api.taxonomy.CompanyTaxonomy;
import com.redesignhealth.company.api.util.GoogleDriveUtil;
import jakarta.transaction.Transactional;
import java.security.Principal;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.Hibernate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class ExpertNoteService extends ResearchHubService<ExpertNoteSearchDoc> {
  private final SearchClient searchClient;
  private final ExpertNoteEntityConverter expertNoteEntityConverter;
  private final CompanyRepository companyRepository;
  private final PersonRepository personRepository;
  private final CompanyTaxonomy companyTaxonomy;
  private final ConflictsEngine conflictsEngine;
  private final GoogleDriveClient researchGoogleDriveClient;

  private final ExpertNoteRepository expertNoteRepository;
  public static final List<String> VALID_SEARCH_FILTERS =
      List.of(
          STAKEHOLDERS_FIELD,
          TAGS_FIELD,
          ASSOCIATED_ENTITIES_FIELD,
          ExpertNoteSearchDoc.NOTE_TAKER_FIELD,
          TAXONOMY_TERM_1_FIELD,
          TAXONOMY_TERM_2_FIELD,
          TAXONOMY_TERM_3_FIELD);
  public static final List<SearchField> FIELDS_TO_SEARCH =
      List.of(
          SearchField.of(INTERVIEWEE_NAME_FIELD, 4),
          SearchField.of(INTERVIEWEE_COMPANY_FIELD, 4),
          SearchField.of(NOTE_RAW_FIELD));

  public ExpertNoteService(
      SearchClient searchClient,
      ExpertNoteEntityConverter expertNoteEntityConverter,
      CompanyRepository companyRepository,
      PersonRepository personRepository,
      ConflictsEngine conflictsEngine,
      CompanyTaxonomy companyTaxonomy,
      GoogleDriveClient researchGoogleDriveClient,
      ExpertNoteRepository expertNoteRepository) {
    super(ExpertNoteSearchDoc.class);
    this.searchClient = searchClient;
    this.expertNoteEntityConverter = expertNoteEntityConverter;
    this.companyRepository = companyRepository;
    this.personRepository = personRepository;
    this.conflictsEngine = conflictsEngine;
    this.companyTaxonomy = companyTaxonomy;
    this.researchGoogleDriveClient = researchGoogleDriveClient;
    this.expertNoteRepository = expertNoteRepository;
  }

  public Page<ExpertNote> query(
      String q, List<String> queryParamFilters, Pageable pageable, List<Expansion> expansions) {
    var results = query(searchClient, q, queryParamFilters, pageable, expansions);

    return new PageImpl<>(
        transformResults(results.getContent()), results.getPageable(), results.getTotalElements());
  }

  public ExpertNote create(ExpertNoteCommand command) {
    validate(command);
    var companies = getCompanies(new HashSet<>(command.getCompanyIds()));
    companies.values().forEach(companyTaxonomy::setTaxonomyTerms);
    var notesRaw =
        GoogleDriveUtil.getDocumentIdFromLink(command.getNoteHref())
            .map(documentId -> researchGoogleDriveClient.getDocument(documentId, TEXT_PLAIN))
            .orElse(null);
    var searchDoc = ExpertNoteSearchDoc.from(command, companies.values(), notesRaw);
    var expertNoteApiId = RefGenerator.of(expertNoteRepository, ExpertNoteRef.class);
    var expertNote =
        ExpertNote.from(
            SearchResult.of(searchDoc),
            companies,
            canAccess(searchDoc, conflictsEngine.canAccess(companies.keySet())),
            expertNoteApiId.getValue());
    expertNote.setApiId(expertNoteApiId);
    expertNoteRepository.save(expertNote);
    searchClient.index(
        SearchIndexCommand.builder()
            .index(EXPERT_NOTE)
            .document(searchDoc)
            .documentId(expertNote.getApiId().value())
            .build());
    return expertNote;
  }

  private void validate(ExpertNoteCommand command) {
    List<FieldErrorDetails> errors = new ArrayList<>();
    if (!personRepository.existsByEmail(command.getNoteTaker())) {
      errors.add(
          FieldErrorDetails.of(
              ExpertNoteCommand.NOTE_TAKER_FIELD,
              command.getNoteTaker().value(),
              FieldErrorType.EXISTS));
    }

    var companiesFound =
        companyRepository.findAllByApiIdIn(command.getCompanyIds()).stream()
            .map(Company::getApiId)
            .collect(Collectors.toSet());
    var companiesDoNotExist =
        Sets.difference(new HashSet<>(command.getCompanyIds()), companiesFound);
    if (!companiesDoNotExist.isEmpty()) {
      errors.add(
          FieldErrorDetails.of(
              ExpertNoteCommand.COMPANY_IDS_FIELD,
              command.getCompanyIds().stream()
                  .map(CompanyRef::value)
                  .collect(Collectors.joining(",")),
              FieldErrorType.EXISTS));
    }

    if (!errors.isEmpty()) {
      throw new InvalidFieldException(errors);
    }
  }

  public List<FilterOptions> getFilters() {
    return Filter.fromOS(
        EXPERT_NOTE, VALID_SEARCH_FILTERS, searchClient, expertNoteEntityConverter);
  }

  private List<ExpertNote> transformResults(List<SearchResult<ExpertNoteSearchDoc>> searchResults) {
    var companyRefsFromSearchResults =
        searchResults.stream()
            .filter(note -> note.getSource().getCompanyApiCompanyIds() != null)
            .flatMap(note -> note.getSource().getCompanyApiCompanyIds().stream())
            .map(CompanyRef::of)
            .collect(Collectors.toSet());
    var companiesCache = getCompanies(companyRefsFromSearchResults);
    var accessToCompanies = conflictsEngine.canAccess(companyRefsFromSearchResults);
    return searchResults.stream()
        .map(
            note ->
                ExpertNote.from(
                    note,
                    companiesCache,
                    canAccess(note.getSource(), accessToCompanies),
                    note.getId()))
        .toList();
  }

  private Map<CompanyRef, Company> getCompanies(Set<CompanyRef> ids) {
    return getCompanies(ids, companyRepository);
  }

  /**
   * Check if {@link java.security.Principal} has access to every company associated with document
   *
   * @param note document requested
   * @param accessToCompanies Map of {@link Principal}s access to companies
   * @return true if user has access to all companies
   */
  private boolean canAccess(ExpertNoteSearchDoc note, Map<CompanyRef, Boolean> accessToCompanies) {
    if (note.getCompanyApiCompanyIds() == null) {
      return true;
    }

    return note.getCompanyApiCompanyIds().stream()
        .map(apiId -> accessToCompanies.get(CompanyRef.of(apiId)))
        .filter(Objects::nonNull)
        .allMatch(hasAccess -> hasAccess);
  }

  @Override
  protected EntityConverter getEntityConverter() {
    return expertNoteEntityConverter;
  }

  @Override
  protected List<SearchField> getFieldsToSearch() {
    return FIELDS_TO_SEARCH;
  }

  @Override
  protected SearchIndex getIndex() {
    return EXPERT_NOTE;
  }

  @Transactional
  public ExpertNote get(ExpertNoteRef expertNoteId) {
    var expertNote =
        expertNoteRepository
            .findByApiId(expertNoteId)
            .orElseThrow(ExpertNoteNotFoundException::new);
    Hibernate.initialize(expertNote.getCompanies());
    expertNote.getCompanies().forEach(companyTaxonomy::setTaxonomyTerms);
    return expertNote;
  }

  public void delete(ExpertNoteRef expertNoteId) {
    var expertNote =
        expertNoteRepository
            .findByApiId(expertNoteId)
            .orElseThrow(ExpertNoteNotFoundException::new);
    searchClient.delete(
        SearchDeleteDocCommand.builder()
            .documentId(expertNoteId.value())
            .index(getIndex())
            .build());
    expertNoteRepository.delete(expertNote);
  }
}
