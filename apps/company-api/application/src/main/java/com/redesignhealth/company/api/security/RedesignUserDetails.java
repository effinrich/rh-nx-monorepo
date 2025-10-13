package com.redesignhealth.company.api.security;

import com.redesignhealth.company.api.dto.enums.CompanyMemberStatus;
import com.redesignhealth.company.api.entity.Person;
import com.redesignhealth.company.api.entity.ref.CompanyRef;
import com.redesignhealth.company.api.entity.ref.PersonRef;
import java.util.Collection;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

public class RedesignUserDetails implements UserDetails {

  private PersonRef username;
  private Set<GrantedAuthority> roles;
  private Set<CompanyRef> memberOf;
  private Map<String, Object> metadata;

  public static RedesignUserDetails from(Person person) {
    var userDetails = new RedesignUserDetails();
    userDetails.username = person.getEmail();
    userDetails.roles =
        person.getRole() != null
            ? Set.of(new SimpleGrantedAuthority(person.getRole().name()))
            : Set.of();

    if (person.getMemberOf() != null) {
      userDetails.memberOf =
          person.getMemberOf().stream()
              .filter(member -> member.getStatus() == CompanyMemberStatus.ACTIVE)
              .map(x -> x.getCompany().getApiId())
              .collect(Collectors.toSet());
    }
    userDetails.metadata = new HashMap<>();
    return userDetails;
  }

  public Set<CompanyRef> getMemberOf() {
    return memberOf;
  }

  public Map<String, Object> getMetadata() {
    return metadata;
  }

  public void setMetadata(Map<String, Object> metadata) {
    this.metadata = metadata;
  }

  @Override
  public Collection<? extends GrantedAuthority> getAuthorities() {
    return roles;
  }

  @Override
  public String getPassword() {
    return null;
  }

  @Override
  public String getUsername() {
    return username.value();
  }

  @Override
  public boolean isAccountNonExpired() {
    return true;
  }

  @Override
  public boolean isAccountNonLocked() {
    return true;
  }

  @Override
  public boolean isCredentialsNonExpired() {
    return true;
  }

  @Override
  public boolean isEnabled() {
    return true;
  }
}
