package com.redesignhealth.company.api.dto.command;

import com.redesignhealth.company.api.dto.enums.CompanyMemberStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import java.util.Optional;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CompanyMemberCommand {
  @Schema(example = "ACTIVE")
  private Optional<CompanyMemberStatus> status;

  public CompanyMemberCommand() {}
}
