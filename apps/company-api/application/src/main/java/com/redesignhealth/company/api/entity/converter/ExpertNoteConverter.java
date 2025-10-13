package com.redesignhealth.company.api.entity.converter;

import com.redesignhealth.company.api.entity.ref.ExpertNoteRef;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter
public class ExpertNoteConverter implements AttributeConverter<ExpertNoteRef, String> {
  @Override
  public String convertToDatabaseColumn(ExpertNoteRef attribute) {
    return attribute.value();
  }

  @Override
  public ExpertNoteRef convertToEntityAttribute(String dbData) {
    return ExpertNoteRef.of(dbData);
  }
}
