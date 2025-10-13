package com.redesignhealth.company.api.assembler;

import com.redesignhealth.company.api.controller.IpMarketplaceController;
import com.redesignhealth.company.api.dto.IpMarketplaceSummary;
import org.springframework.hateoas.server.mvc.RepresentationModelAssemblerSupport;
import org.springframework.stereotype.Component;

@Component
public class IpMarketplaceAssembler
    extends RepresentationModelAssemblerSupport<IpMarketplaceSummary, IpMarketplaceSummary> {
  public IpMarketplaceAssembler() {
    super(IpMarketplaceController.class, IpMarketplaceSummary.class);
  }

  @Override
  public IpMarketplaceSummary toModel(IpMarketplaceSummary ipMarketplaceSummary) {
    return ipMarketplaceSummary;
  }
}
