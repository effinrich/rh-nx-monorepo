package com.redesignhealth.company.api.client.search.entity;

import static com.redesignhealth.company.api.util.Transformation.getValueListFromEnum;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.redesignhealth.company.api.entity.IpMarketplace;
import java.time.Instant;
import java.util.List;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class IpMarketplaceSearchDoc {
  public static final String CREATED_DATE = "created_date";
  public static final String DISEASE = "disease";
  public static final String EXECUTIVE_SUMMARY = "executive_summary";
  public static final String NAME = "name";
  public static final String ORGAN_OF_FOCUS = "organ_of_focus";
  public static final String ORGANIZATION_TYPE = "organization_type";
  public static final String REGION = "region";
  public static final String SPECIALITIES = "specialities";
  public static final String TECHNOLOGY_TYPE = "technology_type";
  public static final String COMPANY_ID = "company_id";

  public static final String STATUS = "status";

  @JsonProperty(CREATED_DATE)
  private Instant createdDate;

  @JsonProperty(DISEASE)
  private String disease;

  @JsonProperty(EXECUTIVE_SUMMARY)
  private String executiveSummary;

  @JsonProperty(NAME)
  private String name;

  @JsonProperty(ORGAN_OF_FOCUS)
  private List<String> organOfFocus;

  @JsonProperty(ORGANIZATION_TYPE)
  private String organizationType;

  @JsonProperty(REGION)
  private String region;

  @JsonProperty(SPECIALITIES)
  private List<String> specialities;

  @JsonProperty(TECHNOLOGY_TYPE)
  private List<String> technologyType;

  @JsonProperty(COMPANY_ID)
  private String companyId;

  @JsonProperty(STATUS)
  private String status;

  public static IpMarketplaceSearchDoc from(IpMarketplace ipMarketplace) {
    var iPMarketplaceDoc = IpMarketplaceSearchDoc.builder();
    iPMarketplaceDoc.createdDate(ipMarketplace.getCreated());
    iPMarketplaceDoc.disease(ipMarketplace.getDisease());
    iPMarketplaceDoc.executiveSummary(ipMarketplace.getExecutiveSummary());
    iPMarketplaceDoc.name(ipMarketplace.getName());
    iPMarketplaceDoc.organOfFocus(getValueListFromEnum(ipMarketplace.getOrganOfFocus()));
    iPMarketplaceDoc.organizationType(
        ipMarketplace.getCompanyIpMarketplace().getOrganizationType().getValue());
    iPMarketplaceDoc.region(ipMarketplace.getCompanyIpMarketplace().getRegion().getValue());
    iPMarketplaceDoc.specialities(getValueListFromEnum(ipMarketplace.getSpeciality()));
    iPMarketplaceDoc.technologyType(getValueListFromEnum(ipMarketplace.getTechnologyType()));
    iPMarketplaceDoc.companyId(
        ipMarketplace.getCompanyIpMarketplace().getCompany().getApiId().value());
    iPMarketplaceDoc.status(ipMarketplace.getStatus().getValue());
    return iPMarketplaceDoc.build();
  }
}
