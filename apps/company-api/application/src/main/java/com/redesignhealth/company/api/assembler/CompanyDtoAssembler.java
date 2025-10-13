package com.redesignhealth.company.api.assembler;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;

import com.redesignhealth.company.api.assembler.google.OnboardDocsLinkGenerator;
import com.redesignhealth.company.api.assembler.google.XCloudCrmLinkGenerator;
import com.redesignhealth.company.api.controller.CompanyController;
import com.redesignhealth.company.api.dto.CompanyDto;
import com.redesignhealth.company.api.dto.CompanyDtoSummary;
import java.util.List;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.hateoas.Link;
import org.springframework.hateoas.server.mvc.RepresentationModelAssemblerSupport;
import org.springframework.stereotype.Component;

@Component
public class CompanyDtoAssembler
    extends RepresentationModelAssemblerSupport<CompanyDto, CompanyDtoSummary> {
  private LinkGenerator onboardDocsLinkGenerator;
  private LinkGenerator xCloudCrmLinkGenerator;
  private List<String> xCloudOnlyOfferTo;

  /**
   * @param onboardDocsLinkGenerator
   * @param xCloudCrmLinkGenerator
   * @param xCloudOnlyOfferTo - a temporary measure to only offer XCloud links to OpCos
   *     participating in a Salesforce/Enterprise Growth UAT
   */
  public CompanyDtoAssembler(
      OnboardDocsLinkGenerator onboardDocsLinkGenerator,
      XCloudCrmLinkGenerator xCloudCrmLinkGenerator,
      @Value("${xcloud.only-offer-to}") String[] xCloudOnlyOfferTo) {
    super(CompanyController.class, CompanyDtoSummary.class);
    this.onboardDocsLinkGenerator = onboardDocsLinkGenerator;
    this.xCloudCrmLinkGenerator = xCloudCrmLinkGenerator;
    this.xCloudOnlyOfferTo = List.of(xCloudOnlyOfferTo);
  }

  @Override
  public CompanyDtoSummary toModel(CompanyDto companyDto) {
    var summary =
        CompanyDtoSummary.from(companyDto)
            .add(createSelfRel(companyDto))
            .add(createMembersLink(companyDto));
    if (companyDto.getCompany().getOnboardDocsFolderId() != null) {
      summary.add(
          onboardDocsLinkGenerator.generate(companyDto.getCompany().getOnboardDocsFolderId()));
    }
    if (xCloudOnlyOfferTo.isEmpty()
        || xCloudOnlyOfferTo.contains(companyDto.getCompany().getApiId().getApiId())) {
      summary.add(xCloudCrmLinkGenerator.generate(null));
    }
    return summary;
  }

  private Link createSelfRel(CompanyDto companyDto) {
    return linkTo(this.getControllerClass())
        .slash(companyDto.getCompany().getApiId())
        .withSelfRel();
  }

  private Link createMembersLink(CompanyDto companyDto) {
    return linkTo(this.getControllerClass())
        .slash(companyDto.getCompany().getApiId())
        .slash("members")
        .withRel("members");
  }
}
