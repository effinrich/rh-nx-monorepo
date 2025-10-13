package com.redesignhealth.company.api.dto;

import com.redesignhealth.company.api.entity.request.RoleAuthority;
import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "Role")
public class RoleSummary {
  @Schema(example = "ROLE_RH_ADMIN", requiredMode = Schema.RequiredMode.REQUIRED)
  public RoleAuthority authority;

  @Schema(example = "Admin", requiredMode = Schema.RequiredMode.REQUIRED)
  public String displayName;

  public static RoleSummary from(RoleAuthority role) {
    var summary = new RoleSummary();
    summary.authority = role;
    summary.displayName = role.getDisplayName();
    return summary;
  }

  public RoleAuthority getAuthority() {
    return authority;
  }

  public String getDisplayName() {
    return displayName;
  }
}
