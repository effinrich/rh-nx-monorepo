package com.redesignhealth.company.api.dto.command.ipMarketplace;

import com.redesignhealth.company.api.dto.LinkRef;
import com.redesignhealth.company.api.dto.enums.IpMarketplaceFreedomToOperateCertification;
import com.redesignhealth.company.api.dto.enums.IpMarketplaceOrganOfFocus;
import com.redesignhealth.company.api.dto.enums.IpMarketplacePatentGeographyValidity;
import com.redesignhealth.company.api.dto.enums.IpMarketplacePatentStatus;
import com.redesignhealth.company.api.dto.enums.IpMarketplacePreferredTerms;
import com.redesignhealth.company.api.dto.enums.IpMarketplaceSpeciality;
import com.redesignhealth.company.api.dto.enums.IpMarketplaceStatus;
import com.redesignhealth.company.api.dto.enums.IpMarketplaceTechnologyLevelOfMaturity;
import com.redesignhealth.company.api.dto.enums.IpMarketplaceTechnologyType;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import java.time.Instant;
import java.util.List;
import lombok.Getter;
import lombok.Setter;

@Getter
public class IpMarketplaceBaseCommand {
  @Schema(example = "rh@redesinghealth.com")
  @NotBlank
  @Setter
  private String email;

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
  @NotBlank
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

  @NotEmpty private List<IpMarketplacePreferredTerms> preferredTerms;

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

  private IpMarketplacePatentStatus patentStatus;
  private Instant patentIssueDate;
  @NotEmpty private List<IpMarketplacePatentGeographyValidity> patentGeographicValidity;

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

  private List<IpMarketplaceOrganOfFocus> organOfFocus;

  @NotEmpty private List<IpMarketplaceTechnologyType> technologyType;
  private List<IpMarketplaceSpeciality> speciality;

  @Schema(
      example =
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididun")
  private String sellerSummaryTechTransferApproach;

  @Schema(example = "John Smith")
  @NotBlank
  private String responsibleInventor;

  @NotEmpty private List<IpMarketplaceTechnologyLevelOfMaturity> technologyLevelOfMaturity;

  @Schema(example = "https://example.com")
  @NotBlank
  private String patentStatusHref;

  private IpMarketplaceFreedomToOperateCertification freedomToOperateCertification;

  @Schema(example = "true")
  private boolean legalPatentabilityAssessmentAvailable;

  @Schema(example = "true")
  private boolean copyrighted;

  @Schema(example = "ACTIVE")
  private IpMarketplaceStatus status;
}
