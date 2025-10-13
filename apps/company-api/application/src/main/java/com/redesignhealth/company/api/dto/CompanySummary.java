package com.redesignhealth.company.api.dto;

import com.redesignhealth.company.api.dto.enums.CompanyStage;
import com.redesignhealth.company.api.dto.enums.CompanyStatus;
import com.redesignhealth.company.api.entity.Company;
import io.swagger.v3.oas.annotations.media.Schema;
import java.time.Instant;
import java.util.List;
import lombok.Getter;
import org.hibernate.Hibernate;
import org.springframework.hateoas.RepresentationModel;

@Getter
public class CompanySummary extends RepresentationModel<CompanySummary> {

  @Schema(example = "Ever/Body")
  private String name;

  @Schema(example = "6aBCde12", requiredMode = Schema.RequiredMode.REQUIRED)
  private String id;

  @Schema(example = "3")
  private Long number;

  @Schema(example = "Ever/Body, Inc.")
  private String legalName;

  @Schema(
      example =
          "Ever/Body was founded to demystify cosmetic dermatology and make it more accessible.")
  private String description;

  private List<PersonSummary> members;

  private Instant created;

  private Instant lastModified;

  private CompanyStage stage;

  private CompanyStatus status;

  private String linkedApiId;
  private List<TaxonomySummary> taxonomy;

  // CompanyFundraiseStatus
  private SerializableEnum fundraiseStatus;

  @Schema(example = "https://example.com")
  private String href;

  @Schema(example = "https://example.com")
  private String dashboardHref;

  @Schema(example = "true")
  private Boolean hasPlatformAgreement;

  private SerializableEnum activityType;

  private SerializableEnum organizationType;

  private SerializableEnum region;

  public static CompanySummary from(Company company) {
    var summary = new CompanySummary();
    summary.name = company.getName();
    summary.id = company.getApiId().value();
    summary.number = company.getNumber();
    summary.legalName = company.getLegalName();
    summary.description = company.getDescription();

    if (Hibernate.isInitialized(company.getMembers())) {
      if (null != company.getMembers()) {
        summary.members =
            company.getMembers().stream().map(x -> PersonSummary.from(x.getPerson())).toList();
      }
    }

    summary.created = company.getCreated();
    summary.lastModified = company.getLastModified();
    summary.stage = company.getStage();
    summary.status = company.getStatus();
    summary.linkedApiId =
        (company.getLinkedApiId() != null) ? company.getLinkedApiId().getApiId() : null;
    summary.taxonomy =
        company.getTaxonomyTerms() != null
            ? company.getTaxonomyTerms().stream().map(TaxonomySummary::from).toList()
            : null;
    summary.fundraiseStatus = company.getFundraiseStatus();
    summary.href = company.getHref();
    summary.dashboardHref = company.getDashboardHref();
    summary.hasPlatformAgreement = company.getHasPlatformAgreement();
    if (company.getCompanyIpMarketplace() != null) {
      summary.activityType = company.getCompanyIpMarketplace().getActivityType();
      summary.organizationType = company.getCompanyIpMarketplace().getOrganizationType();
      summary.region = company.getCompanyIpMarketplace().getRegion();
    }
    return summary;
  }
}
