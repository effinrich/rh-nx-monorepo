package com.redesignhealth.company.api.entity.converter;

import com.redesignhealth.company.api.entity.ref.ResearchRef;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter
public class ResearchRefConverter implements AttributeConverter<ResearchRef, String> {
  @Override
  public String convertToDatabaseColumn(ResearchRef attribute) {
    return attribute.value();
  }

  @Override
  public ResearchRef convertToEntityAttribute(String dbData) {
    return ResearchRef.of(dbData);
  }
}
