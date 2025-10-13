package com.redesignhealth.company.api.client.search.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.redesignhealth.company.api.dto.LinkRef;
import com.redesignhealth.company.api.dto.command.ExpertNoteCommand;
import com.redesignhealth.company.api.entity.Company;
import com.redesignhealth.company.api.entity.ref.Ref;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ExpertNoteSearchDoc {
  public static final String INTERVIEWEE_NAME_FIELD = "interviewee_name";
  public static final String INTERVIEWEE_COMPANY_FIELD = "interviewee_company";
  public static final String INTERVIEWEE_EMAIL_FIELD = "interviewee_email";
  public static final String INTERVIEW_SOURCE_FIELD = "interview_source";
  public static final String NOTE_TAKER_FIELD = "note_taker";
  public static final String TYPE_FIELD = "type";
  public static final String ASSOCIATED_ENTITIES_FIELD = "associated_entities";
  public static final String LINKED_IN_PROFILE_HREF_FIELD = "linked_in_profile_href";
  public static final String STAKEHOLDERS_FIELD = "stakeholders";
  public static final String TAGS_FIELD = "tags";
  public static final String ATTACHMENTS_FIELD = "attachments";
  public static final String COMPANY_API_COMPANY_IDS_FIELD = "company_api_company_id";
  public static final String NOTE_RAW_FIELD = "note_raw";
  public static final String NOTE_HREF_FIELD = "note_href";
  public static final String IS_ATTACHMENT_DISCLAIMER_ACCEPTED_FIELD =
      "is_attachment_disclaimer_accepted";
  public static final String TAXONOMY_TERM_1_FIELD = "taxonomy_term_1";
  public static final String TAXONOMY_TERM_2_FIELD = "taxonomy_term_2";
  public static final String TAXONOMY_TERM_3_FIELD = "taxonomy_term_3";

  @JsonProperty(INTERVIEWEE_NAME_FIELD)
  private String intervieweeName;

  @JsonProperty(INTERVIEWEE_COMPANY_FIELD)
  private String intervieweeCompany;

  @JsonProperty(NOTE_TAKER_FIELD)
  private String noteTaker;

  @JsonProperty("created_at")
  private Instant createdAt;

  @JsonProperty(TYPE_FIELD)
  private String noteType;

  @JsonProperty(INTERVIEW_SOURCE_FIELD)
  private String interviewSource;

  @JsonProperty(ASSOCIATED_ENTITIES_FIELD)
  private List<String> associatedEntities;

  @JsonProperty(INTERVIEWEE_EMAIL_FIELD)
  private String intervieweeEmail;

  @JsonProperty(LINKED_IN_PROFILE_HREF_FIELD)
  private String linkedInProfileHref;

  @JsonProperty(STAKEHOLDERS_FIELD)
  private List<String> stakeholders;

  @JsonProperty(TAGS_FIELD)
  private List<String> tags;

  @JsonProperty(ATTACHMENTS_FIELD)
  private List<LinkRef> attachments;

  @JsonProperty(COMPANY_API_COMPANY_IDS_FIELD)
  private List<String> companyApiCompanyIds;

  @JsonProperty(NOTE_RAW_FIELD)
  private String noteRaw;

  @JsonProperty(NOTE_HREF_FIELD)
  private String noteHref;

  @JsonProperty(IS_ATTACHMENT_DISCLAIMER_ACCEPTED_FIELD)
  private Boolean isAttachmentDisclaimerAccepted;

  @JsonProperty(TAXONOMY_TERM_1_FIELD)
  private List<String> taxonomyTerm1;

  @JsonProperty(TAXONOMY_TERM_2_FIELD)
  private List<String> taxonomyTerm2;

  @JsonProperty(TAXONOMY_TERM_3_FIELD)
  private List<String> taxonomyTerm3;

  public static ExpertNoteSearchDoc from(
      ExpertNoteCommand command, Collection<Company> associatedCompanies, String noteRaw) {
    var builder =
        ExpertNoteSearchDoc.builder()
            .intervieweeName(command.getIntervieweeName())
            .intervieweeCompany(command.getIntervieweeCompany())
            .noteTaker(command.getNoteTaker().value())
            .noteType(command.getType())
            .interviewSource(command.getSourceOfInterview())
            .linkedInProfileHref(command.getLinkedInProfileHref())
            .stakeholders(command.getStakeholders())
            .tags(command.getAdditionalTags())
            .attachments(command.getAttachments())
            .noteRaw(noteRaw)
            .noteHref(command.getNoteHref())
            .isAttachmentDisclaimerAccepted(command.getIsAttachmentDisclaimerAccepted())
            .createdAt(Instant.now());

    if (command.getIntervieweeEmail() != null) {
      builder.intervieweeEmail(command.getIntervieweeEmail().value());
    }
    if (command.getCompanyIds() != null) {
      builder.companyApiCompanyIds(command.getCompanyIds().stream().map(Ref::value).toList());
    }
    if (associatedCompanies != null) {
      builder.associatedEntities(associatedCompanies.stream().map(Company::getName).toList());
      addTaxonomyTerms(builder, associatedCompanies);
    }

    return builder.build();
  }

  private static void addTaxonomyTerms(
      ExpertNoteSearchDocBuilder builder, Collection<Company> associatedCompanies) {
    Map<Integer, List<String>> terms = new HashMap<>();
    associatedCompanies.stream()
        .map(Company::getTaxonomyTerms)
        .filter(Objects::nonNull)
        .flatMap(Collection::stream)
        .forEach(
            term -> {
              if (!terms.containsKey(term.getLevel())) {
                terms.put(term.getLevel(), new ArrayList<>());
              }
              terms.get(term.getLevel()).add(term.getDisplayName());
            });
    builder.taxonomyTerm1(terms.get(1));
    builder.taxonomyTerm2(terms.get(2));
    builder.taxonomyTerm3(terms.get(3));
  }
}
