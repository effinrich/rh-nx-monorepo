package com.redesignhealth.company.api.dto;

import java.util.List;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CompanyMemberAuditDto {
  String email;
  List<CompanyMemberAuditInfo> changes;
}
