package com.redesignhealth.company.api.service;

import com.redesignhealth.company.api.dto.command.FormDefinitionCommand;
import com.redesignhealth.company.api.entity.FormDefinition;
import com.redesignhealth.company.api.exception.FormDefinitionNotFoundException;
import com.redesignhealth.company.api.exception.InvalidFieldException;
import com.redesignhealth.company.api.repository.FormDefinitionRepository;
import com.redesignhealth.company.api.util.JsonSchemaUtils;
import org.springframework.stereotype.Service;

@Service
public class FormDefinitionService {
  private final FormDefinitionRepository formDefinitionRepository;

  public FormDefinitionService(FormDefinitionRepository formDefinitionRepository) {
    this.formDefinitionRepository = formDefinitionRepository;
  }

  public FormDefinition get(FormDefinition.Type type) {
    return formDefinitionRepository
        .findByType(type)
        .orElseThrow(FormDefinitionNotFoundException::new);
  }

  public FormDefinition upsert(FormDefinition.Type type, FormDefinitionCommand command) {
    var metaSchema = JsonSchemaUtils.getMetaSchema();
    var errors = metaSchema.validate(command.getSchema());
    if (!errors.isEmpty()) {
      throw new InvalidFieldException(JsonSchemaUtils.convertErrors(errors, "schema"));
    }
    var definition = formDefinitionRepository.findByType(type).orElse(FormDefinition.of(type));
    definition.setSchema(command.getSchema());
    return formDefinitionRepository.save(definition);
  }
}
