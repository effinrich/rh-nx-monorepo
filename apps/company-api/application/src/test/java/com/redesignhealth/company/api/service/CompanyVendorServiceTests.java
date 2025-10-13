package com.redesignhealth.company.api.service;

import static com.redesignhealth.company.api.scaffolding.Fixtures.testCategory;
import static com.redesignhealth.company.api.scaffolding.Fixtures.testCompany;
import static com.redesignhealth.company.api.scaffolding.Fixtures.testCompanyVendor;
import static com.redesignhealth.company.api.scaffolding.Fixtures.testCompanyVendorContact;
import static com.redesignhealth.company.api.scaffolding.Fixtures.testPerson;
import static com.redesignhealth.company.api.scaffolding.Fixtures.testPersonRef;
import static com.redesignhealth.company.api.scaffolding.Fixtures.testSubcategory;
import static com.redesignhealth.company.api.scaffolding.Fixtures.testVendor;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.AdditionalAnswers.returnsFirstArg;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.redesignhealth.company.api.client.email.EmailSender;
import com.redesignhealth.company.api.dto.PersonReducedInfo;
import com.redesignhealth.company.api.dto.SubcategorySummary;
import com.redesignhealth.company.api.dto.command.vendor.CompanyVendorChangeCommand;
import com.redesignhealth.company.api.dto.command.vendor.CompanyVendorCommand;
import com.redesignhealth.company.api.dto.command.vendor.CreateCompanyVendorCommand;
import com.redesignhealth.company.api.dto.enums.CompanyStage;
import com.redesignhealth.company.api.dto.enums.CompanyStatus;
import com.redesignhealth.company.api.exception.status.ForbiddenException;
import com.redesignhealth.company.api.exception.status.UnprocessableEntityException;
import com.redesignhealth.company.api.repository.CompanyRepository;
import com.redesignhealth.company.api.repository.CompanyVendorRepository;
import com.redesignhealth.company.api.repository.PersonRepository;
import com.redesignhealth.company.api.security.RedesignUserDetails;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import org.hibernate.exception.ConstraintViolationException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

@ExtendWith(MockitoExtension.class)
class CompanyVendorServiceTests {

  private CompanyVendorService companyVendorService;

  @Mock private VendorService vendorService;

  @Mock private SubcategoryService subcategoryService;

  @Mock private CompanyVendorRepository companyVendorRepository;

  @Mock private CompanyRepository companyRepository;

  @Mock private PersonRepository personRepository;

  @Mock private EmailSender emailSender;

  private static final List<String> EMAIL_LIST = List.of(testPersonRef().getEmail());

  @BeforeEach
  public void setup() {
    companyVendorService =
        new CompanyVendorService(
            companyVendorRepository,
            companyRepository,
            vendorService,
            subcategoryService,
            personRepository,
            emailSender,
            EMAIL_LIST);
  }

  @Test
  public void testCreate_Is_Failure_For_Company_Not_ACTIVE() {
    var company = testCompany();
    company.setStatus(CompanyStatus.PAUSED);
    when(companyRepository.findByApiId(company.getApiId())).thenReturn(Optional.of(company));

    assertThatThrownBy(() -> companyVendorService.create(company.getApiId(), testCreateCommand()))
        .isInstanceOf(ForbiddenException.class)
        .hasMessage("Vendors can only be added to ACTIVE companies.");
  }

  @Test
  public void testCreate_Is_Failure_For_THEME() {
    var company = testCompany();
    company.setStage(CompanyStage.THEME);
    when(companyRepository.findByApiId(company.getApiId())).thenReturn(Optional.of(company));

    assertThatThrownBy(() -> companyVendorService.create(company.getApiId(), testCreateCommand()))
        .isInstanceOf(ForbiddenException.class)
        .hasMessage("Vendor can be added only in OP_CO and NEW_CO stages companies.");
  }

