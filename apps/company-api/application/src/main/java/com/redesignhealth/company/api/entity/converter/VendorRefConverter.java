package com.redesignhealth.company.api.entity.converter;

import com.redesignhealth.company.api.entity.ref.VendorRef;
import jakarta.persistence.AttributeConverter;

public class VendorRefConverter implements AttributeConverter<VendorRef, String> {
  @Override
  public String convertToDatabaseColumn(VendorRef ref) {
    return (ref != null) ? ref.value() : null;
  }

  @Override
  public VendorRef convertToEntityAttribute(String apiId) {
    return (apiId != null) ? VendorRef.of(apiId) : null;
  }
}
