package com.redesignhealth.company.api.expansion;

import java.util.Arrays;
import org.springframework.core.convert.converter.Converter;

public class StringToExpansionConverter implements Converter<String, Expansion> {

  @Override
  public Expansion convert(String source) {
    return Arrays.stream(Expansion.values())
        .filter(v -> v.getFieldName().equals(source))
        .findFirst()
        .orElse(null);
  }
}
