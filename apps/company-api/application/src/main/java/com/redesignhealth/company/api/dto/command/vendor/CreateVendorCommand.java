package com.redesignhealth.company.api.dto.command.vendor;

import com.redesignhealth.company.api.dto.SubcategorySummary;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotEmpty;
import java.util.List;
import lombok.Getter;

@Getter
public class CreateVendorCommand extends VendorCommand {

  @NotEmpty
  @Schema(example = "Apple, Inc.", requiredMode = Schema.RequiredMode.REQUIRED)
  private String name;

  public static CreateVendorCommand of(String name, List<SubcategorySummary> subcategories) {
    var command = new CreateVendorCommand();
    command.name = name;
    command.subcategories = subcategories;
    return command;
  }
}
