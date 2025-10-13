package com.redesignhealth.company.api.client.search.entity;

import static com.redesignhealth.company.api.taxonomy.TaxonomyTerm.LEAF_NODE_LEVEL;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.redesignhealth.company.api.dto.LinkRef;
import com.redesignhealth.company.api.entity.Company;
import com.redesignhealth.company.api.entity.ResearchArticle;
import java.time.Instant;
import java.util.List;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.ToString;

@Getter
@Builder
@ToString
@EqualsAndHashCode
public class ResearchExternalContentDoc {
  public static final String ASSOCIATED_ENTITIES_FIELD = "associated_entities";
  public static final String ATTACHMENT_URL_FIELD = "attachment_url";
  public static final String COMPANY_API_COMPANY_ID_FIELD = "company_api_company_id";
  public static final String CREATED_AT_FIELD = "created_at";
  public static final String DISEASE_STATES_FIELD = "disease_states";
  public static final String TAXONOMY_TERM_1_FIELD = "taxonomy_term_1";
  public static final String TAXONOMY_TERM_2_FIELD = "taxonomy_term_2";
  public static final String TAXONOMY_TERM_3_FIELD = "taxonomy_term_3";
  public static final String NOTE_TAKER_FIELD = "note_taker";
  public static final String STAKEHOLDERS_FIELD = "stakeholders";
  public static final String TAGS_FIELD = "tags";

  public static final String TITLE_FIELD = "name";

  @JsonProperty(ASSOCIATED_ENTITIES_FIELD)
  List<String> associatedEntities;

  @JsonProperty(ATTACHMENT_URL_FIELD)
  List<String> attachmentUrl;

  List<LinkRef> attachments;

  @JsonProperty(COMPANY_API_COMPANY_ID_FIELD)
  String companyApiCompanyId;

  @JsonProperty(CREATED_AT_FIELD)
  Instant createdAt;

  @JsonProperty(DISEASE_STATES_FIELD)
  List<String> diseaseStates;

  String href;
  String id;

  String name;

  List<String> stakeholders;
  List<String> tags;

  @JsonProperty(TAXONOMY_TERM_1_FIELD)
  List<String> taxonomyTerm1;

  @JsonProperty(TAXONOMY_TERM_2_FIELD)
  List<String> taxonomyTerm2;

  @JsonProperty(TAXONOMY_TERM_3_FIELD)
  List<String> taxonomyTerm3;

  @JsonProperty(NOTE_TAKER_FIELD)
  String noteTaker;

  List<String> technologies;
  String type;
  List<String> url;

  public static ResearchExternalContentDoc from(ResearchArticle researchArticle) {
    var researchExternalContentDoc =
        ResearchExternalContentDoc.builder()
            .associatedEntities(
                researchArticle.getCompanies().stream().map(Company::getName).toList())
            .attachments(researchArticle.getAttachments())
            .createdAt(researchArticle.getCreated())
            .href(researchArticle.getHref())
            .id(researchArticle.getApiId().value())
            .stakeholders(researchArticle.getStakeholders())
            .tags(researchArticle.getAdditionalTags());
    if (researchArticle.getCompanies() != null
        && researchArticle.getCompanies().size() == LEAF_NODE_LEVEL) {
      researchExternalContentDoc
          .taxonomyTerm1(
              researchArticle.getCompanies().stream()
                  .map(c -> c.getTaxonomyTerms().get(0).getDisplayName())
                  .toList())
          .taxonomyTerm2(
              researchArticle.getCompanies().stream()
                  .map(c -> c.getTaxonomyTerms().get(1).getDisplayName())
                  .toList())
          .taxonomyTerm3(
              researchArticle.getCompanies().stream()
                  .map(c -> c.getTaxonomyTerms().get(2).getDisplayName())
                  .toList());
    }
    researchExternalContentDoc
        .type(researchArticle.getType())
        .name(researchArticle.getTitle())
        .noteTaker(researchArticle.getCreatedBy());
    return researchExternalContentDoc.build();
  }
}
