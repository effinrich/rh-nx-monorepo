package com.redesignhealth.company.api.service;

import static com.redesignhealth.company.api.client.search.command.SearchIndex.RESEARCH_EXTERNAL_CONTENT;
import static com.redesignhealth.company.api.client.search.entity.ResearchExternalContentDoc.ASSOCIATED_ENTITIES_FIELD;
import static com.redesignhealth.company.api.client.search.entity.ResearchExternalContentDoc.NOTE_TAKER_FIELD;
import static com.redesignhealth.company.api.client.search.entity.ResearchExternalContentDoc.STAKEHOLDERS_FIELD;
import static com.redesignhealth.company.api.client.search.entity.ResearchExternalContentDoc.TAGS_FIELD;
import static com.redesignhealth.company.api.client.search.entity.ResearchExternalContentDoc.TAXONOMY_TERM_1_FIELD;
import static com.redesignhealth.company.api.client.search.entity.ResearchExternalContentDoc.TAXONOMY_TERM_2_FIELD;
import static com.redesignhealth.company.api.client.search.entity.ResearchExternalContentDoc.TAXONOMY_TERM_3_FIELD;
import static com.redesignhealth.company.api.client.search.entity.ResearchExternalContentDoc.TITLE_FIELD;

import com.google.common.collect.Sets;
import com.redesignhealth.company.api.client.search.SearchClient;
import com.redesignhealth.company.api.client.search.command.SearchField;
import com.redesignhealth.company.api.client.search.command.SearchIndex;
import com.redesignhealth.company.api.client.search.command.SearchIndexCommand;
import com.redesignhealth.company.api.client.search.entity.FilterOptions;
import com.redesignhealth.company.api.client.search.entity.ResearchExternalContentDoc;
import com.redesignhealth.company.api.client.search.entity.SearchResult;
import com.redesignhealth.company.api.dto.command.ResearchArticleCommand;
import com.redesignhealth.company.api.entity.Company;
import com.redesignhealth.company.api.entity.ResearchArticle;
import com.redesignhealth.company.api.entity.ref.CompanyRef;
import com.redesignhealth.company.api.entity.ref.ResearchArticleRef;
import com.redesignhealth.company.api.exception.InvalidFieldException;
import com.redesignhealth.company.api.exception.dto.FieldErrorDetails;
import com.redesignhealth.company.api.exception.dto.FieldErrorType;
import com.redesignhealth.company.api.property.EntityConverter;
import com.redesignhealth.company.api.property.ResearchArticleEntityConverter;
import com.redesignhealth.company.api.repository.CompanyRepository;
import com.redesignhealth.company.api.repository.ResearchArticleRepository;
import com.redesignhealth.company.api.service.helper.Filter;
import com.redesignhealth.company.api.service.helper.RefGenerator;
import com.redesignhealth.company.api.taxonomy.CompanyTaxonomy;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class ResearchArticleService extends ResearchHubService<ResearchExternalContentDoc> {

  private final ResearchArticleRepository researchArticleRepository;
  private final CompanyRepository companyRepository;
  private final CompanyTaxonomy companyTaxonomy;
  private final SearchClient searchClient;
  private final ResearchArticleEntityConverter researchArticleEntityConverter;

  public static final List<String> VALID_SEARCH_FILTERS =
      List.of(
          STAKEHOLDERS_FIELD,
          NOTE_TAKER_FIELD,
          TAGS_FIELD,
          TAXONOMY_TERM_1_FIELD,
          TAXONOMY_TERM_2_FIELD,
          TAXONOMY_TERM_3_FIELD,
          ASSOCIATED_ENTITIES_FIELD);
  public static final List<SearchField> FIELDS_TO_SEARCH = List.of(SearchField.of(TITLE_FIELD));

  public ResearchArticleService(
      ResearchArticleRepository researchArticleRepository,
      CompanyRepository companyRepository,
      CompanyTaxonomy companyTaxonomy,
      SearchClient searchClient,
      ResearchArticleEntityConverter researchArticleEntityConverter) {
    super(ResearchExternalContentDoc.class);
    this.researchArticleRepository = researchArticleRepository;
    this.companyRepository = companyRepository;
    this.companyTaxonomy = companyTaxonomy;
    this.searchClient = searchClient;
    this.researchArticleEntityConverter = researchArticleEntityConverter;
  }

  public Page<ResearchArticle> query(String q, List<String> queryParamFilters, Pageable pageable) {
    var results = query(searchClient, q, queryParamFilters, pageable);
    return new PageImpl<>(
        transformResults(results.getContent()), results.getPageable(), results.getTotalElements());
  }

  public ResearchArticle create(ResearchArticleCommand command) {
    var companiesFound = companyRepository.findAllByApiIdIn(command.getCompanyIds());
    validate(command, companiesFound);
    companiesFound.forEach(companyTaxonomy::setTaxonomyTerms);
    var researchArticleRef = RefGenerator.of(researchArticleRepository, ResearchArticleRef.class);
    var researchArticle = ResearchArticle.from(command, companiesFound, researchArticleRef);
    researchArticleRepository.save(researchArticle);
    var researchExternalContentDoc = ResearchExternalContentDoc.from(researchArticle);
    searchClient.index(
        SearchIndexCommand.builder()
            .index(RESEARCH_EXTERNAL_CONTENT)
            .document(researchExternalContentDoc)
            .documentId(researchArticle.getApiId().value())
            .build());

    return researchArticle;
  }

  private void validate(ResearchArticleCommand command, Set<Company> companiesFound) {
    List<FieldErrorDetails> errors = new ArrayList<>();
    var companyIdsFound =
        companiesFound.stream().map(Company::getApiId).collect(Collectors.toSet());
    var companiesDoNotExist =
        Sets.difference(new HashSet<>(command.getCompanyIds()), companyIdsFound);
    if (!companiesDoNotExist.isEmpty()) {
      errors.add(
          FieldErrorDetails.of(
              ResearchArticleCommand.COMPANY_IDS_FIELD,
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
        getIndex(), VALID_SEARCH_FILTERS, searchClient, researchArticleEntityConverter);
  }

  @Override
  EntityConverter getEntityConverter() {
    return researchArticleEntityConverter;
  }

  @Override
  protected List<SearchField> getFieldsToSearch() {
    return FIELDS_TO_SEARCH;
  }

  @Override
  protected SearchIndex getIndex() {
    return RESEARCH_EXTERNAL_CONTENT;
  }

  private List<ResearchArticle> transformResults(
      List<SearchResult<ResearchExternalContentDoc>> searchResults) {
    var companyRefsFromSearchResults =
        searchResults.stream()
            .filter(document -> document.getSource().getCompanyApiCompanyId() != null)
            .map(document -> CompanyRef.of(document.getSource().getCompanyApiCompanyId()))
            .collect(Collectors.toSet());
    var companiesCache = getCompanies(companyRefsFromSearchResults, companyRepository);
    return searchResults.stream()
        .map(note -> ResearchArticle.from(note.getSource(), new HashSet<>(companiesCache.values())))
        .toList();
  }
}
