package com.redesignhealth.company.api.service;

import static com.redesignhealth.company.api.entity.request.RoleAuthority.ROLE_SUPER_ADMIN;

import com.redesignhealth.company.api.client.email.EmailSender;
import com.redesignhealth.company.api.dto.CompanyMemberAuditDto;
import com.redesignhealth.company.api.dto.CompanyMemberAuditInfo;
import com.redesignhealth.company.api.dto.command.CreatePersonCommand;
import com.redesignhealth.company.api.dto.command.PersonCommand;
import com.redesignhealth.company.api.entity.CompanyMemberAudit;
import com.redesignhealth.company.api.entity.Person;
import com.redesignhealth.company.api.entity.ref.PersonRef;
import com.redesignhealth.company.api.entity.request.RoleAuthority;
import com.redesignhealth.company.api.exception.ForbiddenPersonInfoException;
import com.redesignhealth.company.api.exception.ForbiddenRoleAssignmentException;
import com.redesignhealth.company.api.exception.InvalidFieldException;
import com.redesignhealth.company.api.exception.PersonNotFoundException;
import com.redesignhealth.company.api.exception.dto.FieldErrorDetails;
import com.redesignhealth.company.api.exception.dto.FieldErrorType;
import com.redesignhealth.company.api.expansion.Expansion;
import com.redesignhealth.company.api.repository.CompanyMemberAuditRepository;
import com.redesignhealth.company.api.repository.PersonRepository;
import com.redesignhealth.company.api.security.AuthChecks;
import java.net.URI;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import org.hibernate.exception.ConstraintViolationException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class PersonService {

  private static final Logger logger = LoggerFactory.getLogger(PersonService.class);
  private final PersonRepository personRepository;
  private final EmailSender emailSender;

  private final CompanyMemberAuditRepository companyMemberAuditRepository;

  private final URI portalHostname;
  private final URI adviseHostname;

  public PersonService(
      PersonRepository personRepository,
      EmailSender emailSender,
      CompanyMemberAuditRepository companyMemberAuditRepository,
      @Value("${notification.portal.hostname}") URI portalHostname,
      @Value("${notification.advise.hostname}") URI adviseHostname) {
    this.personRepository = personRepository;
    this.emailSender = emailSender;
    this.companyMemberAuditRepository = companyMemberAuditRepository;
    this.portalHostname = portalHostname;
    this.adviseHostname = adviseHostname;
  }

  public Page<Person> getList(Pageable pageable, List<Expansion> expansions) {
    return personRepository.findAll(pageable, expansions.toArray(new Expansion[0]));
  }

  public Person get(PersonRef email, Expansion... expansions) {
    return personRepository
        .findByEmail(email, expansions)
        .orElseThrow(PersonNotFoundException::new);
  }

  public Person get(PersonRef email, List<Expansion> expansions) {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    if (AuthChecks.isAdmin(authentication)
        || PersonRef.of(AuthChecks.getPrincipal().getUsername()).equals(email))
      return get(email, expansions.toArray(new Expansion[0]));
    throw new ForbiddenPersonInfoException(
        "The user trying to get the information doesn't have access to this.");
  }

  public Person create(CreatePersonCommand command) {
    var person = Person.from(PersonRef.of(command.getEmail()));
    save(person, command);
    emailSender.sendPersonAdded(person, portalHostname, adviseHostname);
    return person;
  }

  public Person update(PersonRef email, PersonCommand updates) {
    Optional<Person> person = personRepository.findByEmail(email);
    boolean exists = person.isPresent();

    var personToUpdate = person.orElse(Person.from(email));
    save(personToUpdate, updates);

    if (!exists) {
      emailSender.sendPersonAdded(personToUpdate, portalHostname, adviseHostname);
    }
    return personToUpdate;
  }

  public void addRole(PersonRef email, RoleAuthority requestedAuthority) {
    Person person = get(email);

    var auth = SecurityContextHolder.getContext().getAuthentication();
    if (requestedAuthority == ROLE_SUPER_ADMIN
        && !AuthChecks.hasRoleOrHigher(auth, ROLE_SUPER_ADMIN)) {
      throw new ForbiddenRoleAssignmentException(requestedAuthority);
    }
    person.setRole(requestedAuthority);
    personRepository.save(person);
  }

  public void removeRole(PersonRef email) {
    Person person = get(email);

    person.setRole(null);
    personRepository.save(person);
  }

  public void delete(PersonRef email) {
    personRepository.delete(get(email));
  }

  public CompanyMemberAuditDto getMemberChanges(PersonRef email) {
    var changes = companyMemberAuditRepository.findCompanyMemberAuditByMembersId(email.getEmail());
    CompanyMemberAuditDto companyMemberAuditDto = new CompanyMemberAuditDto();
    if (!changes.isEmpty()) {
      companyMemberAuditDto.setEmail(changes.get(0).getMembersId());
      companyMemberAuditDto.setChanges(new ArrayList<>());
      for (CompanyMemberAudit companyMemberAudit : changes) {
        var companyMemberAuditInfo = new CompanyMemberAuditInfo();
        companyMemberAuditInfo.setStatus(companyMemberAudit.getStatus());
        companyMemberAuditInfo.setOperation(companyMemberAudit.getOperation());
        companyMemberAuditInfo.setCreated(companyMemberAudit.getCreated());
        companyMemberAuditInfo.setCreatedBy(companyMemberAudit.getCreatedBy());
        companyMemberAuditInfo.setLastModified(companyMemberAudit.getLastModified());
        companyMemberAuditInfo.setLastModifiedBy(companyMemberAudit.getLastModifiedBy());
        companyMemberAuditInfo.setCompanyName(companyMemberAudit.getMemberOfId());
        companyMemberAuditDto.getChanges().add(companyMemberAuditInfo);
      }
    }
    return companyMemberAuditDto;
  }

  private Person save(Person person, PersonCommand command) {
    person.setGivenName(command.getGivenName());
    person.setFamilyName(command.getFamilyName());
    command.getRole().ifPresent(person::setRole);

    try {
      return personRepository.save(person);
    } catch (DataIntegrityViolationException e) {
      logger.warn("Unable to save Person", e);
      if (e.getCause() instanceof ConstraintViolationException) {
        var fieldLevelError =
            FieldErrorDetails.builder()
                .name("email")
                .rejectedValue(person.getEmail().value())
                .type(FieldErrorType.UNIQUE)
                .build();
        throw new InvalidFieldException(fieldLevelError);
      }
      throw e;
    }
  }
}
