package com.redesignhealth.company.api.security;

import static com.redesignhealth.company.api.scaffolding.Fixtures.testCompany;
import static com.redesignhealth.company.api.scaffolding.Fixtures.testPerson;
import static org.assertj.core.api.Assertions.assertThat;

import com.redesignhealth.company.api.dto.enums.CompanyMemberStatus;
import com.redesignhealth.company.api.entity.CompanyMember;
import com.redesignhealth.company.api.entity.request.RoleAuthority;
import java.util.Set;
import org.junit.jupiter.api.Test;

public class RedesignUserDetailsTests {

  @Test
  public void testConstructor_onlyIncludesActiveMembers() {
    var person = testPerson();
    var company = testCompany();
    var activeMember = new CompanyMember(company, person, CompanyMemberStatus.ACTIVE);
    var inactiveMember = new CompanyMember(company, person, CompanyMemberStatus.INACTIVE);
    person.setMemberOf(Set.of(activeMember, inactiveMember));
    var userDetails = RedesignUserDetails.from(person);

    assertThat(userDetails.getMemberOf().size()).isEqualTo(1);
  }

  @Test
  public void testConstructor_ignoresMembersIfNull() {
    var person = testPerson();
    person.setMemberOf(null);
    var userDetails = RedesignUserDetails.from(person);

    assertThat(userDetails.getMemberOf()).isNull();
  }

  @Test
  public void testConstructor_setsRoles() {
    var person = testPerson();
    person.setRole(RoleAuthority.ROLE_OP_CO_USER);
    var userDetails = RedesignUserDetails.from(person);

    assertThat(userDetails.getAuthorities().size()).isEqualTo(1);
    assertThat(userDetails.getAuthorities().iterator().next().getAuthority())
        .isEqualTo("ROLE_OP_CO_USER");
  }

  @Test
  public void testConstructor_handlesNullRole() {
    var person = testPerson();
    person.setRole(null);
    var userDetails = RedesignUserDetails.from(person);

    assertThat(userDetails.getAuthorities()).isEmpty();
  }

  @Test
  public void testConstructor_setsEmailToUsername() {
    var person = testPerson();
    person.setRole(RoleAuthority.ROLE_OP_CO_USER);
    var userDetails = RedesignUserDetails.from(person);

    assertThat(userDetails.getUsername()).isEqualTo("test@redesignhealth.com");
  }
}
