package com.redesignhealth.company.api.entity.converter;

import com.redesignhealth.company.api.entity.ref.CompanyVendorRef;
import jakarta.persistence.AttributeConverter;

public class CompanyVendorRefConverter implements AttributeConverter<CompanyVendorRef, String> {
  @Override
  public String convertToDatabaseColumn(CompanyVendorRef ref) {
    return (ref != null) ? ref.value() : null;
  }

  @Override
  public CompanyVendorRef convertToEntityAttribute(String apiId) {
    return (apiId != null) ? CompanyVendorRef.of(apiId) : null;
  }
}
