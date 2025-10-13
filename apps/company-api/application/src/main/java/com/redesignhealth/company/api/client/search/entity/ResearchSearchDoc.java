package com.redesignhealth.company.api.client.search.entity;

import static com.redesignhealth.company.api.taxonomy.TaxonomyTerm.LEAF_NODE_LEVEL;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.redesignhealth.company.api.dto.LinkRef;
import com.redesignhealth.company.api.entity.research.Research;
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
public class ResearchSearchDoc {

  public static final String ID_FIELD = "id";
  public static final String SPRINT_NAME_FIELD = "sprint_name";
  public static final String AUTHORS_FIELD = "authors";
  public static final String CREATED_AT_FIELD = "created_at";
  public static final String URL_SPR_FIELD = "url_spr";
  public static final String OPCO_SPR_NEW_FIELD = "opco_spr_new";
  public static final String RESEARCH_OBJECTIVES_FIELD = "research_objectives";
  public static final String RESEARCH_SERVICES_FIELD = "research_services";
  public static final String METHODS_FIELD = "methods";
  public static final String RESEARCH_METHODS_SUB_FIELD = "research_methods_sub";
  public static final String RESEARCH_SAMPLE_SIZE_FIELD = "research_sample_size";
  public static final String TOPLINE_SEGMENTS_FIELD = "topline_segments";
  public static final String PATIENT_SEGMENTS_FIELD = "patient_segments";
  public static final String TEAM_ROLE_FIELD = "team_role";
  public static final String TAXONOMY_TERM_1_FIELD = "taxonomy_term_1";
  public static final String TAXONOMY_TERM_2_FIELD = "taxonomy_term_2";
  public static final String TAXONOMY_TERM_3_FIELD = "taxonomy_term_3";
  public static final String COMPANY_API_COMPANY_ID_FIELD = "company_api_company_id";
  public static final String DOCUMENT_TEXT_FIELD = "document_text";
  public static final String DOCUMENT_LINKS_FIELD = "document_links";

  @JsonProperty(ID_FIELD)
  private String id;

  @JsonProperty(SPRINT_NAME_FIELD)
  private String sprintName;

  @JsonProperty(AUTHORS_FIELD)
  private List<ResearchAuthor> authors;

  @JsonProperty(CREATED_AT_FIELD)
  private Instant createdAt;

  @JsonProperty(URL_SPR_FIELD)
  private String urlSpr;

  @JsonProperty(OPCO_SPR_NEW_FIELD)
  private String opcoSprNew;

  @JsonProperty(RESEARCH_OBJECTIVES_FIELD)
  private String researchObjectives;

  @JsonProperty(RESEARCH_SERVICES_FIELD)
  private List<String> researchServices;

  @JsonProperty(METHODS_FIELD)
  private List<String> methods;

  @JsonProperty(RESEARCH_METHODS_SUB_FIELD)
  private List<String> specializedMethods;

  @JsonProperty(RESEARCH_SAMPLE_SIZE_FIELD)
  private Long researchSampleSize;

  @JsonProperty(TOPLINE_SEGMENTS_FIELD)
  private List<String> toplineSegments;

  @JsonProperty(PATIENT_SEGMENTS_FIELD)
  private List<String> patientSegments;

  @JsonProperty(TEAM_ROLE_FIELD)
  private String teamRole;

  @JsonProperty(TAXONOMY_TERM_1_FIELD)
  private String taxonomyTerm1;

  @JsonProperty(TAXONOMY_TERM_2_FIELD)
  private String taxonomyTerm2;

  @JsonProperty(TAXONOMY_TERM_3_FIELD)
  private String taxonomyTerm3;

  @JsonProperty(COMPANY_API_COMPANY_ID_FIELD)
  private String companyApiCompanyId;

  @JsonProperty(DOCUMENT_TEXT_FIELD)
  private List<String> documentText;

  @JsonProperty(DOCUMENT_LINKS_FIELD)
  private List<LinkRef> documentLinks;

  public static ResearchSearchDoc from(Research research, List<String> documentText) {

    var builder =
        ResearchSearchDoc.builder()
            .id(research.getApiId().value())
            .sprintName(research.getTitle())
            .researchSampleSize(research.getResearchSampleSize())
            .toplineSegments(research.getToplineSegments())
            .patientSegments(research.getPatientSegments())
            .researchServices(research.getResearchServices())
            .methods(research.getMethods())
            .researchObjectives(research.getResearchObjectives())
            .documentLinks(research.getDocumentLinks())
            .createdAt(research.getCreated())
            .teamRole(research.getTeamRole())
            .specializedMethods(research.getSpecializedMethods())
            .documentText(documentText);
    if (research.getAuthors() != null) {
      builder.authors(research.getAuthors());
    }

    if (research.getCompany() != null) {
      var company = research.getCompany();
      builder.opcoSprNew(company.getName());
      builder.companyApiCompanyId(company.getApiId().value());
      if (company.getTaxonomyTerms() != null) {
        if (company.getTaxonomyTerms().size() == LEAF_NODE_LEVEL) {
          builder.taxonomyTerm1(company.getTaxonomyTerms().get(0).getDisplayName());
          builder.taxonomyTerm2(company.getTaxonomyTerms().get(1).getDisplayName());
          builder.taxonomyTerm3(company.getTaxonomyTerms().get(2).getDisplayName());
        }
      }
    }
    return builder.build();
  }
}
