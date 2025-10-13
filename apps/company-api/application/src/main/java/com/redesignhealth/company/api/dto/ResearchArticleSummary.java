package com.redesignhealth.company.api.dto;

import com.redesignhealth.company.api.entity.ResearchArticle;
import com.redesignhealth.company.api.taxonomy.TaxonomyTerm;
import io.swagger.v3.oas.annotations.media.Schema;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import lombok.Getter;
import org.springframework.hateoas.RepresentationModel;

@Getter
public class ResearchArticleSummary extends RepresentationModel<ResearchArticleSummary> {
  public static final String CAN_ACCESS_FIELD = "canAccess";

  @Schema(example = "Shinra Research")
  private String title;

  @Schema(example = "Article/Publication")
  private String type;

  @Schema(example = "https://example.com")
  private String articleHref;

  @Schema(example = "[\"Patient\"]")
  private List<String> stakeholders;

  private List<CompanyReducedInfo> companies;

  @Schema(example = "[\"New\"]")
  private List<String> additionalTags;

  @Schema(
      example =
          """
    [{
      "name": "article.pdf",
      "href": "https://example.com"
    }]
  """)
  private List<LinkRef> attachments;

  @Schema(example = "true")
  private Boolean isAttachmentDisclaimerAccepted;

  @Schema(example = "GED1gc1E")
  private String id;

  @Schema(example = "[\"CARE_DELIVERY\"]")
  private List<String> taxonomyTag1;

  @Schema(example = "[\"CLINICAL_OPERATIONS\"]")
  private List<String> taxonomyTag2;

  @Schema(example = "[\"CARE_TEAM_COORDINATION\"]")
  private List<String> taxonomyTag3;

  @Schema(example = "2023-06-29T00:00:00Z")
  private Instant created;

  private String createdBy;

  public static ResearchArticleSummary from(ResearchArticle entity) {
    var summary = new ResearchArticleSummary();
    summary.id = entity.getApiId().value();
    summary.title = entity.getTitle();
    summary.type = entity.getType();
    summary.articleHref = entity.getHref();
    summary.stakeholders = entity.getStakeholders();
    if (entity.getCompanies() != null) {
      summary.companies = entity.getCompanies().stream().map(CompanyReducedInfo::from).toList();
      summary.taxonomyTag1 = new ArrayList<>();
      summary.taxonomyTag2 = new ArrayList<>();
      summary.taxonomyTag3 = new ArrayList<>();
      entity.getCompanies().stream()
          .filter(
              c ->
                  c.getTaxonomyTerms() != null
                      && c.getTaxonomyTerms().size() == TaxonomyTerm.LEAF_NODE_LEVEL)
          .forEach(
              c -> {
                summary.taxonomyTag1.add(c.getTaxonomyTerms().get(0).getDisplayName());
                summary.taxonomyTag2.add(c.getTaxonomyTerms().get(1).getDisplayName());
                summary.taxonomyTag3.add(c.getTaxonomyTerms().get(2).getDisplayName());
              });
    }
    summary.additionalTags = entity.getAdditionalTags();
    summary.attachments = entity.getAttachments();
    summary.isAttachmentDisclaimerAccepted = entity.getAttachmentDisclaimerAccepted();
    summary.created = entity.getCreated();
    summary.createdBy = entity.getCreatedBy();
    return summary;
  }
}
