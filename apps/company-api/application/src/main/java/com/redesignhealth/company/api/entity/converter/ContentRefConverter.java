package com.redesignhealth.company.api.entity.converter;

import com.redesignhealth.company.api.entity.ref.ContentRef;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter
public class ContentRefConverter implements AttributeConverter<ContentRef, String> {
  @Override
  public String convertToDatabaseColumn(ContentRef contentRef) {
    return contentRef.value();
  }

  @Override
  public ContentRef convertToEntityAttribute(String apiId) {
    return ContentRef.of(apiId);
  }
}
