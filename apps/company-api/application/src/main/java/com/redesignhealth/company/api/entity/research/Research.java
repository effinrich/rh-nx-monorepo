package com.redesignhealth.company.api.entity.research;

import com.redesignhealth.company.api.client.search.entity.ResearchAuthor;
import com.redesignhealth.company.api.client.search.entity.ResearchSearchDoc;
import com.redesignhealth.company.api.client.search.entity.SearchResult;
import com.redesignhealth.company.api.dto.LinkRef;
import com.redesignhealth.company.api.entity.Company;
import com.redesignhealth.company.api.entity.audit.Auditable;
import com.redesignhealth.company.api.entity.converter.ResearchRefConverter;
import com.redesignhealth.company.api.entity.ref.ResearchRef;
import com.vladmihalcea.hibernate.type.json.JsonBinaryType;
import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Transient;
import java.util.List;
import java.util.Map;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.Type;

@Getter
@Entity
public class Research extends Auditable {

  @Id @GeneratedValue private Long id;

  @Setter private String title;

  @Type(JsonBinaryType.class)
  @Column(columnDefinition = "jsonb")
  @Setter
  private List<ResearchAuthor> authors;

  @Setter private String researchObjectives;

  @Type(JsonBinaryType.class)
  @Column(columnDefinition = "jsonb")
  @Setter
  private List<String> researchServices;

  @Type(JsonBinaryType.class)
  @Column(columnDefinition = "jsonb")
  @Setter
  private List<String> methods;

  @Type(JsonBinaryType.class)
  @Column(columnDefinition = "jsonb")
  @Setter
  private List<String> specializedMethods;

  @Setter private Long researchSampleSize;

  @Type(JsonBinaryType.class)
  @Column(columnDefinition = "jsonb")
  @Setter
  private List<String> toplineSegments;

  @Type(JsonBinaryType.class)
  @Column(columnDefinition = "jsonb")
  @Setter
  private List<String> patientSegments;

  @Setter private String teamRole;

  @Type(JsonBinaryType.class)
  @Column(columnDefinition = "jsonb")
  @Setter
  private List<LinkRef> documentLinks;

  @ManyToOne @Setter private Company company;

  @Convert(converter = ResearchRefConverter.class)
  @Setter
  private ResearchRef apiId;

  @Transient @Setter private boolean canAccess;
  @Transient private Map<String, List<String>> highlightedText;

  public static Research from(SearchResult<ResearchSearchDoc> researchSearchDoc) {
    var entity = new Research();
    var source = researchSearchDoc.getSource();
    entity.apiId = ResearchRef.of(source.getId());
    entity.title = source.getSprintName();
    entity.authors = source.getAuthors();
    entity.researchObjectives = source.getResearchObjectives();
    entity.researchServices = source.getResearchServices();
    entity.methods = source.getMethods();
    entity.specializedMethods = source.getSpecializedMethods();
    entity.researchSampleSize = source.getResearchSampleSize();
    entity.toplineSegments = source.getToplineSegments();
    entity.patientSegments = source.getPatientSegments();
    entity.documentLinks = source.getDocumentLinks();
    entity.teamRole = source.getTeamRole();
    entity.setCreated(source.getCreatedAt());
    entity.apiId = ResearchRef.of(source.getId());
    entity.canAccess = true;
    return entity;
  }

  public static Research from(
      SearchResult<ResearchSearchDoc> researchSearchDoc, Company company, boolean canAccess) {
    var entity = from(researchSearchDoc);
    entity.company = company;
    entity.canAccess = canAccess;
    entity.highlightedText = researchSearchDoc.getHighlightedText();
    return entity;
  }

  public static Research of(ResearchRef apiId) {
    var research = new Research();
    research.apiId = apiId;
    return research;
  }
}
