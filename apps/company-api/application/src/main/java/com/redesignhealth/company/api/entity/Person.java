package com.redesignhealth.company.api.entity;

import com.google.common.annotations.VisibleForTesting;
import com.redesignhealth.company.api.entity.audit.Auditable;
import com.redesignhealth.company.api.entity.converter.PersonRefConverter;
import com.redesignhealth.company.api.entity.ref.PersonRef;
import com.redesignhealth.company.api.entity.request.RoleAuthority;
import com.redesignhealth.company.api.entity.vendor.CompanyVendorContact;
import jakarta.persistence.*;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;
import lombok.Getter;
import lombok.Setter;

/** Naming inspired by: <a href="https://schema.org/Person">Person Schema</a> */
@Entity
public class Person extends Auditable {

  @Getter @Setter @Id @GeneratedValue private Long id;

  @Column(unique = true)
  @Convert(converter = PersonRefConverter.class)
  @Getter
  private PersonRef email;

  /** Learn more: <a href="https://en.wikipedia.org/wiki/Personal_name#Name_order">Name Order</a> */
  @Getter @Setter private String givenName;

  @Getter @Setter private String familyName;

  @OneToMany
  @JoinColumn(name = "person_id", referencedColumnName = "id")
  private Set<Consent> consents;

  @OneToMany(
      mappedBy = "person",
      cascade = CascadeType.ALL,
      orphanRemoval = true,
      fetch = FetchType.EAGER)
  @Getter
  @Setter
  private Set<CompanyMember> memberOf;

  @Enumerated(EnumType.STRING)
  @Getter
  @Setter
  private RoleAuthority role;

  @OneToOne
  @JoinColumn(name = "email", referencedColumnName = "email", insertable = false, updatable = false)
  @Getter
  private Ceo ceo;

  @OneToMany
  @JoinColumn(insertable = false, updatable = false)
  private Set<CompanyVendorContact> opCoContacts;

  @OneToMany
  @JoinColumn(insertable = false, updatable = false)
  private Set<IpMarketplaceSeller> ipMarketplaceSellers;

  @OneToMany
  @JoinColumn(insertable = false, updatable = false)
  private Set<IpMarketplaceTrack> ipMarketplaceTracks;

  private Person() {
    // initialize to avoid NPEs
    this.memberOf = new HashSet<>();
    this.opCoContacts = new HashSet<>();
    this.ipMarketplaceSellers = new HashSet<>();
    this.ipMarketplaceTracks = new HashSet<>();
  }

  public static Person from(String email) {
    return from(PersonRef.of(email));
  }

  public static Person from(PersonRef personRef) {
    Person person = new Person();
    person.email = personRef;
    return person;
  }

  @Override
  public boolean equals(Object o) {
    if (o == this) return true;
    if (!(o instanceof Person)) {
      return false;
    }
    Person person = (Person) o;
    return Objects.equals(email, person.getEmail());
  }

  @Override
  public int hashCode() {
    return Objects.hash(this.getEmail());
  }

  @VisibleForTesting
  public void setCeo(Ceo ceo) {
    this.ceo = ceo;
  }
}
