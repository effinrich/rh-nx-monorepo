package com.redesignhealth.company.api.exception;

import com.redesignhealth.company.api.exception.dto.FieldErrorDetails;
import com.redesignhealth.company.api.exception.dto.FieldErrorType;
import com.redesignhealth.company.api.exception.status.UnprocessableEntityException;
import java.util.Collection;

public class InvalidFieldException extends UnprocessableEntityException {

  public static InvalidFieldException of(String name, Object rejectedValue, FieldErrorType type) {
    return new InvalidFieldException(
        FieldErrorDetails.builder().name(name).rejectedValue(rejectedValue).type(type).build());
  }

  public InvalidFieldException(Collection<FieldErrorDetails> fieldErrorDetails) {
    this(fieldErrorDetails.toArray(new FieldErrorDetails[0]));
  }

  public InvalidFieldException(FieldErrorDetails... fieldErrorDetails) {
    super(fieldErrorDetails);
  }
}
