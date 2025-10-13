package com.redesignhealth.company.api.entity;

import com.redesignhealth.company.api.client.search.entity.ExpertNoteSearchDoc;
import com.redesignhealth.company.api.client.search.entity.SearchResult;
import com.redesignhealth.company.api.dto.LinkRef;
import com.redesignhealth.company.api.entity.audit.Auditable;
import com.redesignhealth.company.api.entity.converter.ExpertNoteConverter;
import com.redesignhealth.company.api.entity.ref.CompanyRef;
import com.redesignhealth.company.api.entity.ref.ExpertNoteRef;
import com.vladmihalcea.hibernate.type.json.JsonBinaryType;
import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Transient;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;
import org.hibernate.annotations.Type;

@Getter
@Entity
public class ExpertNote extends Auditable {
  @Id @GeneratedValue private Long id;
  @Setter private String intervieweeName;
  @Setter private String intervieweeCompany;
  @Setter private String intervieweeEmail;
  @Setter private String noteTaker;
  @Setter private String type;

  @Setter
  @Column(name = "interview_source")
  private String sourceOfInterview;

  @Setter
  @Column(name = "profile_url")
  private String linkedInProfileHref;

  @Type(JsonBinaryType.class)
  @Column(columnDefinition = "jsonb", name = "tags")
  @Setter
  private List<String> additionalTags;

  @Type(JsonBinaryType.class)
  @Column(columnDefinition = "jsonb")
  @Setter
  private List<LinkRef> attachments;

  @Setter
  @ManyToMany
  @JoinTable(
      name = "expert_note_companies",
      joinColumns = {@JoinColumn(name = "expert_note_id", referencedColumnName = "id")},
      inverseJoinColumns = {@JoinColumn(name = "company_id", referencedColumnName = "id")})
  private Set<Company> companies;

  @Type(JsonBinaryType.class)
  @Column(columnDefinition = "jsonb")
  @Setter
  private List<String> stakeholders;

  @Setter
  @Column(name = "note_href")
  private String notesHref;

  @Setter
  @Column(name = "note_raw")
  private String notesRaw;

  @Column(name = "attachment_disclaimer_accepted")
  @Setter
  private Boolean isAttachmentDisclaimerAccepted;

  @Transient
  @Setter
  @Accessors(fluent = true)
  private boolean canAccess;

  @Transient @Setter private List<String> taxonomyTerm1;
  @Transient @Setter private List<String> taxonomyTerm2;
  @Transient @Setter private List<String> taxonomyTerm3;

  @Setter
  @Convert(converter = ExpertNoteConverter.class)
  private ExpertNoteRef apiId;

  @Transient @Setter private List<String> associatedEntities;
  @Transient @Setter private Map<String, List<String>> highlightedText;

  public static ExpertNote from(
      SearchResult<ExpertNoteSearchDoc> expertNoteSearchDoc,
      Map<CompanyRef, Company> allCompanies,
      boolean hasAccess,
      String apiId) {
    var entity = new ExpertNote();
    var source = expertNoteSearchDoc.getSource();
    entity.intervieweeName = source.getIntervieweeName();
    entity.intervieweeCompany = source.getIntervieweeCompany();
    entity.intervieweeEmail = source.getIntervieweeEmail();
    entity.type = source.getNoteType();
    entity.sourceOfInterview = source.getInterviewSource();
    entity.linkedInProfileHref = source.getLinkedInProfileHref();
    entity.additionalTags = source.getTags();
    entity.attachments = source.getAttachments();
    entity.noteTaker = source.getNoteTaker();
    entity.notesHref = source.getNoteHref();
    entity.notesRaw = source.getNoteRaw();
    entity.isAttachmentDisclaimerAccepted = source.getIsAttachmentDisclaimerAccepted();
    entity.stakeholders = source.getStakeholders();
    entity.canAccess = hasAccess;
    entity.taxonomyTerm1 = source.getTaxonomyTerm1();
    entity.taxonomyTerm2 = source.getTaxonomyTerm2();
    entity.taxonomyTerm3 = source.getTaxonomyTerm3();
    entity.associatedEntities = source.getAssociatedEntities();
    if (source.getCompanyApiCompanyIds() != null) {
      entity.companies =
          source.getCompanyApiCompanyIds().stream()
              .map(CompanyRef::of)
              .map(allCompanies::get)
              .filter(Objects::nonNull)
              .collect(Collectors.toSet());
    }
    entity.setCreated(source.getCreatedAt());
    entity.setHighlightedText(expertNoteSearchDoc.getHighlightedText());
    entity.apiId = ExpertNoteRef.of(apiId);
    return entity;
  }
}
