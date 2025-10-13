package com.redesignhealth.company.api.entity.converter;

import com.redesignhealth.company.api.entity.ref.TaskRef;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter
public class TaskRefConverter implements AttributeConverter<TaskRef, String> {
  @Override
  public String convertToDatabaseColumn(TaskRef taskRef) {
    return taskRef.value();
  }

  @Override
  public TaskRef convertToEntityAttribute(String email) {
    return TaskRef.of(email);
  }
}
