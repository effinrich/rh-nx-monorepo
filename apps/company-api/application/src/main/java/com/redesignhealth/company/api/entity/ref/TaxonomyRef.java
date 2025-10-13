package com.redesignhealth.company.api.entity.ref;

import com.redesignhealth.company.api.taxonomy.TaxonomyTerm;
import lombok.Getter;

/** Natural key for an {@link TaxonomyTerm} */
public class TaxonomyRef extends Ref {

  // @Getter Needed to resolve property for OpenAPI Definition file
  @Getter private final String value;
  private static final String COLUMN_NAME = "taxonomy";

  // parameter name must be the same as path parameter to hydrate properly
  private TaxonomyRef(String value) {
    this.value = value;
  }

  public static TaxonomyRef of(String value) {
    return new TaxonomyRef(value);
  }

  @Override
  public String getColumnName() {
    return COLUMN_NAME;
  }

  @Override
  public String value() {
    return value;
  }
}
