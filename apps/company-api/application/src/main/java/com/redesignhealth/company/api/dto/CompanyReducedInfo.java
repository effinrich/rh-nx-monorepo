package com.redesignhealth.company.api.dto;

import com.redesignhealth.company.api.dto.enums.CompanyFundraiseStatus;
import com.redesignhealth.company.api.dto.enums.CompanyStage;
import com.redesignhealth.company.api.entity.Company;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;

@Getter
public class CompanyReducedInfo {

  @Schema(example = "6aBCde12", requiredMode = Schema.RequiredMode.REQUIRED)
  private final String id;

  @Schema(example = "Ever/Body")
  private final String name;

  private final CompanyStage stage;

  @Schema(
      example =
          "Ever/Body was founded to demystify cosmetic dermatology and make it more accessible.")
  private final String description;

  @Schema(example = "https://example.com")
  private final String href;

  // CompanyFundraiseStatus
  private final SerializableEnum fundraiseStatus;

  private CompanyReducedInfo(String id, String name, CompanyStage stage) {
    this.id = id;
    this.name = name;
    this.stage = stage;
    this.description = null;
    this.href = null;
    this.fundraiseStatus = null;
  }

  private CompanyReducedInfo() {
    this.id = null;
    this.name = null;
    this.stage = null;
    this.description = null;
    this.href = null;
    this.fundraiseStatus = null;
  }

  private CompanyReducedInfo(
      String id,
      String name,
      CompanyStage stage,
      String description,
      String href,
      CompanyFundraiseStatus fundraiseStatus) {
    this.id = id;
    this.name = name;
    this.stage = stage;
    this.description = description;
    this.href = href;
    this.fundraiseStatus = fundraiseStatus;
  }

  public static CompanyReducedInfo of(
      String companyId,
      String companyName,
      CompanyStage companyStage,
      String description,
      String href,
      CompanyFundraiseStatus fundraiseStatus) {
    return new CompanyReducedInfo(
        companyId, companyName, companyStage, description, href, fundraiseStatus);
  }

  public static CompanyReducedInfo of() {
    return new CompanyReducedInfo();
  }

  public static CompanyReducedInfo from(Company company) {
    return new CompanyReducedInfo(
        company.getApiId().value(), company.getName(), company.getStage());
  }
}
