package com.redesignhealth.company.api.entity.vendor;

import com.redesignhealth.company.api.entity.Person;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@EqualsAndHashCode(of = {"companyVendor", "person"})
public class CompanyVendorContact {

  @Id @GeneratedValue private Long id;

  @ManyToOne
  @JoinColumn(name = "company_vendor_id")
  private CompanyVendor companyVendor;

  @ManyToOne
  @JoinColumn(name = "contact_id")
  private Person person;

  @Setter private Boolean willingToDiscuss;

  private CompanyVendorContact(
      CompanyVendor companyVendor, Person person, Boolean willingToDiscuss) {
    this.companyVendor = companyVendor;
    this.person = person;
    this.willingToDiscuss = willingToDiscuss;
  }

  public CompanyVendorContact() {}

  public static CompanyVendorContact from(
      CompanyVendor companyVendor, Person person, Boolean willingToDiscuss) {
    return new CompanyVendorContact(companyVendor, person, willingToDiscuss);
  }
}
