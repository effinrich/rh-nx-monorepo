package com.redesignhealth.company.api.service;

import static com.redesignhealth.company.api.util.SpecificationUtil.search;

import com.redesignhealth.company.api.client.search.entity.FilterOptions;
import com.redesignhealth.company.api.client.search.entity.Term;
import com.redesignhealth.company.api.dto.SearchFilter;
import com.redesignhealth.company.api.dto.VendorSummary;
import com.redesignhealth.company.api.dto.command.vendor.CreateVendorCommand;
import com.redesignhealth.company.api.dto.command.vendor.VendorCommand;
import com.redesignhealth.company.api.entity.ref.VendorRef;
import com.redesignhealth.company.api.entity.request.RoleAuthority;
import com.redesignhealth.company.api.entity.vendor.CompanyVendorContact;
import com.redesignhealth.company.api.entity.vendor.Vendor;
import com.redesignhealth.company.api.exception.InvalidFieldException;
import com.redesignhealth.company.api.exception.VendorNotFoundException;
import com.redesignhealth.company.api.exception.dto.FieldErrorType;
import com.redesignhealth.company.api.repository.VendorRepository;
import com.redesignhealth.company.api.security.AuthChecks;
import com.redesignhealth.company.api.service.helper.RefGenerator;
import jakarta.annotation.Nullable;
import jakarta.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.Hibernate;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class VendorService {
  private final VendorRepository vendorRepository;
  private static final String NAME = "name";
  private static final String CATEGORY_FIELD_FILTER = "category";
  private static final String SUBCATEGORY_FIELD_FILTER = "subcategory";
  private static final String TAG_CHECK = "tagCheck";
  static final List<String> SEARCHABLE_COLUMNS = List.of(NAME);
  private final SubcategoryService subcategoryService;

  public VendorService(VendorRepository vendorRepository, SubcategoryService subcategoryService) {
    this.vendorRepository = vendorRepository;
    this.subcategoryService = subcategoryService;
  }

  @Transactional
  public Vendor addVendorData(CreateVendorCommand command) {
    var vendor = Vendor.of(RefGenerator.of(vendorRepository, VendorRef.class));
    if (vendorRepository.existsByName(command.getName())) {
      throw InvalidFieldException.of("name", command.getName(), FieldErrorType.UNIQUE);
    }
    vendor.setName(command.getName());
    vendor = save(command, vendor);
    return vendor;
  }

  @Transactional
  public Vendor update(VendorRef apiId, VendorCommand command) {
    var vendor = vendorRepository.findByApiId(apiId).orElseThrow(VendorNotFoundException::new);
    vendor = save(command, vendor);
    return vendor;
  }

  @Transactional
  public List<VendorSummary> getAll(@Nullable String q, List<SearchFilter> filters, Pageable page) {
    var vendors = vendorRepository.findAll(search(q, SEARCHABLE_COLUMNS), page);
    vendors.forEach(this::expand);
    List<VendorSummary> results =
        new ArrayList<>(vendors.stream().map(VendorSummary::from).toList());
    return results.stream()
        .filter(vendor -> includeVendor(Optional.ofNullable(q), filters, vendor))
        .toList();
  }

  public List<FilterOptions> getFilters() {
    var names = getAllVendorNames();
    var terms = names.stream().map(name -> Term.of(name, 1)).toList();
    var filterOption = FilterOptions.builder().field(NAME).terms(terms).build();
    return List.of(filterOption);
  }

  @Transactional
  public Vendor get(VendorRef vendorId) {
    var vendor = vendorRepository.findByApiId(vendorId).orElseThrow(VendorNotFoundException::new);
    expand(vendor);
    return vendor;
  }

  public void delete(VendorRef vendorId) {
    var entity = vendorRepository.findByApiId(vendorId).orElseThrow(VendorNotFoundException::new);
    vendorRepository.delete(entity);
  }

  private List<String> getAllVendorNames() {
    var vendors = vendorRepository.findAll(Sort.by(NAME));
    return vendors.stream().map(Vendor::getName).toList();
  }

  private void expand(Vendor vendor) {
    Hibernate.initialize(vendor.getSubcategories());
    Hibernate.initialize(vendor.getCompanyVendors());
    vendor.setCompanyContacts(
        vendor.getCompanyVendors().stream()
            .flatMap(companyVendor -> companyVendor.getContacts().stream())
            .filter(CompanyVendorContact::getWillingToDiscuss)
            .collect(Collectors.toSet()));
    if (AuthChecks.hasRole(RoleAuthority.ROLE_OP_CO_USER)) {
      vendor.setVendorPointContact(null);
      vendor.setCons(null);
      vendor.setDescription(null);
      vendor.setDiscountInfo(null);
      vendor.setFeatures(null);
      vendor.setFeedbackFromOpcos(null);
      vendor.setHasPlatformAgreement(null);
      vendor.setPricing(null);
    }
  }

  /**
   * Should this vendor be included in search results
   *
   * @param q Optional string for query
   * @param filters list of filters to check
   * @param vendor vendor under inspection
   * @return true if result should be included
   */
  private static boolean includeVendor(
      Optional<String> q, List<SearchFilter> filters, VendorSummary vendor) {

    var categoryFilter =
        filters.stream().filter(f -> f.getField().equals(CATEGORY_FIELD_FILTER)).findFirst();

    var hasCategory =
        categoryFilter
            .map(
                filter -> {
                  if (vendor.getSubcategories() == null) return false;

                  return vendor.getSubcategories().stream()
                      .map(subcategory -> subcategory.getCategory().getName())
                      .anyMatch(category -> categoryFilter.get().getValues().contains(category));
                })
            .orElse(true);

    var subcategoryFilter =
        filters.stream().filter(f -> f.getField().equals(SUBCATEGORY_FIELD_FILTER)).findFirst();

    var hasSubcategory =
        subcategoryFilter
            .map(
                filter -> {
                  if (vendor.getSubcategories() == null) return false;

                  return vendor.getSubcategories().stream()
                      .anyMatch(
                          subcategory ->
                              subcategoryFilter.get().getValues().contains(subcategory.getName()));
                })
            .orElse(true);

    var isTagCheck =
        filters.stream().filter(f -> f.getField().equals(TAG_CHECK)).findFirst().isPresent();

    var hasCompanyContacts = !vendor.getContacts().isEmpty();
    var isOpCoUser = AuthChecks.hasRole(RoleAuthority.ROLE_OP_CO_USER);
    return hasCategory
        && hasSubcategory
        && (hasCompanyContacts
            || !isOpCoUser
            || (isOpCoUser && isTagCheck && q.isPresent() && q.get().equals(vendor.getName())));
  }

  private Vendor save(VendorCommand command, Vendor vendor) {
    if (command != null) {
      var subcategorySummaries = command.getSubcategories();
      if (subcategorySummaries != null && subcategorySummaries.size() > 0) {
        var subCategoryList = subcategoryService.processSubcategories(subcategorySummaries);
        vendor.getSubcategories().clear();
        vendor.getSubcategories().addAll(subCategoryList);
      }
      vendor.setHasPlatformAgreement(command.getHasPlatformAgreement());
      setSpreadsheetFields(command, vendor);
    }
    return vendorRepository.save(vendor);
  }

  private void setSpreadsheetFields(VendorCommand vendorDataCommand, Vendor vendor) {
    vendor.setVendorType(vendorDataCommand.getVendorType());
    vendorDataCommand.getVendorPointContact().ifPresent(vendor::setVendorPointContact);
    vendorDataCommand.getDescription().ifPresent(vendor::setDescription);
    vendorDataCommand.getPros().ifPresent(vendor::setPros);
    vendorDataCommand.getPricing().ifPresent(vendor::setPricing);
    vendorDataCommand.getDiscountInfo().ifPresent(vendor::setDiscountInfo);
    vendorDataCommand.getFeedbackFromOpcos().ifPresent(vendor::setFeedbackFromOpcos);
    vendorDataCommand.getCons().ifPresent(vendor::setCons);
    vendorDataCommand.getFeatures().ifPresent(vendor::setFeatures);
  }

  @Transactional
  public Optional<Vendor> getByName(String name) {
    return vendorRepository
        .findByName(name)
        .map(
            vendor -> {
              Hibernate.initialize(vendor.getSubcategories());
              return vendor;
            });
  }
}
