package com.redesignhealth.company.api.service;

import com.redesignhealth.company.api.entity.ref.PersonRef;
import com.redesignhealth.company.api.expansion.Expansion;
import com.redesignhealth.company.api.repository.PersonRepository;
import com.redesignhealth.company.api.security.RedesignUserDetails;
import org.springframework.security.authentication.InsufficientAuthenticationException;
import org.springframework.stereotype.Service;

@Service
public class RedesignUserDetailsService {

  private final PersonRepository personRepository;

  public RedesignUserDetailsService(PersonRepository personRepository) {
    this.personRepository = personRepository;
  }

  public RedesignUserDetails loadUserByUsername(PersonRef username) {
    return personRepository
        .findByEmail(username, Expansion.MEMBER_OF)
        .map(RedesignUserDetails::from)
        .orElseThrow(() -> unknownEmail(username));
  }

  private InsufficientAuthenticationException unknownEmail(PersonRef email) {
    return new InsufficientAuthenticationException(
        (String.format("Person %s does not exist in our system", email)));
  }
}