  @Test
  public void testCreate_Is_Failure_For_CONCEPT() {
    var company = testCompany();
    company.setStage(CompanyStage.CONCEPT);
    when(companyRepository.findByApiId(company.getApiId())).thenReturn(Optional.of(company));

    assertThatThrownBy(() -> companyVendorService.create(company.getApiId(), testCreateCommand()))
        .isInstanceOf(ForbiddenException.class)
        .hasMessage("Vendor can be added only in OP_CO and NEW_CO stages companies.");
  }

  @Test
  public void testCreate_Is_Failure_For_vendor_name_duplicated() {
    mockSecurityContext();
    var company = testCompany();
    when(companyRepository.findByApiId(company.getApiId())).thenReturn(Optional.of(company));
    when(vendorService.getByName(any())).thenReturn(Optional.of(testVendor()));
    var uniqueViolation = Mockito.mock(ConstraintViolationException.class);
    var baseException = new DataIntegrityViolationException("Error", uniqueViolation);
    when(companyVendorRepository.save(any())).thenThrow(baseException);
    when(personRepository.findByEmail(testPersonRef())).thenReturn(Optional.of(testPerson()));

    assertThatThrownBy(
            () -> companyVendorService.create(testCompany().getApiId(), testCreateCommand()))
        .isInstanceOf(UnprocessableEntityException.class)
        .hasMessage("Invalid field values");
  }

  @Test
  public void testCreate_creates_contact() {
    mockSecurityContext();
    var company = testCompany();
    when(companyRepository.findByApiId(company.getApiId())).thenReturn(Optional.of(company));
    when(vendorService.getByName(any())).thenReturn(Optional.of(testVendor()));
    when(companyVendorRepository.save(any())).then(returnsFirstArg());
    when(personRepository.findByEmail(testPersonRef())).thenReturn(Optional.of(testPerson()));
    var command = testCreateCommand();
    command.setWillingToDiscuss(true);
    var result = companyVendorService.create(company.getApiId(), command);
    var createdContact = result.getContacts().iterator().next();

    assertThat(createdContact.getPerson().getEmail().value()).isEqualTo("test@redesignhealth.com");
    assertThat(createdContact.getCompanyVendor()).isEqualTo(result);
    assertThat(createdContact.getWillingToDiscuss()).isTrue();
  }

  @Test
  public void testCreate_send_email_when_new_vendor_name() {
    mockSecurityContext();
    var company = testCompany();
    when(companyRepository.findByApiId(company.getApiId())).thenReturn(Optional.of(company));
    when(companyVendorRepository.save(any())).then(returnsFirstArg());
    when(vendorService.addVendorData(any())).thenReturn(testVendor());
    when(personRepository.findByEmail(testPersonRef())).thenReturn(Optional.of(testPerson()));

    var command = testCreateCommand();

    var result = companyVendorService.create(company.getApiId(), command);
    verify(emailSender)
        .sendCompanyVendorChange(
            EMAIL_LIST,
            CompanyVendorChangeCommand.from(
                result,
                PersonReducedInfo.from(testPerson()),
                CompanyVendorChangeCommand.Type.NEW_VENDOR));
  }

  @Test
  public void testCreate_send_email_when_subcategories_are_different_from_vendor() {
    mockSecurityContext();
    var company = testCompany();
    when(companyRepository.findByApiId(company.getApiId())).thenReturn(Optional.of(company));
    when(companyVendorRepository.save(any())).then(returnsFirstArg());
    var vendor = testVendor();
    when(vendorService.getByName(any())).thenReturn(Optional.of(vendor));
    when(personRepository.findByEmail(testPersonRef())).thenReturn(Optional.of(testPerson()));

    var command = testCreateCommand();
    var newSubcategory = testSubcategory("Admin Tools", testCategory("CI/CD"));
    command.setSubcategories(List.of(SubcategorySummary.from(newSubcategory)));
    when(subcategoryService.processSubcategories(command.getSubcategories()))
        .thenReturn(Set.of(newSubcategory));

    var result = companyVendorService.create(company.getApiId(), command);
    assertThat(result.getSubcategories()).isNotEqualTo(vendor.getSubcategories());
    verify(emailSender)
        .sendCompanyVendorChange(
            EMAIL_LIST,
            CompanyVendorChangeCommand.from(
                result,
                PersonReducedInfo.from(testPerson()),
                CompanyVendorChangeCommand.Type.NEW_SUBCATEGORIES));
  }

