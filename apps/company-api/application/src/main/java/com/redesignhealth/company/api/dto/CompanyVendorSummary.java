package com.redesignhealth.company.api.dto;

import com.redesignhealth.company.api.dto.enums.CompanyVendorEngagementStatus;
import com.redesignhealth.company.api.entity.vendor.CompanyVendor;
import io.swagger.v3.oas.annotations.media.Schema;
import java.time.Instant;
import java.util.List;
import lombok.Getter;
import org.hibernate.Hibernate;
import org.springframework.hateoas.RepresentationModel;

@Getter
public class CompanyVendorSummary extends RepresentationModel<CompanyVendorSummary> {

  @Schema(example = "1KlMnh9a", requiredMode = Schema.RequiredMode.REQUIRED)
  private String id;

  @Schema(example = "Apple, Inc.", requiredMode = Schema.RequiredMode.REQUIRED)
  private String name;

  private Instant startDate;
  private Instant endDate;
  private CompanyVendorEngagementStatus engagementStatus;

  @Schema(
      example =
          """
[{
"category": {
  "apiId": "Lf0ED5AA",
  "name": "Infrastructure"
},
"apiId": "Zn17uxiy",
"name": "Admin Tools"
}]
""")
  private List<SubcategorySummary> subcategories;

  private List<VendorPersonReducedInfo> contacts;

  public static CompanyVendorSummary from(CompanyVendor companyVendor) {
    var summary = new CompanyVendorSummary();
    summary.id = companyVendor.getApiId().value();
    summary.name = companyVendor.getVendor().getName();
    summary.startDate = companyVendor.getStartDate();
    summary.endDate = companyVendor.getEndDate();
    summary.engagementStatus = companyVendor.getEngagementStatus();

    if (Hibernate.isInitialized(companyVendor.getContacts())) {
      summary.contacts =
          companyVendor.getContacts().stream()
              .map(
                  contact ->
                      VendorPersonReducedInfo.of(
                          contact.getPerson().getEmail().value(),
                          contact.getPerson().getGivenName(),
                          contact.getPerson().getFamilyName(),
                          contact.getWillingToDiscuss()))
              .toList();
    }
    if (companyVendor.getSubcategories() != null) {
      summary.subcategories =
          companyVendor.getSubcategories().stream().map(SubcategorySummary::from).toList();
    }
    return summary;
  }
}
