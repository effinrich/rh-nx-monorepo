package com.redesignhealth.company.api.dto.command.vendor;

import com.redesignhealth.company.api.dto.SubcategorySummary;
import com.redesignhealth.company.api.entity.vendor.Vendor;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotEmpty;
import java.util.List;
import lombok.Getter;

@Getter
public class CreateCompanyVendorCommand extends CompanyVendorCommand {

  /** Special field used to check if a parent {@link Vendor} exists/should be created */
  @NotEmpty
  @Schema(example = "Apple, Inc.", requiredMode = Schema.RequiredMode.REQUIRED)
  private String name;

  public static CreateCompanyVendorCommand of(String name, List<SubcategorySummary> subcategories) {
    var summary = new CreateCompanyVendorCommand();
    summary.name = name;
    summary.subcategories = subcategories;
    return summary;
  }
}
