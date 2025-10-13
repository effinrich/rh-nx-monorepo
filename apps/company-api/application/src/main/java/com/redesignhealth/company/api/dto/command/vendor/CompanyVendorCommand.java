package com.redesignhealth.company.api.dto.command.vendor;

import com.redesignhealth.company.api.dto.SubcategorySummary;
import com.redesignhealth.company.api.dto.enums.CompanyVendorEngagementStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotEmpty;
import java.time.Instant;
import java.util.List;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CompanyVendorCommand {

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

  private CompanyVendorEngagementStatus engagementStatus;
  private Instant startDate;
  private Instant endDate;
  private Boolean willingToDiscuss;

  public CompanyVendorCommand() {}

  public static CompanyVendorCommand of(List<SubcategorySummary> subcategories) {
    var companyVendorUpdateCommand = new CompanyVendorCommand();
    companyVendorUpdateCommand.subcategories = subcategories;
    return companyVendorUpdateCommand;
  }
}
