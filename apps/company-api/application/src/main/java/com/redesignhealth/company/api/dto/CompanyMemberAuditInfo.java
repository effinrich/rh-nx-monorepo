package com.redesignhealth.company.api.dto;

import com.redesignhealth.company.api.dto.enums.CompanyMemberAuditOperation;
import com.redesignhealth.company.api.dto.enums.CompanyMemberStatus;
import java.time.Instant;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CompanyMemberAuditInfo {

  String companyName;
  CompanyMemberStatus status;
  CompanyMemberAuditOperation operation;
  private Instant created;
  private String createdBy;
  private Instant lastModified;
  private String lastModifiedBy;
}
