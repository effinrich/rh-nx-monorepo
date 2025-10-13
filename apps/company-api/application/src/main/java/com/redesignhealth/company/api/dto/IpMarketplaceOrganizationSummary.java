package com.redesignhealth.company.api.dto;

import com.redesignhealth.company.api.dto.enums.CompanyIPMarketplaceOrganizationType;
import com.redesignhealth.company.api.dto.enums.CompanyIPMarketplaceRegion;
import com.redesignhealth.company.api.dto.enums.CompanyIPMarketplaceType;
import lombok.Getter;

@Getter
public class IpMarketplaceOrganizationSummary {
  private String name;
  private SerializableEnum activityType;
  private SerializableEnum organizationType;
  private SerializableEnum region;

  public static IpMarketplaceOrganizationSummary of(
      String name,
      CompanyIPMarketplaceType activityTpe,
      CompanyIPMarketplaceOrganizationType organizationType,
      CompanyIPMarketplaceRegion region) {
    var summary = new IpMarketplaceOrganizationSummary();
    summary.name = name;
    summary.activityType = activityTpe;
    summary.organizationType = organizationType;
    summary.region = region;
    return summary;
  }
}
