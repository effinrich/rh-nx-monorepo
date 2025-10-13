package com.redesignhealth.company.api.dto;

import java.util.List;
import lombok.Getter;
import org.springframework.hateoas.RepresentationModel;

@Getter
public class CompanyMemberAuditSummary extends RepresentationModel<CompanyMemberSummary> {
  private final String email;
  private List<CompanyMemberAuditInfo> changes;

  protected CompanyMemberAuditSummary(CompanyMemberAuditDto companyMemberAuditDto) {
    this.email = companyMemberAuditDto.getEmail();
    this.changes = companyMemberAuditDto.getChanges();
  }

  public static CompanyMemberAuditSummary from(CompanyMemberAuditDto companyMemberAuditDto) {
    return new CompanyMemberAuditSummary(companyMemberAuditDto);
  }
}
