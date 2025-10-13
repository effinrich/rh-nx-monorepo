package com.redesignhealth.company.api.util;

import com.redesignhealth.company.api.dto.enums.CompanyMemberStatus;
import com.redesignhealth.company.api.entity.Company;
import com.redesignhealth.company.api.entity.CompanyMember;
import com.redesignhealth.company.api.entity.Person;
import com.redesignhealth.company.api.exception.CompanyNotFoundException;
import java.util.Optional;

public class EntityUtil {
  public static Optional<Company> getFirstActiveMembership(Person person) {
    var membership =
        person.getMemberOf().stream()
            .filter(m -> m.getStatus().equals(CompanyMemberStatus.ACTIVE))
            .findFirst();
    return membership.map(CompanyMember::getCompany);
  }

  public static Company getCompanyFromFirstCompanyMember(Person person) {
    var company = getFirstActiveMembership(person);
    return company.orElseThrow(CompanyNotFoundException::new);
  }
}
