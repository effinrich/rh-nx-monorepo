package com.redesignhealth.company.api.dto;

import com.redesignhealth.company.api.dto.enums.CompanyVendorType;
import com.redesignhealth.company.api.entity.vendor.Vendor;
import io.swagger.v3.oas.annotations.media.Schema;
import java.time.Instant;
import java.util.List;
import lombok.Getter;
import org.springframework.hateoas.RepresentationModel;

@Getter
public class VendorSummary extends RepresentationModel<VendorSummary> {

  @Schema(example = "Boomset", requiredMode = Schema.RequiredMode.REQUIRED)
  private String name;

  private List<VendorPersonReducedInfo> contacts;

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

  @Schema(example = "$3750/month")
  private String pricing;

  @Schema(example = "1KlMnh9a")
  private String apiId;

  private CompanyVendorType vendorType;

  @Schema(example = "test@example.com")
  private String vendorPointContact;

  @Schema(example = "Lorem ipsum dolor sit amet consectetur.")
  private String description;

  @Schema(example = "Justo pulvinar est tortor ut pretium ultrices vitae penatibus libero.")
  private String pros;

  @Schema(example = "Justo pulvinar est tortor ut pretium ultrices vitae penatibus libero. ")
  private String cons;

  @Schema(example = "Risus pretium scelerisque egestas in")
  private String discountInfo;

  @Schema(example = "Odio consectetur feugiat in penatibus posuere.")
  private String feedbackFromOpCos;

  @Schema(example = "Viverra adipiscing hendrerit magna a a odio ac.")
  private String features;

  private Boolean hasPlatformAgreement;

  private Instant created;

  private Instant lastModified;

  public static VendorSummary from(Vendor vendor) {
    var summary = new VendorSummary();
    summary.apiId = (vendor.getApiId() != null) ? vendor.getApiId().value() : "";
    summary.name = vendor.getName();
    if (vendor.getSubcategories() != null && vendor.getSubcategories().size() > 0) {
      summary.subcategories =
          vendor.getSubcategories().stream().map(SubcategorySummary::from).toList();
    }
    if (vendor.getCompanyContacts() != null) {
      summary.contacts =
          vendor.getCompanyContacts().stream()
              .map(
                  x ->
                      VendorPersonReducedInfo.of(
                          x.getPerson().getEmail().getEmail(),
                          x.getPerson().getGivenName(),
                          x.getPerson().getFamilyName(),
                          x.getWillingToDiscuss()))
              .toList();
    }
    summary.pricing = vendor.getPricing();
    summary.vendorPointContact = vendor.getVendorPointContact();
    summary.vendorType = vendor.getVendorType();
    summary.description = vendor.getDescription();
    summary.pros = vendor.getPros();
    summary.discountInfo = vendor.getDiscountInfo();
    summary.feedbackFromOpCos = vendor.getFeedbackFromOpcos();
    summary.cons = vendor.getCons();
    summary.features = vendor.getFeatures();
    summary.hasPlatformAgreement = vendor.getHasPlatformAgreement();
    summary.lastModified = vendor.getLastModified();
    summary.created = vendor.getCreated();
    return summary;
  }

  public static VendorSummary from(Vendor vendor, String pricing) {
    var summary = from(vendor);
    summary.pricing = pricing;
    return summary;
  }
}
