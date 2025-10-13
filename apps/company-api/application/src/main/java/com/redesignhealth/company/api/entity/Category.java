package com.redesignhealth.company.api.entity;

import com.redesignhealth.company.api.entity.audit.Auditable;
import com.redesignhealth.company.api.entity.converter.CategoryRefConverter;
import com.redesignhealth.company.api.entity.ref.CategoryRef;
import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import java.util.Set;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class Category extends Auditable {
  @Id @GeneratedValue private Long id;

  /** User-friendly id to be used in API calls */
  @Column(unique = true)
  @Convert(converter = CategoryRefConverter.class)
  private CategoryRef apiId;

  @Column(unique = true)
  String name;

  @OneToMany(mappedBy = "category")
  Set<Subcategory> subcategories;

  private Category() {}

  public static Category from(CategoryRef ref) {
    Category category = new Category();
    category.apiId = ref;
    return category;
  }
}
