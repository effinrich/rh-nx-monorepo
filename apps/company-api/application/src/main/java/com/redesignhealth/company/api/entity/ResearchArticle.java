package com.redesignhealth.company.api.entity;

import com.redesignhealth.company.api.client.search.entity.ResearchExternalContentDoc;
import com.redesignhealth.company.api.dto.LinkRef;
import com.redesignhealth.company.api.dto.command.ResearchArticleCommand;
import com.redesignhealth.company.api.entity.audit.Auditable;
import com.redesignhealth.company.api.entity.converter.ResearchArticleRefConverter;
import com.redesignhealth.company.api.entity.ref.ResearchArticleRef;
import com.vladmihalcea.hibernate.type.json.JsonBinaryType;
import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import java.util.List;
import java.util.Set;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.Type;

@Getter
@Entity(name = "research_external_content")
public class ResearchArticle extends Auditable {
  @Id @GeneratedValue private Long id;

  @Convert(converter = ResearchArticleRefConverter.class)
  private ResearchArticleRef apiId;

  @Setter private String title;
  @Setter private String type;
  @Setter private String href;

  @Type(JsonBinaryType.class)
  @Column(columnDefinition = "jsonb")
  @Setter
  private List<String> stakeholders;

  @ManyToMany @Setter private Set<Company> companies;

  @Column(name = "tags", columnDefinition = "jsonb")
  @Type(JsonBinaryType.class)
  @Setter
  private List<String> additionalTags;

  @Type(JsonBinaryType.class)
  @Column(columnDefinition = "jsonb")
  @Setter
  private List<LinkRef> attachments;

  @Setter private Boolean attachmentDisclaimerAccepted;

  public static ResearchArticle of(ResearchArticleRef apiId) {
    var entity = new ResearchArticle();
    entity.apiId = apiId;
    return entity;
  }

  public static ResearchArticle from(
      ResearchArticleCommand command, Set<Company> companies, ResearchArticleRef apiId) {
    var researchArticle = ResearchArticle.of(apiId);
    researchArticle.title = command.getTitle();
    researchArticle.type = command.getType();
    researchArticle.href = command.getArticleHref();
    researchArticle.stakeholders = command.getStakeholders();
    researchArticle.companies = companies;
    researchArticle.additionalTags = command.getAdditionalTags();
    researchArticle.attachments = command.getAttachments();
    researchArticle.attachmentDisclaimerAccepted = command.getIsAttachmentDisclaimerAccepted();
    return researchArticle;
  }

  public static ResearchArticle from(
      ResearchExternalContentDoc researchExternalContentDoc, Set<Company> companies) {
    var researchArticle =
        ResearchArticle.of(ResearchArticleRef.of(researchExternalContentDoc.getId()));
    researchArticle.title = researchExternalContentDoc.getName();
    researchArticle.type = researchExternalContentDoc.getType();
    researchArticle.href = researchExternalContentDoc.getHref();
    researchArticle.stakeholders = researchExternalContentDoc.getStakeholders();
    researchArticle.companies = companies;
    researchArticle.additionalTags = researchExternalContentDoc.getTags();
    researchArticle.attachments = researchExternalContentDoc.getAttachments();
    researchArticle.setCreated(researchExternalContentDoc.getCreatedAt());
    researchArticle.setCreatedBy(researchExternalContentDoc.getNoteTaker());
    return researchArticle;
  }
}
