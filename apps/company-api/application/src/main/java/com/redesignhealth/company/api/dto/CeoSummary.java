package com.redesignhealth.company.api.dto;

import com.redesignhealth.company.api.dto.enums.CompanyFundraiseStatus;
import com.redesignhealth.company.api.entity.Ceo;
import com.redesignhealth.company.api.entity.Company;
import com.redesignhealth.company.api.entity.Person;
import com.redesignhealth.company.api.util.EntityUtil;
import io.swagger.v3.oas.annotations.media.Schema;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import lombok.Builder;
import lombok.Getter;
import org.springframework.hateoas.RepresentationModel;

@Getter
@Builder
public class CeoSummary extends RepresentationModel<CeoSummary> {
  private static final String STEALTH_CO = "StealthCo";
  private CeoMemberOfSummary member;
  // CeoBusinessType SerializableEnum
  private SerializableEnum businessType;

  @Schema(example = "Atlanta")
  private String location;

  @Schema(example = "[\"California\"]")
  private List<String> marketServiceArea;

  // CeoCustomerSegment
  private List<SerializableEnum> customerSegment;
  // CeoHealthcareSector
  private SerializableEnum healthcareSector;
  // CeoBusinessFocusArea
  private List<SerializableEnum> businessFocusArea;
  private String pictureHref;

  @Schema(example = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do")
  private String bio;

  @Schema(example = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do")
  private String additionalInfo;

  // CeoVisible
  private SerializableEnum visible;

  @Schema(example = "https://example.com")
  private String linkedinHref;

  @Schema(example = "6nuT80li")
  private String id;

  @Schema(example = """
    {
      "title": "Research <em>Summary</em>"
    }
    """)
  private Map<String, List<String>> highlightedText;

  public static CeoSummary from(Ceo ceo, Person person) {
    var ceoSummary = CeoSummary.builder();
    setCeo(ceoSummary, ceo);
    var companyReducedInfo = createCompanyReducedInfo(EntityUtil.getFirstActiveMembership(person));
    var member =
        CeoMemberOfSummary.of(
            ceo.getEmail().value(),
            person.getGivenName(),
            person.getFamilyName(),
            companyReducedInfo);
    ceoSummary.member(member);
    return ceoSummary.build();
  }

  public static CeoSummary from(
      Ceo ceo, Optional<Company> company, String email, String givenName, String familyName) {
    var ceoSummary = CeoSummary.builder();
    setCeo(ceoSummary, ceo);
    var companyReducedInfo = createCompanyReducedInfo(company);
    var member = CeoMemberOfSummary.of(email, givenName, familyName, companyReducedInfo);
    ceoSummary.member(member);
    return ceoSummary.build();
  }

  // TO-DO: In another ticket migrate to the new static utils
  private static List<SerializableEnum> getValues(List<? extends SerializableEnum> values) {
    if (values == null) return List.of();
    return new ArrayList<>(values);
  }

  private static void setCeo(CeoSummary.CeoSummaryBuilder ceoSummary, Ceo ceo) {
    ceoSummary.id(ceo.getApiId().value());
    ceoSummary.bio(ceo.getBio());
    ceoSummary.additionalInfo(ceo.getAdditionalInfo());
    ceoSummary.businessFocusArea(getValues(ceo.getBusinessFocusArea()));
    ceoSummary.businessType(ceo.getBusinessType());
    ceoSummary.customerSegment(getValues(ceo.getCustomerSegment()));
    ceoSummary.healthcareSector(ceo.getHealthcareSector());
    ceoSummary.visible(ceo.getVisible());
    ceoSummary.pictureHref(ceo.getPictureHref());
    ceoSummary.location(ceo.getLocation());
    ceoSummary.linkedinHref(ceo.getLinkedinHref());
    ceoSummary.marketServiceArea(ceo.getMarketServiceArea());
    ceoSummary.highlightedText(ceo.getHighlightedText());
  }

  private static CompanyReducedInfo createCompanyReducedInfo(Optional<Company> company) {
    return company
        .map(
            value ->
                CompanyReducedInfo.of(
                    value.getApiId().value(),
                    (!value.getFundraiseStatus().equals(CompanyFundraiseStatus.PRE_LAUNCH_PHASE))
                        ? value.getName()
                        : STEALTH_CO,
                    value.getStage(),
                    value.getDescription(),
                    value.getHref(),
                    value.getFundraiseStatus()))
        .orElseGet(() -> CompanyReducedInfo.of());
  }
}
