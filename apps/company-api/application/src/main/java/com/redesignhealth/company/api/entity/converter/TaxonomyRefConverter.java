package com.redesignhealth.company.api.entity.converter;

import com.redesignhealth.company.api.entity.ref.TaxonomyRef;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter
public class TaxonomyRefConverter implements AttributeConverter<TaxonomyRef, String> {
  @Override
  public String convertToDatabaseColumn(TaxonomyRef ref) {
    return (ref != null) ? ref.value() : null;
  }

  @Override
  public TaxonomyRef convertToEntityAttribute(String taxonomy) {
    return (taxonomy != null) ? TaxonomyRef.of(taxonomy) : null;
  }
}
