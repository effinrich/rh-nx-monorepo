package com.redesignhealth.company.api.exception;

import com.redesignhealth.company.api.entity.request.RoleAuthority;
import com.redesignhealth.company.api.exception.status.ForbiddenException;

public class ForbiddenRoleAssignmentException extends ForbiddenException {

  public ForbiddenRoleAssignmentException(RoleAuthority roleAuthority) {
    super(String.format("Insufficient permissions to assign role %s", roleAuthority));
  }
}
