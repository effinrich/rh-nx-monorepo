package com.redesignhealth.company.api.entity.converter;

import com.redesignhealth.company.api.entity.ref.PersonRef;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter
public class PersonRefConverter implements AttributeConverter<PersonRef, String> {
  @Override
  public String convertToDatabaseColumn(PersonRef personRef) {
    return personRef.value();
  }

  @Override
  public PersonRef convertToEntityAttribute(String email) {
    return PersonRef.of(email);
  }
}
