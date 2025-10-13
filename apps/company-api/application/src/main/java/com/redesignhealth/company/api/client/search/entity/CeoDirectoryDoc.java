package com.redesignhealth.company.api.client.search.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.redesignhealth.company.api.dto.SerializableEnum;
import com.redesignhealth.company.api.entity.Ceo;
import com.redesignhealth.company.api.entity.Person;
import java.util.List;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class CeoDirectoryDoc {

  public static final String BUSINESS_TYPE = "business_type";
  public static final String MARKET_SERVICE_AREA = "market_service_area";
  public static final String CUSTOMER_SEGMENT = "customer_segment";
  public static final String HEALTHCARE_SECTOR = "healthcare_sector";
  public static final String BUSINESS_FOCUS_AREA = "business_focus_area";
  public static final String ADDITIONAL_INFO = "additional_info";
  public static final String MEMBER = "member";
  public static final String PICTURE_HREF = "picture_href";
  public static final String BIO = "bio";

  @JsonProperty(MEMBER) // not necessary , only to provide information to the service
  private MemberDoc member;

  @JsonProperty(BUSINESS_TYPE)
  private String businessType;

  private String location;

  @JsonProperty(MARKET_SERVICE_AREA)
  private List<String> marketServiceArea;

  @JsonProperty(CUSTOMER_SEGMENT)
  private List<String> customerSegment;

  @JsonProperty(HEALTHCARE_SECTOR)
  private String healthcareSector;

  @JsonProperty(BUSINESS_FOCUS_AREA)
  private List<String> businessFocusAreas;

  @JsonProperty(BIO)
  private String bio;

  @JsonProperty(ADDITIONAL_INFO)
  private String additionalInfo;

  private String visible;

  @JsonProperty(PICTURE_HREF)
  private String pictureHref;

  public static CeoDirectoryDoc from(Ceo ceo, Person person) {
    var doc = CeoDirectoryDoc.builder();
    doc.additionalInfo(ceo.getAdditionalInfo());
    doc.bio(ceo.getBio());
    doc.visible((ceo.getVisible() != null) ? ceo.getVisible().getValue() : null);
    doc.location(ceo.getLocation());
    doc.businessType(getDisplayNameFromEnum(ceo.getBusinessType()));
    doc.marketServiceArea(ceo.getMarketServiceArea());
    doc.customerSegment(getDisplayNameListFromEnum(ceo.getCustomerSegment()));
    doc.healthcareSector(getDisplayNameFromEnum(ceo.getHealthcareSector()));
    doc.businessFocusAreas(getDisplayNameListFromEnum(ceo.getBusinessFocusArea()));
    doc.member(MemberDoc.from(person));
    doc.pictureHref(ceo.getPictureHref());
    return doc.build();
  }

  private static String getDisplayNameFromEnum(SerializableEnum attribute) {
    return (attribute != null) ? attribute.getDisplayName() : null;
  }

  private static List<String> getDisplayNameListFromEnum(
      List<? extends SerializableEnum> attributes) {
    return (attributes != null)
        ? attributes.stream().map(SerializableEnum::getDisplayName).toList()
        : null;
  }
}
