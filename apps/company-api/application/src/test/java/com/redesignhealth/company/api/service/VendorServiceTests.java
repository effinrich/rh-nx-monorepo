package com.redesignhealth.company.api.service;

import static com.redesignhealth.company.api.scaffolding.Fixtures.testCategory;
import static com.redesignhealth.company.api.scaffolding.Fixtures.testCompanyVendor;
import static com.redesignhealth.company.api.scaffolding.Fixtures.testPerson;
import static com.redesignhealth.company.api.scaffolding.Fixtures.testSubcategory;
import static com.redesignhealth.company.api.scaffolding.Fixtures.testVendor;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import com.redesignhealth.company.api.dto.SearchFilter;
import com.redesignhealth.company.api.entity.request.RoleAuthority;
import com.redesignhealth.company.api.repository.VendorRepository;
import com.redesignhealth.company.api.security.JwtAuthentication;
import com.redesignhealth.company.api.security.RedesignUserDetails;
import java.util.List;
import java.util.Set;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

@ExtendWith(MockitoExtension.class)
public class VendorServiceTests {

  private VendorService vendorService;

  @Mock private VendorRepository vendorRepository;

  @Mock private SubcategoryService subcategoryService;

  @BeforeEach
  public void setup() {
    vendorService = new VendorService(vendorRepository, subcategoryService);
  }

  @AfterEach
  public void teardown() {
    SecurityContextHolder.clearContext();
  }

  @Test
  public void testGetAll_filterMissingCategory() {
    mockSecurityContext(RoleAuthority.ROLE_RH_USER);
    var vendor = testVendor();
    vendor.setSubcategories(Set.of());
    when(vendorRepository.findAll(any(Specification.class), any(Pageable.class)))
        .thenReturn(new PageImpl(List.of(vendor)));
    var filters = List.of(SearchFilter.of("category", "Infrastructure"));
    var results = vendorService.getAll("", filters, Pageable.unpaged());

    assertThat(results).isEmpty();
  }

  @Test
  public void testGetAll_filterMismatchCategory() {
    mockSecurityContext(RoleAuthority.ROLE_RH_USER);
    var vendor = testVendor();
    vendor.setSubcategories(Set.of(testSubcategory("Subcategory", testCategory("Different Name"))));

    when(vendorRepository.findAll(any(Specification.class), any(Pageable.class)))
        .thenReturn(new PageImpl(List.of(vendor)));

    var filters = List.of(SearchFilter.of("category", "Infrastructure"));
    var results = vendorService.getAll("", filters, Pageable.unpaged());

    assertThat(results).isEmpty();
  }

  @Test
  public void testGetAll_filterMatchingCategory() {
    mockSecurityContext(RoleAuthority.ROLE_RH_USER);
    var vendor = testVendor();
    vendor.setSubcategories(Set.of(testSubcategory("Subcategory", testCategory("Infrastructure"))));
    when(vendorRepository.findAll(any(Specification.class), any(Pageable.class)))
        .thenReturn(new PageImpl(List.of(vendor)));

    var filters = List.of(SearchFilter.of("category", "Infrastructure"));
    var results = vendorService.getAll("", filters, Pageable.unpaged());

    assertThat(results.get(0).getApiId()).isEqualTo(vendor.getApiId().value());
  }

  @Test
  public void testGetAll_filterMissingSubcategory() {
    mockSecurityContext(RoleAuthority.ROLE_RH_USER);
    var vendor = testVendor();
    vendor.setSubcategories(Set.of());
    when(vendorRepository.findAll(any(Specification.class), any(Pageable.class)))
        .thenReturn(new PageImpl(List.of(vendor)));

    var filters = List.of(SearchFilter.of("subcategory", "CI/CD"));
    var results = vendorService.getAll("", filters, Pageable.unpaged());

    assertThat(results).isEmpty();
  }

  @Test
  public void testGetAll_filterMismatchSubcategory() {
    mockSecurityContext(RoleAuthority.ROLE_RH_USER);
    var vendor = testVendor();
    vendor.setSubcategories(Set.of(testSubcategory("Not CI/CD", testCategory("Infrastructure"))));

    when(vendorRepository.findAll(any(Specification.class), any(Pageable.class)))
        .thenReturn(new PageImpl(List.of(vendor)));

    var filters = List.of(SearchFilter.of("subcategory", "CI/CD"));
    var results = vendorService.getAll("", filters, Pageable.unpaged());

    assertThat(results).isEmpty();
  }

  @Test
  public void testGetAll_filterMatchSubcategory() {
    mockSecurityContext(RoleAuthority.ROLE_RH_USER);
    var vendor = testVendor();
    vendor.setSubcategories(Set.of(testSubcategory("CI/CD", testCategory("Infrastructure"))));

    when(vendorRepository.findAll(any(Specification.class), any(Pageable.class)))
        .thenReturn(new PageImpl(List.of(vendor)));

    var filters = List.of(SearchFilter.of("subcategory", "CI/CD"));
    var results = vendorService.getAll("", filters, Pageable.unpaged());

    assertThat(results.get(0).getApiId()).isEqualTo(vendor.getApiId().value());
  }

  @ParameterizedTest
  @CsvSource({"ROLE_SUPER_ADMIN, 2", "ROLE_RH_ADMIN, 2", "ROLE_RH_USER, 2", "ROLE_OP_CO_USER, 1"})
  public void testGetAll_filterVendorsWithNoCompanyContactsBasedOnRole(
      String role, int numberOfResults) {
    mockSecurityContext(RoleAuthority.valueOf(role));
    var vendor = testVendor(testCompanyVendor());
    var vendorWithNoCompanyContact = testVendor();
    when(vendorRepository.findAll(any(Specification.class), any(Pageable.class)))
        .thenReturn(new PageImpl(List.of(vendor, vendorWithNoCompanyContact)));

    var results = vendorService.getAll("", List.of(), Pageable.unpaged());
    assertThat(results).hasSize(numberOfResults);
  }

  @Test
  public void testGetAll_vendorPointContactNullForCompanyUser() {
    mockSecurityContext(RoleAuthority.ROLE_OP_CO_USER);
    var vendor = testVendor(testCompanyVendor());

    when(vendorRepository.findAll(any(Specification.class), any(Pageable.class)))
        .thenReturn(new PageImpl(List.of(vendor)));
    var results = vendorService.getAll("", List.of(), Pageable.unpaged());
    assertThat(results.get(0).getVendorPointContact()).isNull();
  }

  @Test
  public void testGetAll_vendorPointContactIsProvidedForRhUser() {
    mockSecurityContext(RoleAuthority.ROLE_RH_USER);
    var vendor = testVendor();

    when(vendorRepository.findAll(any(Specification.class), any(Pageable.class)))
        .thenReturn(new PageImpl(List.of(vendor)));
    var results = vendorService.getAll("", List.of(), Pageable.unpaged());
    assertThat(results.get(0).getVendorPointContact()).isNotNull();
  }

  private void mockSecurityContext(RoleAuthority role) {
    Authentication authentication =
        new JwtAuthentication(RedesignUserDetails.from(testPerson(role)));
    SecurityContext securityContext = mock(SecurityContext.class);
    when(securityContext.getAuthentication()).thenReturn(authentication);
    SecurityContextHolder.setContext(securityContext);
  }
}
