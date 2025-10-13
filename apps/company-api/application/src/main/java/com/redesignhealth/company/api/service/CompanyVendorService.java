package com.redesignhealth.company.api.service;

import com.redesignhealth.company.api.client.email.EmailSender;
import com.redesignhealth.company.api.dto.PersonReducedInfo;
import com.redesignhealth.company.api.dto.command.vendor.CompanyVendorChangeCommand;
import com.redesignhealth.company.api.dto.command.vendor.CompanyVendorCommand;
import com.redesignhealth.company.api.dto.command.vendor.CreateCompanyVendorCommand;
import com.redesignhealth.company.api.dto.command.vendor.CreateVendorCommand;
import com.redesignhealth.company.api.dto.enums.CompanyStage;
import com.redesignhealth.company.api.dto.enums.CompanyStatus;
import com.redesignhealth.company.api.entity.Company;
import com.redesignhealth.company.api.entity.ref.CompanyRef;
import com.redesignhealth.company.api.entity.ref.CompanyVendorRef;
import com.redesignhealth.company.api.entity.ref.PersonRef;
import com.redesignhealth.company.api.entity.vendor.CompanyVendor;
import com.redesignhealth.company.api.entity.vendor.CompanyVendorContact;
import com.redesignhealth.company.api.entity.vendor.Vendor;
import com.redesignhealth.company.api.exception.CompanyNotFoundException;
import com.redesignhealth.company.api.exception.CompanyVendorNotFoundException;
import com.redesignhealth.company.api.exception.ForbiddenCompanyVendorException;
import com.redesignhealth.company.api.exception.InvalidFieldException;
import com.redesignhealth.company.api.exception.PersonNotFoundException;
import com.redesignhealth.company.api.exception.dto.FieldErrorType;
import com.redesignhealth.company.api.expansion.Expansion;
import com.redesignhealth.company.api.repository.CompanyRepository;
import com.redesignhealth.company.api.repository.CompanyVendorRepository;
import com.redesignhealth.company.api.repository.PersonRepository;
import com.redesignhealth.company.api.security.AuthChecks;
import com.redesignhealth.company.api.service.helper.RefGenerator;
import jakarta.transaction.Transactional;
import java.util.List;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.Hibernate;
import org.hibernate.exception.ConstraintViolationException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class CompanyVendorService {

  private final CompanyVendorRepository repository;
  private final CompanyRepository companyRepository;
  private final VendorService vendorService;
  private final SubcategoryService subcategoryService;
  private final PersonRepository personRepository;
  private final EmailSender emailSender;
  private final List<String> companyVendorChangeRecipients;

  public CompanyVendorService(
      CompanyVendorRepository repository,
      CompanyRepository companyRepository,
      VendorService vendorService,
      SubcategoryService subcategoryService,
      PersonRepository personRepository,
      EmailSender emailSender,
      @Value("${company-vendor-change.recipients}") List<String> companyVendorChangeRecipients) {
    this.repository = repository;
    this.companyRepository = companyRepository;
    this.vendorService = vendorService;
    this.subcategoryService = subcategoryService;
    this.personRepository = personRepository;
    this.emailSender = emailSender;
    this.companyVendorChangeRecipients = companyVendorChangeRecipients;
  }

  @Transactional
  public List<CompanyVendor> getAll(CompanyRef apiId, List<Expansion> expansions, Pageable page) {
    var company = companyRepository.findByApiId(apiId).orElseThrow(CompanyNotFoundException::new);
    var results = repository.findAllByCompany(company, page);
    results.forEach(companyVendor -> expand(companyVendor, expansions));
    return results;
  }

  public CompanyVendor create(CompanyRef companyId, CreateCompanyVendorCommand command) {
    var company =
        companyRepository.findByApiId(companyId).orElseThrow(CompanyNotFoundException::new);
    validateCompany(company);

    var existingVendor = vendorService.getByName(command.getName());

    var newCompanyVendor =
        CompanyVendor.from(
            RefGenerator.of(repository, CompanyVendorRef.class),
            company,
            existingVendor.orElseGet(() -> createVendor(command)));

    updateFields(newCompanyVendor, command);
    if (existingVendor.isEmpty()) {
      sendEmail(
          PersonRef.of(AuthChecks.getPrincipal().getUsername()),
          newCompanyVendor,
          CompanyVendorChangeCommand.Type.NEW_VENDOR);
    }

    if (!hasSameSubcategoriesAsVendor(newCompanyVendor)) {
      sendEmail(
          PersonRef.of(AuthChecks.getPrincipal().getUsername()),
          newCompanyVendor,
          CompanyVendorChangeCommand.Type.NEW_SUBCATEGORIES);
    }
    try {
      return repository.save(newCompanyVendor);
    } catch (DataIntegrityViolationException e) {
      log.warn("Unable to save company vendor", e);
      if (e.getCause() instanceof ConstraintViolationException) {
        throw InvalidFieldException.of("name", command.getName(), FieldErrorType.UNIQUE);
      }
      throw e;
    }
  }

  private CompanyVendorContact createContact(
      CompanyVendor companyVendor, CompanyVendorCommand command) {
    var person =
        personRepository
            .findByEmail(PersonRef.of(AuthChecks.getPrincipal().getUsername()))
            .orElseThrow(PersonNotFoundException::new);
    return CompanyVendorContact.from(companyVendor, person, command.getWillingToDiscuss());
  }

  private Vendor createVendor(CreateCompanyVendorCommand command) {
    var vendorCommand = CreateVendorCommand.of(command.getName(), command.getSubcategories());
    return vendorService.addVendorData(vendorCommand);
  }

  private void expand(CompanyVendor companyVendor, List<Expansion> expansions) {
    if (expansions.contains(Expansion.CONTACTS)) {
      Hibernate.initialize(companyVendor.getContacts());
    }
    Hibernate.initialize(companyVendor.getSubcategories());
  }

  @Transactional
  public CompanyVendor update(CompanyVendorRef apiId, CompanyVendorCommand command) {
    var entity = repository.findByApiId(apiId).orElseThrow(CompanyVendorNotFoundException::new);
    updateFields(entity, command);
    if (!hasSameSubcategoriesAsVendor(entity)) {
      sendEmail(
          PersonRef.of(AuthChecks.getPrincipal().getUsername()),
          entity,
          CompanyVendorChangeCommand.Type.NEW_SUBCATEGORIES);
    }
    return repository.save(entity);
  }

  @Transactional
  public CompanyVendor get(CompanyVendorRef apiId, List<Expansion> expansions) {
    var result = repository.findByApiId(apiId).orElseThrow(CompanyVendorNotFoundException::new);
    expand(result, expansions);
    return result;
  }

  public void delete(CompanyVendorRef apiId) {
    var entity = repository.findByApiId(apiId).orElseThrow(CompanyVendorNotFoundException::new);
    repository.delete(entity);
  }

  private void updateFields(CompanyVendor entity, CompanyVendorCommand command) {
    if (command.getSubcategories() != null && !command.getSubcategories().isEmpty()) {
      entity.getSubcategories().clear();
      entity.setSubcategories(subcategoryService.processSubcategories(command.getSubcategories()));
    }
    entity.setEngagementStatus(command.getEngagementStatus());
    entity.setStartDate(command.getStartDate());
    entity.setEndDate(command.getEndDate());
    upsertPrincipalAsCompanyVendorContact(command, entity);
  }

  private void upsertPrincipalAsCompanyVendorContact(
      CompanyVendorCommand command, CompanyVendor entity) {
    var principal = AuthChecks.getPrincipal();
    var maybeExistingContact =
        entity.getContacts().stream()
            .filter(c -> c.getPerson().getEmail().value().equals(principal.getUsername()))
            .findFirst();
    maybeExistingContact.ifPresentOrElse(
        (existing) -> existing.setWillingToDiscuss(command.getWillingToDiscuss()),
        () -> entity.getContacts().add(createContact(entity, command)));
  }

  private static void validateCompany(Company company) {
    if (CompanyStage.THEME.equals(company.getStage())
        || CompanyStage.CONCEPT.equals(company.getStage()))
      throw new ForbiddenCompanyVendorException(
          "Vendor can be added only in OP_CO and NEW_CO stages companies.");
    if (!CompanyStatus.ACTIVE.equals(company.getStatus()))
      throw new ForbiddenCompanyVendorException("Vendors can only be added to ACTIVE companies.");
  }

  private boolean hasSameSubcategoriesAsVendor(CompanyVendor companyVendor) {
    var vendor = companyVendor.getVendor();
    return companyVendor.getSubcategories().equals(vendor.getSubcategories());
  }

  private void sendEmail(
      PersonRef email, CompanyVendor companyVendor, CompanyVendorChangeCommand.Type type) {
    var person = personRepository.findByEmail(email).orElseThrow(PersonNotFoundException::new);
    var companyVendorChangeCommand =
        CompanyVendorChangeCommand.from(companyVendor, PersonReducedInfo.from(person), type);
    emailSender.sendCompanyVendorChange(companyVendorChangeRecipients, companyVendorChangeCommand);
  }
}
