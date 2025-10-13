package com.redesignhealth.company.api.dto;

import com.redesignhealth.company.api.dto.enums.CompanyStage;
import com.redesignhealth.company.api.dto.enums.CompanyStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import java.time.Instant;
import java.util.List;
import lombok.Getter;
import org.springframework.hateoas.RepresentationModel;

@Getter
public class CompanyDtoSummary extends RepresentationModel<CompanyDtoSummary> {
  @Schema(example = "3")
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

  private List<CompanyMemberSummary> members;

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

  public static CompanyDtoSummary from(CompanyDto companyDto) {
    var summary = new CompanyDtoSummary();
    summary.name = companyDto.getCompany().getName();
    summary.id = companyDto.getCompany().getApiId().value();
    summary.number = companyDto.getCompany().getNumber();
    summary.legalName = companyDto.getCompany().getLegalName();
    summary.description = companyDto.getCompany().getDescription();
    summary.created = companyDto.getCompany().getCreated();
    summary.lastModified = companyDto.getCompany().getLastModified();
    summary.stage = companyDto.getCompany().getStage();
    summary.status = companyDto.getCompany().getStatus();
    summary.linkedApiId =
        (companyDto.getCompany().getLinkedApiId() != null)
            ? companyDto.getCompany().getLinkedApiId().getApiId()
            : null;
    if (companyDto.companyMembersDto != null)
      summary.members =
          companyDto.companyMembersDto.stream().map(CompanyMemberSummary::from).toList();

    summary.taxonomy =
        companyDto.getCompany().getTaxonomyTerms() != null
            ? companyDto.getCompany().getTaxonomyTerms().stream()
                .map(TaxonomySummary::from)
                .toList()
            : null;
    summary.fundraiseStatus = companyDto.getCompany().getFundraiseStatus();
    summary.href = companyDto.getCompany().getHref();
    summary.dashboardHref = companyDto.getCompany().getDashboardHref();
    summary.hasPlatformAgreement = companyDto.getCompany().getHasPlatformAgreement();
    if (companyDto.getCompany().getCompanyIpMarketplace() != null) {
      summary.activityType = companyDto.getCompany().getCompanyIpMarketplace().getActivityType();
      summary.organizationType =
          companyDto.getCompany().getCompanyIpMarketplace().getOrganizationType();
      summary.region = companyDto.getCompany().getCompanyIpMarketplace().getRegion();
    }
    return summary;
  }
}
