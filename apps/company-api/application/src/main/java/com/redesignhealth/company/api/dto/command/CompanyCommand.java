package com.redesignhealth.company.api.dto.command;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.redesignhealth.company.api.dto.enums.CompanyFundraiseStatus;
import com.redesignhealth.company.api.dto.enums.CompanyIPMarketplaceOrganizationType;
import com.redesignhealth.company.api.dto.enums.CompanyIPMarketplaceRegion;
import com.redesignhealth.company.api.dto.enums.CompanyIPMarketplaceType;
import com.redesignhealth.company.api.dto.enums.CompanyStage;
import com.redesignhealth.company.api.dto.enums.CompanyStatus;
import com.redesignhealth.company.api.entity.ref.CompanyRef;
import com.redesignhealth.company.api.entity.ref.TaxonomyRef;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import java.util.Optional;
import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class CompanyCommand {
  public static final String TAXONOMY_FIELD = "taxonomy";

  @Schema(example = "3")
  private Long number;

  @Schema(example = "Ever/Body, Inc.")
  private String legalName;

  @Schema(example = "Ever/Body", requiredMode = Schema.RequiredMode.REQUIRED)
  @NotBlank
  private String name;

  @Schema(
      example =
          "Ever/Body was founded to demystify cosmetic dermatology and make it more accessible.")
  private String description;

  @Schema(example = "THEME")
  private Optional<CompanyStage> stage;

  @Schema(example = "ACTIVE")
  private Optional<CompanyStatus> status;

  @Schema(example = "6aBCde12")
  private Optional<CompanyRef> linkedApiId;

  @Schema(example = "CARE_TEAM_COORDINATION")
  @JsonProperty(TAXONOMY_FIELD)
  private Optional<TaxonomyRef> taxonomyId;

  @Schema(example = "true")
  private Optional<Boolean> createGFolder;

  private Optional<CompanyFundraiseStatus> fundraiseStatus;

  @Schema(example = "https://example.com")
  private Optional<String> href;

  @Schema(example = "https://example.com")
  private Optional<String> dashboardHref;

  @Schema(example = "true")
  private Optional<Boolean> hasPlatformAgreement;

  @Schema(example = "ENTERPRISE_SELLER")
  private Optional<CompanyIPMarketplaceType> activityType;

  @Schema(example = "DN_HEALTH_SYSTEM")
  private Optional<CompanyIPMarketplaceOrganizationType> organizationType;

  @Schema(example = "NORTHEAST")
  private Optional<CompanyIPMarketplaceRegion> region;

  @JsonIgnore
  public Boolean isIpMarketPlace() {
    return activityType.isPresent();
  }

  @JsonIgnore
  public Boolean isRHCompany() {
    return activityType.isEmpty();
  }

  public Boolean areMissingIpMarketPlaceFields() {
    return region.isEmpty() || organizationType.isEmpty();
  }
}
