package com.redesignhealth.company.api.entity.vendor;

import static jakarta.persistence.EnumType.STRING;

import com.redesignhealth.company.api.dto.enums.CompanyVendorType;
import com.redesignhealth.company.api.entity.Subcategory;
import com.redesignhealth.company.api.entity.audit.Auditable;
import com.redesignhealth.company.api.entity.converter.VendorRefConverter;
import com.redesignhealth.company.api.entity.ref.VendorRef;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Transient;
import java.util.HashSet;
import java.util.Set;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class Vendor extends Auditable {
  @Id @GeneratedValue private Long id;

  private String name;

  @OneToMany(mappedBy = "vendor")
  private Set<CompanyVendor> companyVendors;

  @ManyToMany
  @JoinTable(
      name = "vendor_subcategories",
      joinColumns = {@JoinColumn(name = "vendor_id", referencedColumnName = "id")},
      inverseJoinColumns = {@JoinColumn(name = "subcategory_id", referencedColumnName = "id")})
  private Set<Subcategory> subcategories;

  @Convert(converter = VendorRefConverter.class)
  private VendorRef apiId;

  @Enumerated(STRING)
  private CompanyVendorType vendorType;

  // Needs to be updated to include email/name
  private String vendorPointContact;
  private String description;
  private String pros;
  private String pricing;
  private String discountInfo;
  private String feedbackFromOpcos;
  private String cons;
  private String features;
  private Boolean hasPlatformAgreement;
  @Transient private Set<CompanyVendorContact> companyContacts;

  private Vendor() {
    this.subcategories = new HashSet<>();
    this.companyVendors = new HashSet<>();
  }

  public static Vendor of(VendorRef apiId) {
    var entity = new Vendor();
    entity.apiId = apiId;
    return entity;
  }
}
