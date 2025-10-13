package com.redesignhealth.company.api.assembler;

import com.redesignhealth.company.api.controller.CompanyVendorController;
import com.redesignhealth.company.api.dto.CompanyVendorSummary;
import com.redesignhealth.company.api.entity.vendor.CompanyVendor;
import org.springframework.hateoas.server.mvc.RepresentationModelAssemblerSupport;
import org.springframework.stereotype.Component;

@Component
public class CompanyVendorAssembler
    extends RepresentationModelAssemblerSupport<CompanyVendor, CompanyVendorSummary> {

  public CompanyVendorAssembler() {
    super(CompanyVendorController.class, CompanyVendorSummary.class);
  }

  @Override
  public CompanyVendorSummary toModel(CompanyVendor companyVendor) {
    return CompanyVendorSummary.from(companyVendor);
  }
}
