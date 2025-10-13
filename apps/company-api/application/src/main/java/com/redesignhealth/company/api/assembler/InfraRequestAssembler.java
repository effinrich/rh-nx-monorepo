package com.redesignhealth.company.api.assembler;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;

import com.redesignhealth.company.api.assembler.jira.JiraLinkGenerator;
import com.redesignhealth.company.api.controller.InfraRequestController;
import com.redesignhealth.company.api.dto.InfraRequestSummary;
import com.redesignhealth.company.api.entity.request.InfrastructureRequest;
import org.springframework.hateoas.Link;
import org.springframework.hateoas.server.mvc.RepresentationModelAssemblerSupport;
import org.springframework.stereotype.Component;

@Component
public class InfraRequestAssembler
    extends RepresentationModelAssemblerSupport<InfrastructureRequest, InfraRequestSummary> {

  private final JiraLinkGenerator jiraLinkGenerator;

  public InfraRequestAssembler(JiraLinkGenerator jiraLinkGenerator) {
    super(InfraRequestController.class, InfraRequestSummary.class);
    this.jiraLinkGenerator = jiraLinkGenerator;
  }

  @Override
  public InfraRequestSummary toModel(InfrastructureRequest infraRequest) {
    var summary = InfraRequestSummary.from(infraRequest).add(createSelfRel(infraRequest));

    if (null != infraRequest.getJiraIssueId()) {
      summary.add(jiraLinkGenerator.generate(infraRequest.getJiraIssueId()));
    }

    return summary;
  }

  private Link createSelfRel(InfrastructureRequest infraRequest) {
    return linkTo(this.getControllerClass())
        .slash(infraRequest.getCompany().getApiId())
        .withSelfRel();
  }
}
