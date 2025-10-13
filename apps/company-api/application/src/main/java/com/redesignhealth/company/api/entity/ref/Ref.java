package com.redesignhealth.company.api.entity.ref;

import java.util.Objects;

public abstract class Ref {
  public static final String DEFAULT_REF_COLUMN_NAME = "apiId";
  // to add a new field in a many-to-many entity we should break in a one-to-many
  // relationship+embeddedId
  public static final String COMPANY = "company";

  public String getColumnName() {
    return DEFAULT_REF_COLUMN_NAME;
  }

  public abstract String value();

  @Override
  public String toString() {
    return value();
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) return true;
    if (o == null || getClass() != o.getClass()) return false;

    Ref that = (Ref) o;

    return Objects.equals(value(), that.value());
  }

  @Override
  public int hashCode() {
    return Objects.hashCode(value());
  }
}
