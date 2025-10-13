package com.redesignhealth.company.api.security;

import com.redesignhealth.company.api.entity.ref.CompanyRef;
import com.redesignhealth.company.api.entity.request.RoleAuthority;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

public class AuthChecks {

  public static RedesignUserDetails getPrincipal() {
    return (RedesignUserDetails)
        SecurityContextHolder.getContext().getAuthentication().getPrincipal();
  }

  public static boolean isAdmin(Authentication auth) {
    return hasRoleOrHigher(auth, RoleAuthority.ROLE_RH_ADMIN);
  }

  public static boolean hasRole(RoleAuthority role) {
    var auth = SecurityContextHolder.getContext().getAuthentication();
    return auth.getAuthorities().stream()
        .anyMatch((authority) -> RoleAuthority.valueOf(authority.getAuthority()) == role);
  }

  public static boolean hasRoleOrHigher(Authentication auth, RoleAuthority roleAuthority) {
    return auth.getAuthorities().stream()
        .map((a) -> RoleAuthority.valueOf(a.getAuthority()))
        .anyMatch((a) -> a.hasPermissionsOf(roleAuthority));
  }

  public static boolean isMember(Authentication auth, CompanyRef apiId, RoleAuthority role) {
    var user = (RedesignUserDetails) auth.getPrincipal();
    // admins are members of all companies
    if (isAdmin(auth)) {
      return true;
    }

    return user.getMemberOf().contains(apiId);
  }
}
