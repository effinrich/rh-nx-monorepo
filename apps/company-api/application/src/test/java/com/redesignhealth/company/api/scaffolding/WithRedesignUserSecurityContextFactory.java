package com.redesignhealth.company.api.scaffolding;

import com.redesignhealth.company.api.dto.enums.CompanyMemberStatus;
import com.redesignhealth.company.api.entity.Company;
import com.redesignhealth.company.api.entity.CompanyMember;
import com.redesignhealth.company.api.entity.Person;
import com.redesignhealth.company.api.entity.ref.PersonRef;
import com.redesignhealth.company.api.security.RedesignUserDetails;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.test.context.support.WithSecurityContextFactory;

public class WithRedesignUserSecurityContextFactory
    implements WithSecurityContextFactory<WithRedesignUser> {
  @Override
  public SecurityContext createSecurityContext(WithRedesignUser customUser) {
    SecurityContext context = SecurityContextHolder.createEmptyContext();
    Person person = Person.from(PersonRef.of(customUser.email()));
    person.setRole(customUser.role());
    var memberOf =
        Stream.of(customUser.memberOf())
            .map(
                member ->
                    new CompanyMember(Company.from(member), person, CompanyMemberStatus.ACTIVE))
            .collect(Collectors.toSet());

    person.setMemberOf(memberOf);
    RedesignUserDetails principal = RedesignUserDetails.from(person);
    principal.getMetadata().put("picture", customUser.picture());
    Authentication auth =
        new UsernamePasswordAuthenticationToken(principal, null, principal.getAuthorities());
    context.setAuthentication(auth);
    return context;
  }
}
