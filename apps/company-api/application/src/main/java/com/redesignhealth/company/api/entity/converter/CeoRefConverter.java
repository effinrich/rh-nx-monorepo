package com.redesignhealth.company.api.entity.converter;

import com.redesignhealth.company.api.entity.ref.CeoRef;
import jakarta.persistence.AttributeConverter;

public class CeoRefConverter implements AttributeConverter<CeoRef, String> {
  @Override
  public String convertToDatabaseColumn(CeoRef ceoRef) {
    return (ceoRef != null) ? ceoRef.value() : null;
  }

  @Override
  public CeoRef convertToEntityAttribute(String apiId) {
    return (apiId != null) ? CeoRef.of(apiId) : null;
  }
}
