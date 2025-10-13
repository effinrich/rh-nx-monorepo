package com.redesignhealth.company.api.util;

import com.redesignhealth.company.api.dto.SerializableEnum;
import java.util.ArrayList;
import java.util.List;

public class Transformation {
  public static List<SerializableEnum> getValuesFromSerializableEnum(
      List<? extends SerializableEnum> values) {
    if (values == null) return List.of();
    return new ArrayList<>(values);
  }

  public static List<String> getValueListFromEnum(List<? extends SerializableEnum> attributes) {
    return (attributes != null)
        ? attributes.stream().map(SerializableEnum::getValue).toList()
        : null;
  }
}
