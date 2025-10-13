package com.redesignhealth.company.api.exception;

import com.redesignhealth.company.api.entity.ref.CompanyRef;
import com.redesignhealth.company.api.exception.status.BadRequestException;

public class UnknownCompanyException extends BadRequestException {

  public UnknownCompanyException(CompanyRef apiId) {
    super(String.format("Unknown company %s", apiId.value()));
  }
}
