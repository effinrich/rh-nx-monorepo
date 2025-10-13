package com.redesignhealth.company.api.service;

import com.redesignhealth.company.api.controller.ConsentCommand;
import com.redesignhealth.company.api.entity.Consent;
import com.redesignhealth.company.api.entity.Person;
import com.redesignhealth.company.api.entity.ref.PersonRef;
import com.redesignhealth.company.api.exception.ConsentNotFoundException;
import com.redesignhealth.company.api.exception.PersonNotFoundException;
import com.redesignhealth.company.api.repository.ConsentRepository;
import com.redesignhealth.company.api.repository.PersonRepository;
import com.redesignhealth.company.api.security.RedesignUserDetails;
import jakarta.transaction.Transactional;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class ConsentService {

  private final ConsentRepository consentRepository;
  private final PersonRepository personRepository;

  public ConsentService(ConsentRepository consentRepository, PersonRepository personRepository) {
    this.consentRepository = consentRepository;
    this.personRepository = personRepository;
  }

  @Transactional
  public Consent upsert(Consent.Type type, ConsentCommand command) {
    var person = getPrincipal();

    var consent = consentRepository.findByTypeAndPerson(type, person).orElse(Consent.of(type));

    consent.setVersion(command.getVersion());
    consent.setAccepted(command.getAccepted());
    consent.setPerson(person);
    return consentRepository.save(consent);
  }

  public Consent get(Consent.Type type) {
    return consentRepository
        .findByTypeAndPerson(type, getPrincipal())
        .orElseThrow(ConsentNotFoundException::new);
  }

  public Person getPrincipal() {
    var userDetails =
        (RedesignUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    return personRepository
        .findByEmail(PersonRef.of(userDetails.getUsername()))
        .orElseThrow(PersonNotFoundException::new);
  }
}
