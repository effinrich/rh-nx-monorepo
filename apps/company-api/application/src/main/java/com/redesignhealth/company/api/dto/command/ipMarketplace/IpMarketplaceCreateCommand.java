package com.redesignhealth.company.api.dto.command.ipMarketplace;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;

@Getter
public class IpMarketplaceCreateCommand extends IpMarketplaceBaseCommand {
  @Schema(example = "6aBCde12", requiredMode = Schema.RequiredMode.REQUIRED)
  @NotBlank
  private String companyId;
}
