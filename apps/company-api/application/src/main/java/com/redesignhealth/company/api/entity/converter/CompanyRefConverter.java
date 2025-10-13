package com.redesignhealth.company.api.entity.converter;

import com.redesignhealth.company.api.entity.ref.CompanyRef;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter
public class CompanyRefConverter implements AttributeConverter<CompanyRef, String> {
  @Override
  public String convertToDatabaseColumn(CompanyRef companyRef) {
    return (companyRef != null) ? companyRef.value() : null;
  }

  @Override
  public CompanyRef convertToEntityAttribute(String apiId) {
    return (apiId != null) ? CompanyRef.of(apiId) : null;
  }
}
