package com.redesignhealth.company.api.dto;

import com.redesignhealth.company.api.entity.IpMarketplace;
import com.redesignhealth.company.api.util.Transformation;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import java.time.Instant;
import java.util.List;
import lombok.Getter;
import org.springframework.hateoas.RepresentationModel;

@Getter
public class IpMarketplaceSummary extends RepresentationModel<CeoSummary> {
  IpMarketplaceOrganizationSummary organization;
  PersonReducedInfo owner;

  @Schema(example = "Marvelous Idea")
  @NotBlank
  private String name;

  @Schema(
      example =
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididun")
  @NotBlank
  private String executiveSummary;

  @Schema(
      example =
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididun")
  private String therapeuticNeedOrTrendsBeingAddressed;

  @Schema(
      example =
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididun")
  private String technologyOverview;

  @Schema(example = "true")
  private Boolean licenseRestriction;

  @Schema(
      example =
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididun")
  private String aboutLicenseRestriction;

  private List<SerializableEnum> preferredTerms;

  @Schema(
      example =
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididun")
  private String preferredTermsOther;

  @Schema(
      example =
          """
      [{
      "href": "https://example.com",
      "name": "report_url"
      }]
      """)
  private List<LinkRef> associatedFilesOrMedia;

  private SerializableEnum patentStatus;
  private Instant patentIssueDate;
  private List<SerializableEnum> patentGeographicValidity;

  @Schema(
      example =
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididun")
  private String patentGeographicValidityOther;

  @Schema(
      example =
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididun")
  private String patentStatusOtherInfo;

  @Schema(
      example =
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididun")
  @NotBlank
  private String disease;

  @NotBlank private List<SerializableEnum> organOfFocus;

  @NotBlank private List<SerializableEnum> technologyType;
  private List<SerializableEnum> speciality;

  @Schema(
      example =
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididun")
  private String sellerSummaryTechTransferApproach;

  @Schema(example = "John Smith")
  private String responsibleInventor;

  private List<SerializableEnum> technologyLevelOfMaturity;

  @Schema(example = "https://example.com")
  private String patentStatusHref;

  private SerializableEnum freedomToOperateCertification;
  private String id;

  private IpMarketplaceMetrics metrics;
  private List<IpMarketplaceRequestContactInfo> requestContactInfo;

  @Schema(example = "true")
  private boolean legalPatentabilityAssessmentAvailable;

  @Schema(example = "true")
  private boolean copyrighted;

  @Schema(example = "ACTIVE")
  private SerializableEnum status;

  @Schema(example = "true")
  private boolean viewed;

  public static IpMarketplaceSummary from(IpMarketplace ipMarketplace) {
    var summary = new IpMarketplaceSummary();
    var companyIpMarketplace = ipMarketplace.getCompanyIpMarketplace();
    var company = companyIpMarketplace.getCompany();
    var owner = ipMarketplace.getIpMarketplaceSeller().getSeller();
    summary.organization =
        IpMarketplaceOrganizationSummary.of(
            company.getName(),
            companyIpMarketplace.getActivityType(),
            companyIpMarketplace.getOrganizationType(),
            companyIpMarketplace.getRegion());
    summary.owner =
        PersonReducedInfo.of(owner.getEmail().value(), owner.getGivenName(), owner.getFamilyName());
    summary.name = ipMarketplace.getName();
    summary.executiveSummary = ipMarketplace.getExecutiveSummary();
    summary.therapeuticNeedOrTrendsBeingAddressed =
        ipMarketplace.getTherapeuticNeedOrTrendsBeingAddressed();
    summary.technologyOverview = ipMarketplace.getTechnologyOverview();
    summary.licenseRestriction = ipMarketplace.getLicenseRestriction();
    summary.aboutLicenseRestriction = ipMarketplace.getAboutLicenseRestriction();
    summary.preferredTerms =
        Transformation.getValuesFromSerializableEnum(ipMarketplace.getPreferredTerms());
    summary.preferredTermsOther = ipMarketplace.getPreferredTermsOther();
    summary.associatedFilesOrMedia = ipMarketplace.getAssociatedFilesOrMedia();
    summary.patentStatus = ipMarketplace.getPatentStatus();
    summary.patentIssueDate = ipMarketplace.getPatentIssueDate();
    summary.patentGeographicValidity =
        Transformation.getValuesFromSerializableEnum(ipMarketplace.getPatentGeographicValidity());
    summary.patentGeographicValidityOther = ipMarketplace.getPatentGeographicValidityOther();
    summary.patentStatusOtherInfo = ipMarketplace.getPatentStatusOtherInfo();
    summary.disease = ipMarketplace.getDisease();
    summary.organOfFocus =
        Transformation.getValuesFromSerializableEnum(ipMarketplace.getOrganOfFocus());
    summary.speciality =
        Transformation.getValuesFromSerializableEnum(ipMarketplace.getSpeciality());
    summary.sellerSummaryTechTransferApproach =
        ipMarketplace.getSellerSummaryTechTransferApproach();
    summary.responsibleInventor = ipMarketplace.getResponsibleInventor();
    summary.technologyLevelOfMaturity =
        Transformation.getValuesFromSerializableEnum(ipMarketplace.getTechnologyLevelOfMaturity());
    summary.patentStatusHref = ipMarketplace.getPatentStatusHref();
    summary.freedomToOperateCertification = ipMarketplace.getFreedomToOperateCertification();
    summary.technologyType =
        Transformation.getValuesFromSerializableEnum(ipMarketplace.getTechnologyType());
    summary.id = ipMarketplace.getApiId().value();
    summary.copyrighted = ipMarketplace.isCopyrighted();
    summary.legalPatentabilityAssessmentAvailable =
        ipMarketplace.isLegalPatentabilityAssessmentAvailable();
    summary.status = ipMarketplace.getStatus();
    summary.viewed = true;
    return summary;
  }

  public static IpMarketplaceSummary from(
      IpMarketplace ipMarketplace,
      IpMarketplaceMetrics ipMarketplaceMetrics,
      List<IpMarketplaceRequestContactInfo> ipMarketplaceRequestContactInfos,
      boolean isABuyer) {
    var summary = from(ipMarketplace, isABuyer);
    summary.metrics = ipMarketplaceMetrics;
    summary.requestContactInfo = ipMarketplaceRequestContactInfos;
    return summary;
  }

  public static IpMarketplaceSummary from(
      IpMarketplace ipMarketplace,
      IpMarketplaceMetrics ipMarketplaceMetrics,
      List<IpMarketplaceRequestContactInfo> ipMarketplaceRequestContactInfos,
      boolean isABuyer,
      boolean viewed) {
    var summary =
        from(ipMarketplace, ipMarketplaceMetrics, ipMarketplaceRequestContactInfos, isABuyer);
    summary.viewed = viewed;
    return summary;
  }

  public static IpMarketplaceSummary from(IpMarketplace ipMarketplace, boolean isABuyer) {
    var summary = from(ipMarketplace);
    if (isABuyer) summary.owner = null;
    return summary;
  }
}
