package com.redesignhealth.company.api.dto;

import com.redesignhealth.company.api.assembler.RequestFormAssembler;
import com.redesignhealth.company.api.entity.request.InfrastructureRequest;
import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;
import org.hibernate.Hibernate;
import org.springframework.hateoas.RepresentationModel;

public class InfraRequestSummary extends RepresentationModel<InfraRequestSummary> {
  @Schema(example = "PROJECT-1")
  private String jiraIssueId;

  @Schema(requiredMode = Schema.RequiredMode.REQUIRED)
  private SerializableEnum status;

  private List<RequestFormSummary> forms;

  public static InfraRequestSummary from(InfrastructureRequest infraRequest) {
    var summary = new InfraRequestSummary();
    summary.jiraIssueId = infraRequest.getJiraIssueId();
    summary.status = infraRequest.getStatus();
    if (Hibernate.isInitialized(infraRequest.getForms())) {
      if (null != infraRequest.getForms()) {
        var requestFormAssembler = new RequestFormAssembler();
        summary.forms =
            infraRequest.getForms().stream().map(requestFormAssembler::toModel).toList();
      }
    }
    return summary;
  }

  public String getJiraIssueId() {
    return jiraIssueId;
  }

  public SerializableEnum getStatus() {
    return status;
  }

  public List<RequestFormSummary> getForms() {
    return forms;
  }
}
