package com.redesignhealth.company.api.dto.command.vendor;

import com.redesignhealth.company.api.dto.SubcategorySummary;
import com.redesignhealth.company.api.dto.enums.CompanyVendorType;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotEmpty;
import java.util.List;
import java.util.Optional;
import lombok.Getter;

@Getter
public class VendorCommand {
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
  @NotEmpty
  protected List<SubcategorySummary> subcategories;

  @Schema(example = "VENDOR", requiredMode = Schema.RequiredMode.REQUIRED)
  private CompanyVendorType vendorType;

  @Schema(example = "longlongemail@domain.com")
  private Optional<String> vendorPointContact = Optional.empty();

  @Schema(example = "Lorem ipsum dolor sit amet consectetur.")
  private Optional<String> description = Optional.empty();

  @Schema(example = "Justo pulvinar est tortor ut pretium ultrices vitae penatibus libero.")
  private Optional<String> pros = Optional.empty();

  @Schema(example = "Justo pulvinar est tortor ut pretium ultrices vitae penatibus libero. ")
  private Optional<String> cons = Optional.empty();

  @Schema(example = "$3750/month for up to 35k patients")
  private Optional<String> pricing = Optional.empty();

  @Schema(example = "Risus pretium scelerisque egestas in")
  private Optional<String> discountInfo = Optional.empty();

  @Schema(example = "Odio consectetur feugiat in penatibus posuere.")
  private Optional<String> feedbackFromOpcos = Optional.empty();

  @Schema(example = "Viverra adipiscing hendrerit magna a a odio ac.")
  private Optional<String> features = Optional.empty();

  private Boolean hasPlatformAgreement;

  public VendorCommand() {}
}
