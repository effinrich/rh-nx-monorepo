package com.redesignhealth.company.api.exception;

import com.redesignhealth.company.api.entity.request.RoleAuthority;
import com.redesignhealth.company.api.exception.status.BadRequestException;

public class UnknownRoleException extends BadRequestException {

  public UnknownRoleException(RoleAuthority authority) {
    super(String.format("Unknown role %s", authority));
  }
}
