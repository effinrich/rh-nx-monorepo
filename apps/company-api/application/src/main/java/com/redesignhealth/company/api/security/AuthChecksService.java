package com.redesignhealth.company.api.security;

import com.redesignhealth.company.api.dto.command.PersonRequestCommand;
import com.redesignhealth.company.api.entity.Company;
import com.redesignhealth.company.api.entity.ref.CompanyRef;
import com.redesignhealth.company.api.entity.request.RoleAuthority;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service("authChecks")
public class AuthChecksService {

  public boolean isAdmin(Authentication auth) {
    return AuthChecks.isAdmin(auth);
  }

  public boolean isMember(
      Authentication authentication, PersonRequestCommand command, RoleAuthority role) {
    return command.getCompanies().stream()
        .map(CompanyRef::of)
        .allMatch((company) -> isMember(authentication, company, role));
  }

  /** Check if authorized user is a member of a given {@link Company} */
  public boolean isMember(Authentication authentication, CompanyRef company, RoleAuthority role) {
    return AuthChecks.isMember(authentication, company, role);
  }

  public boolean hasRoleOrHigher(Authentication auth, RoleAuthority role) {
    return AuthChecks.hasRoleOrHigher(auth, role);
  }
}
