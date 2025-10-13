package com.redesignhealth.company.api.entity.vendor;

import com.redesignhealth.company.api.dto.enums.CompanyVendorEngagementStatus;
import com.redesignhealth.company.api.entity.Company;
import com.redesignhealth.company.api.entity.Subcategory;
import com.redesignhealth.company.api.entity.converter.CompanyVendorRefConverter;
import com.redesignhealth.company.api.entity.ref.CompanyVendorRef;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import java.time.Instant;
import java.util.HashSet;
import java.util.Set;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@EqualsAndHashCode(of = "apiId")
public class CompanyVendor {
  @Id @GeneratedValue private Long id;

  @Convert(converter = CompanyVendorRefConverter.class)
  private CompanyVendorRef apiId;

  @ManyToOne private Vendor vendor;

  @ManyToOne private Company company;

  @ManyToMany
  @JoinTable(
      name = "company_vendor_subcategories",
      joinColumns = {@JoinColumn(name = "company_vendor_id", referencedColumnName = "id")},
      inverseJoinColumns = {@JoinColumn(name = "subcategory_id", referencedColumnName = "id")})
  @Setter
  private Set<Subcategory> subcategories;

  @OneToMany(mappedBy = "companyVendor", cascade = CascadeType.ALL)
  @Setter
  private Set<CompanyVendorContact> contacts;

  @Setter private Instant startDate;
  @Setter private Instant endDate;

  @Setter
  @Enumerated(EnumType.STRING)
  private CompanyVendorEngagementStatus engagementStatus;

  private CompanyVendor() {
    this.subcategories = new HashSet<>();
    this.contacts = new HashSet<>();
  }

  public static CompanyVendor from(CompanyVendorRef apidId, Company company, Vendor vendor) {
    var entity = new CompanyVendor();
    entity.apiId = apidId;
    entity.vendor = vendor;
    entity.company = company;
    return entity;
  }
}
