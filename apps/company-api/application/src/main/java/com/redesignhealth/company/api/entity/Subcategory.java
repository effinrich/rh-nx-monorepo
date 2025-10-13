package com.redesignhealth.company.api.entity;

import com.redesignhealth.company.api.entity.audit.Auditable;
import com.redesignhealth.company.api.entity.converter.SubcategoryRefConverter;
import com.redesignhealth.company.api.entity.ref.SubcategoryRef;
import com.redesignhealth.company.api.entity.vendor.Vendor;
import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import java.util.HashSet;
import java.util.Set;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Subcategory extends Auditable {
  @Id @GeneratedValue private Long id;

  @ManyToOne Category category;

  /** User-friendly id to be used in API calls */
  @Column(unique = true)
  @Convert(converter = SubcategoryRefConverter.class)
  private SubcategoryRef apiId;

  @Column(unique = true)
  @EqualsAndHashCode.Include()
  String name;

  @ManyToMany(mappedBy = "subcategories")
  Set<Vendor> companyVendors;

  private Subcategory() {
    this.companyVendors = new HashSet<>();
  }

  public static Subcategory of(Category category, SubcategoryRef subcategoryRef) {
    var subcategory = new Subcategory();
    subcategory.category = category;
    subcategory.apiId = subcategoryRef;
    return subcategory;
  }
}