  @Test
  public void testUpdate_creates_contact() {
    mockSecurityContext();
    var companyVendor = testCompanyVendor();
    companyVendor.getContacts().clear();

    when(personRepository.findByEmail(testPersonRef())).thenReturn(Optional.of(testPerson()));
    when(companyVendorRepository.findByApiId(companyVendor.getApiId()))
        .thenReturn(Optional.of(companyVendor));
    when(companyVendorRepository.save(any())).then(returnsFirstArg());

    var command = CompanyVendorCommand.of(List.of());
    command.setWillingToDiscuss(true);

    var result = companyVendorService.update(companyVendor.getApiId(), command);
    assertThat(result.getContacts()).hasSize(1);

    var createdContact = result.getContacts().iterator().next();
    assertThat(createdContact.getPerson().getEmail().value()).isEqualTo("test@redesignhealth.com");
    assertThat(createdContact.getCompanyVendor()).isEqualTo(result);
    assertThat(createdContact.getWillingToDiscuss()).isTrue();
  }

  @Test
  public void testUpdate_updates_existing_contact() {
    mockSecurityContext();
    var companyVendor = testCompanyVendor();
    companyVendor.getContacts().clear();
    companyVendor.getContacts().add(testCompanyVendorContact(companyVendor));

    when(companyVendorRepository.findByApiId(companyVendor.getApiId()))
        .thenReturn(Optional.of(companyVendor));
    when(companyVendorRepository.save(any())).then(returnsFirstArg());
    when(personRepository.findByEmail(testPersonRef())).thenReturn(Optional.of(testPerson()));
    var command = CompanyVendorCommand.of(List.of());
    command.setWillingToDiscuss(true);

    var result = companyVendorService.update(companyVendor.getApiId(), command);
    assertThat(result.getContacts()).hasSize(1);

    var createdContact = result.getContacts().iterator().next();
    assertThat(createdContact.getPerson().getEmail().value()).isEqualTo("test@redesignhealth.com");
    assertThat(createdContact.getCompanyVendor()).isEqualTo(result);
    assertThat(createdContact.getWillingToDiscuss()).isTrue();
  }

  @Test
  public void testUpdate_send_email_when_subcategories_are_different_from_vendor() {
    mockSecurityContext();
    var companyVendor = testCompanyVendor();
    when(companyVendorRepository.findByApiId(companyVendor.getApiId()))
        .thenReturn(Optional.of(companyVendor));
    when(companyVendorRepository.save(any())).then(returnsFirstArg());
    // needed to look up principal's name for email
    when(personRepository.findByEmail(testPersonRef())).thenReturn(Optional.of(testPerson()));

    var command = CompanyVendorCommand.of(List.of());
    var newSubcategory = testSubcategory("Admin Tools", testCategory("CI/CD"));
    command.setSubcategories(List.of(SubcategorySummary.from(newSubcategory)));
    when(subcategoryService.processSubcategories(command.getSubcategories()))
        .thenReturn(Set.of(newSubcategory));

    var result = companyVendorService.update(testCompanyVendor().getApiId(), command);
    assertThat(result.getSubcategories())
        .isNotEqualTo(companyVendor.getVendor().getSubcategories());
    verify(emailSender)
        .sendCompanyVendorChange(
            EMAIL_LIST,
            CompanyVendorChangeCommand.from(
                result,
                PersonReducedInfo.from(testPerson()),
                CompanyVendorChangeCommand.Type.NEW_SUBCATEGORIES));
  }

  private void mockSecurityContext() {
    Authentication authentication = mock(Authentication.class);
    when(authentication.getPrincipal()).thenReturn(RedesignUserDetails.from(testPerson()));
    SecurityContext securityContext = mock(SecurityContext.class);
    when(securityContext.getAuthentication()).thenReturn(authentication);
    SecurityContextHolder.setContext(securityContext);
  }

  private static CreateCompanyVendorCommand testCreateCommand() {
    return CreateCompanyVendorCommand.of("Apple", List.of());
  }
}
