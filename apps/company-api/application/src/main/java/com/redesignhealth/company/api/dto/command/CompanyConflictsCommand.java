package com.redesignhealth.company.api.dto.command;

import com.redesignhealth.company.api.entity.ref.CompanyRef;
import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CompanyConflictsCommand {
  @Schema(example = "[\"sdjha7eS\"]")
  private List<CompanyRef> conflicts;

  public CompanyConflictsCommand() {}
}
