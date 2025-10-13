package com.redesignhealth.company.api.assembler;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;

import com.redesignhealth.company.api.assembler.google.OnboardDocsLinkGenerator;
import com.redesignhealth.company.api.controller.CompanyController;
import com.redesignhealth.company.api.dto.CompanySummary;
import com.redesignhealth.company.api.entity.Company;
import org.springframework.hateoas.Link;
import org.springframework.hateoas.server.mvc.RepresentationModelAssemblerSupport;
import org.springframework.stereotype.Component;

@Component
public class CompanyAssembler extends RepresentationModelAssemblerSupport<Company, CompanySummary> {

  private LinkGenerator onboardDocsLinkGenerator;

  public CompanyAssembler(OnboardDocsLinkGenerator onboardDocsLinkGenerator) {
    super(CompanyController.class, CompanySummary.class);
    this.onboardDocsLinkGenerator = onboardDocsLinkGenerator;
  }

  @Override
  public CompanySummary toModel(Company company) {
    var summary =
        CompanySummary.from(company).add(createSelfRel(company)).add(createMembersLink(company));

    if (company.getOnboardDocsFolderId() != null) {
      summary.add(onboardDocsLinkGenerator.generate(company.getOnboardDocsFolderId()));
    }
    return summary;
  }

  private Link createSelfRel(Company company) {
    return linkTo(this.getControllerClass()).slash(company.getApiId()).withSelfRel();
  }

  private Link createMembersLink(Company company) {
    return linkTo(this.getControllerClass())
        .slash(company.getApiId())
        .slash("members")
        .withRel("members");
  }
}
