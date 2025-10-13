package com.redesignhealth.company.api.assembler;

import com.redesignhealth.company.api.controller.CompanyController;
import com.redesignhealth.company.api.dto.CompanyMemberAuditDto;
import com.redesignhealth.company.api.dto.CompanyMemberAuditSummary;
import org.springframework.hateoas.server.mvc.RepresentationModelAssemblerSupport;
import org.springframework.stereotype.Component;

@Component
public class CompanyMemberAuditAssembler
    extends RepresentationModelAssemblerSupport<CompanyMemberAuditDto, CompanyMemberAuditSummary> {
  public CompanyMemberAuditAssembler() {
    super(CompanyController.class, CompanyMemberAuditSummary.class);
  }

  @Override
  public CompanyMemberAuditSummary toModel(CompanyMemberAuditDto companyMemberAuditDto) {
    return CompanyMemberAuditSummary.from(companyMemberAuditDto);
  }
}
