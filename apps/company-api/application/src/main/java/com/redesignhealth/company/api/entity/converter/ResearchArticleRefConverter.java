package com.redesignhealth.company.api.entity.converter;

import com.redesignhealth.company.api.entity.ref.ResearchArticleRef;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter
public class ResearchArticleRefConverter implements AttributeConverter<ResearchArticleRef, String> {
  @Override
  public String convertToDatabaseColumn(ResearchArticleRef attribute) {
    return attribute.value();
  }

  @Override
  public ResearchArticleRef convertToEntityAttribute(String dbData) {
    return ResearchArticleRef.of(dbData);
  }
}
