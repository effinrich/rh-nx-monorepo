package com.redesignhealth.company.api.exception;

import com.redesignhealth.company.api.entity.FormDefinition;
import com.redesignhealth.company.api.exception.status.BadRequestException;

public class UnknownFormDefinitionException extends BadRequestException {

  public UnknownFormDefinitionException(FormDefinition.Type type) {
    super(
        String.format(
            "Form definition does not exist for %s. Please create one before submitting a form.",
            type.getValue()));
  }
}
