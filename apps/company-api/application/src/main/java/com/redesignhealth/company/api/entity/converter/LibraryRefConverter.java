package com.redesignhealth.company.api.entity.converter;

import com.redesignhealth.company.api.entity.ref.LibraryRef;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter
public class LibraryRefConverter implements AttributeConverter<LibraryRef, String> {
  @Override
  public String convertToDatabaseColumn(LibraryRef libraryRef) {
    return libraryRef.value();
  }

  @Override
  public LibraryRef convertToEntityAttribute(String apiId) {
    return LibraryRef.of(apiId);
  }
}
