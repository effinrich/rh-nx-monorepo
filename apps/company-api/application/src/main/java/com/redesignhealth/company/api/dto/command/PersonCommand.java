package com.redesignhealth.company.api.dto.command;

import com.redesignhealth.company.api.entity.request.RoleAuthority;
import io.swagger.v3.oas.annotations.media.Schema;
import java.util.Optional;
import lombok.Getter;

@Getter
public class PersonCommand {
  @Schema(example = "Brett")
  private String givenName;

  @Schema(example = "Shaheen")
  private String familyName;

  @Schema(example = "ROLE_RH_USER")
  private Optional<RoleAuthority> role = Optional.empty();
}
