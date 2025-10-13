package com.redesignhealth.company.api.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.redesignhealth.company.api.client.search.entity.ResearchAuthor;
import com.redesignhealth.company.api.entity.research.Research;
import com.redesignhealth.company.api.taxonomy.TaxonomyTerm;
import io.swagger.v3.oas.annotations.media.Schema;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import lombok.Getter;
import lombok.experimental.Accessors;
import org.springframework.hateoas.RepresentationModel;

@Getter
public class ResearchSummary extends RepresentationModel<ResearchSummary> {

  public static final String TITLE_FIELD = "title";
  public static final String AUTHORS_FIELD = "authors";
  public static final String CREATED_FIELD = "created";
  public static final String ENTITY_FIELD = "entity";
  public static final String OBJECTIVES_FIELD = "objectives";
  public static final String SERVICES_FIELD = "services";
  public static final String METHODS_FIELD = "methods";
  public static final String SAMPLE_SIZE_FIELD = "sampleSize";
  public static final String SEGMENTS_FIELD = "segments";
  public static final String ADDITIONAL_SEGMENTS_FIELD = "additionalSegments";
  public static final String SUPPORTING_FILES_FIELD = "supportingFiles";
  private static final String CAN_ACCESS_FIELD = "canAccess";

  private String id;

  @JsonProperty(TITLE_FIELD)
  private String title;

  @JsonProperty(AUTHORS_FIELD)
  private List<String> authors;

  @JsonProperty(CREATED_FIELD)
  private Instant created;

  @JsonProperty(ENTITY_FIELD)
  private String entity;

  @JsonProperty(OBJECTIVES_FIELD)
  private String objectives;

  @JsonProperty(SERVICES_FIELD)
  private List<String> services;

  @JsonProperty(METHODS_FIELD)
  private List<String> methods;

  private List<String> specializedMethods;

  @JsonProperty(SAMPLE_SIZE_FIELD)
  private Long sampleSize;

  @JsonProperty(SEGMENTS_FIELD)
  private List<String> segments;

  @JsonProperty(ADDITIONAL_SEGMENTS_FIELD)
  private List<String> additionalSegments;

  @JsonProperty(SUPPORTING_FILES_FIELD)
  private List<LinkRef> supportingFiles;

  private String taxonomyTag1;
  private String taxonomyTag2;
  private String taxonomyTag3;
  private String teamRole;
  private CompanyReducedInfo company;

  @Accessors(fluent = true)
  @JsonProperty(CAN_ACCESS_FIELD)
  private boolean canAccess;

  @Schema(example = """
    {
      "title": "Research <em>Summary</em>"
    }
    """)
  private Map<String, List<String>> highlightedText;

  public static ResearchSummary from(Research research) {
    var summary = new ResearchSummary();
    summary.title = research.getTitle();
    if (research.getAuthors() != null) {
      summary.authors = research.getAuthors().stream().map(ResearchAuthor::getName).toList();
    }
    summary.created = research.getCreated();

    summary.objectives = research.getResearchObjectives();
    summary.services = research.getResearchServices();
    summary.methods = research.getMethods();
    summary.specializedMethods = research.getSpecializedMethods();
    summary.sampleSize = research.getResearchSampleSize();
    summary.segments = research.getToplineSegments();
    summary.additionalSegments = research.getPatientSegments();

    summary.teamRole = research.getTeamRole();
    summary.supportingFiles = new ArrayList<>();
    if (research.getDocumentLinks() != null) {
      summary.supportingFiles.addAll(research.getDocumentLinks());
    }
    if (research.getCompany() != null) {
      var company = research.getCompany();
      summary.entity = company.getName();
      summary.company = CompanyReducedInfo.from(company);
      var taxonomyTerms = company.getTaxonomyTerms();
      if (taxonomyTerms != null && taxonomyTerms.size() == TaxonomyTerm.LEAF_NODE_LEVEL) {
        summary.taxonomyTag1 = taxonomyTerms.get(0).getDisplayName();
        summary.taxonomyTag2 = taxonomyTerms.get(1).getDisplayName();
        summary.taxonomyTag3 = taxonomyTerms.get(2).getDisplayName();
      }
    }
    summary.canAccess = research.isCanAccess();
    summary.id = research.getApiId().value();
    summary.highlightedText = research.getHighlightedText();
    return summary;
  }
}
