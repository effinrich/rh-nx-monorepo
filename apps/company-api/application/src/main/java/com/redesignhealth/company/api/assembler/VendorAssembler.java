package com.redesignhealth.company.api.assembler;

import com.redesignhealth.company.api.controller.VendorController;
import com.redesignhealth.company.api.dto.VendorSummary;
import com.redesignhealth.company.api.entity.vendor.Vendor;
import org.springframework.hateoas.server.mvc.RepresentationModelAssemblerSupport;

public class VendorAssembler extends RepresentationModelAssemblerSupport<Vendor, VendorSummary> {

  public VendorAssembler() {
    super(VendorController.class, VendorSummary.class);
  }

  @Override
  public VendorSummary toModel(Vendor vendor) {
    return VendorSummary.from(vendor);
  }
}
