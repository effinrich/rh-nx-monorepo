package com.redesignhealth.company.api.dto;

import com.redesignhealth.company.api.entity.library.LibraryContent;
import java.util.List;
import lombok.Getter;
import org.springframework.hateoas.RepresentationModel;

@Getter
public class LibraryContentSummary extends RepresentationModel<LibraryContentSummary> {
  private final String id;
  private final String title;
  private final String description;
  private final SerializableEnum type;
  private final String content;

  private String parentId;
  private List<LibraryContentSummary> ancestors;
  private List<LibraryContentSummary> children;
  private List<LibraryContentSummary> descendants;
  private final String remoteContentId;
  private final SerializableEnum remoteContentSource;
  private final Integer orderId;

  private LibraryContentSummary(LibraryContent content) {
    this.id = content.getApiId().value();
    this.title = content.getTitle();
    this.description = content.getDescription();
    this.type = content.getType();
    if (content.getParentId() != null) {
      this.parentId = content.getParentId().value();
    }
    this.remoteContentId = content.getRemoteContentId();
    this.remoteContentSource = content.getRemoteContentSource();
    this.content = content.getContent();
    this.orderId = content.getOrderId();
  }

  public static LibraryContentSummary from(LibraryContent content) {
    var summary = new LibraryContentSummary(content);
    if (content.getAncestors() != null) {
      summary.ancestors = content.getAncestors().stream().map(LibraryContentSummary::new).toList();
    }
    if (content.getChildren() != null) {
      summary.children = content.getChildren().stream().map(LibraryContentSummary::new).toList();
    }
    if (content.getDescendants() != null) {
      summary.descendants =
          content.getDescendants().stream().map(LibraryContentSummary::new).toList();
    }
    return summary;
  }
}
