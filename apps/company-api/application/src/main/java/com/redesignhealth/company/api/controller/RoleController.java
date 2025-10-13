package com.redesignhealth.company.api.controller;

import com.redesignhealth.company.api.dto.RoleSummary;
import com.redesignhealth.company.api.entity.request.RoleAuthority;
import com.redesignhealth.company.api.openapi.IncludeSecurityHeaders;
import com.redesignhealth.company.api.security.AuthChecks;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.Arrays;
import java.util.Comparator;
import org.springframework.hateoas.CollectionModel;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@IncludeSecurityHeaders
@Tag(name = "Role")
public class RoleController {

  @Operation(summary = "Get all available user roles")
  @GetMapping("/role")
  public CollectionModel<RoleSummary> getAll() {
    return CollectionModel.of(Arrays.stream(RoleAuthority.values()).map(RoleSummary::from).toList())
        .withFallbackType(RoleSummary.class);
  }

  @Operation(summary = "Get which roles you can assign to others")
  @GetMapping("/me/role")
  public CollectionModel<RoleSummary> getAssignableRoles(Authentication authentication) {
    var filteredRoles =
        Arrays.stream(RoleAuthority.values())
            .filter(
                (r) ->
                    r != RoleAuthority.ROLE_SUPER_ADMIN
                        || AuthChecks.hasRoleOrHigher(
                            authentication, RoleAuthority.ROLE_SUPER_ADMIN))
            .filter((r) -> r != RoleAuthority.ROLE_OP_CO_CONTRACTOR)
            .sorted(Comparator.comparingInt(a -> -a.getInheritanceOrder()))
            .map(RoleSummary::from)
            .toList();

    return CollectionModel.of(filteredRoles).withFallbackType(RoleSummary.class);
  }
}
