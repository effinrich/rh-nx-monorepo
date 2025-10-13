package com.redesignhealth.company.api.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.redesignhealth.company.api.entity.ExpertNote;
import io.swagger.v3.oas.annotations.media.Schema;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import lombok.Getter;
import lombok.experimental.Accessors;
import org.springframework.hateoas.RepresentationModel;

@Getter
public class ExpertNoteSummary extends RepresentationModel<ExpertNoteSummary> {

  private String id;
  private static final String CAN_ACCESS_FIELD = "canAccess";

  @Schema(example = "Jane Doe")
  private String intervieweeName;

  @Schema(example = "Redesign Health")
  private String intervieweeCompany;

  @Schema(example = "jane.doe@example.com")
  private String intervieweeEmail;

  @Schema(example = "test@redesignhealth.com")
  private String noteTaker;

  @Schema(example = "2023-06-29T00:00:00Z")
  private Instant created;

  @Schema(example = "Expert Call")
  private String type;

  @Schema(example = "Organically Sourced (Paid)")
  private String sourceOfInterview;

  private List<CompanyReducedInfo> companies;

  @Schema(example = "https://example.com")
  private String linkedInProfileHref;

  @Schema(example = "[\"tag\"]")
  private List<String> additionalTags;

  @Schema(example = "[{ \"href\": \"https://example.com\", \"name\": \"report\" }]")
  private List<LinkRef> attachments;

  @Schema(example = "Notes")
  private String noteRaw;

  @Schema(example = "https://example.com")
  private String noteHref;

  @Schema(example = "true")
  private Boolean isAttachmentDisclaimerAccepted;

  @Schema(example = "[\"Government\"]")
  private List<String> stakeholders;

  @Schema(example = "[\"CARE_DELIVERY\"]")
  private List<String> taxonomyTag1;

  @Schema(example = "[\"CLINICAL_OPERATIONS\"]")
  private List<String> taxonomyTag2;

  @Schema(example = "[\"CARE_TEAM_COORDINATION\"]")
  private List<String> taxonomyTag3;

  @Schema(example = "")
  private List<String> associatedEntities;

  @Schema(example = "true")
  @Accessors(fluent = true)
  @JsonProperty(CAN_ACCESS_FIELD)
  private boolean canAccess;

  @Schema(example = """
    {
      "title": "Research <em>Summary</em>"
    }
    """)
  private Map<String, List<String>> highlightedText;

  public static ExpertNoteSummary from(ExpertNote expertNote) {
    var summary = new ExpertNoteSummary();
    summary.intervieweeName = expertNote.getIntervieweeName();
    summary.intervieweeCompany = expertNote.getIntervieweeCompany();
    summary.noteTaker = expertNote.getNoteTaker();
    summary.created = expertNote.getCreated();
    summary.type = expertNote.getType();
    summary.sourceOfInterview = expertNote.getSourceOfInterview();
    if (expertNote.getCompanies() != null) {
      summary.companies = expertNote.getCompanies().stream().map(CompanyReducedInfo::from).toList();
    }
    summary.intervieweeEmail = expertNote.getIntervieweeEmail();
    summary.linkedInProfileHref = expertNote.getLinkedInProfileHref();
    summary.additionalTags = expertNote.getAdditionalTags();
    summary.attachments = expertNote.getAttachments();
    summary.stakeholders = expertNote.getStakeholders();
    summary.noteHref = expertNote.getNotesHref();
    summary.noteRaw = expertNote.getNotesRaw();
    summary.isAttachmentDisclaimerAccepted = expertNote.getIsAttachmentDisclaimerAccepted();
    summary.taxonomyTag1 = expertNote.getTaxonomyTerm1();
    summary.taxonomyTag2 = expertNote.getTaxonomyTerm2();
    summary.taxonomyTag3 = expertNote.getTaxonomyTerm3();
    summary.canAccess = expertNote.canAccess();
    summary.id = (expertNote.getApiId() != null) ? expertNote.getApiId().value() : "";
    summary.associatedEntities = expertNote.getAssociatedEntities();
    summary.highlightedText = expertNote.getHighlightedText();
    return summary;
  }
}
