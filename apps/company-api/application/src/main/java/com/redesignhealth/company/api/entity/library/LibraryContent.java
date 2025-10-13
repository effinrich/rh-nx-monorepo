package com.redesignhealth.company.api.entity.library;

import com.redesignhealth.company.api.dto.enums.LibraryContentType;
import com.redesignhealth.company.api.dto.enums.RemoteContentSource;
import com.redesignhealth.company.api.entity.audit.Auditable;
import com.redesignhealth.company.api.entity.converter.ContentRefConverter;
import com.redesignhealth.company.api.entity.ref.ContentRef;
import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Transient;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import lombok.Getter;
import lombok.Setter;
import org.springframework.util.StringUtils;

/**
 * A piece of content (ex. document, template, file).
 *
 * <p>Content hierarchy is stored using the Materialized Path Architecture: <a
 * href="https://www.mongodb.com/docs/manual/tutorial/model-tree-structures-with-materialized-paths/">Link</a>.
 *
 * <p>Each node has a `path`
 *
 * <p>Path == null represents a root level node (multiple nodes can be root nodes).
 *
 * <p>Path != null represents a node with n number of parent nodes.
 *
 * <p>Paths are delimited with the "." character. Below is an example of 4 {@link LibraryContent}
 * nodes: A, B, C, and D.
 *
 * <pre>
 * A
 *  \
 *   B
 *  / \
 * D   C
 * </pre>
 *
 * <li>A's Path is null
 * <li>B's Path is A.
 * <li>D's Path is A.B.
 */
@Entity
public class LibraryContent extends Auditable {

  @Id @GeneratedValue private Long id;

  @ManyToOne @Getter @Setter private Library library;

  @Column(unique = true)
  @Convert(converter = ContentRefConverter.class)
  private ContentRef apiId;

  private String path;
  private String title;
  private String description;

  @Enumerated(EnumType.STRING)
  private LibraryContentType type;

  @Enumerated(EnumType.STRING)
  private RemoteContentSource remoteContentSource;

  private String remoteContentId;

  @Getter @Setter private Integer orderId;

  @Transient private Set<LibraryContent> ancestors;

  @Transient private Set<LibraryContent> children;

  @Transient private Set<LibraryContent> descendants;

  @Transient private String content;

  private static final String PATH_DELIMITER = ".";

  public static LibraryContent from(ContentRef apiId) {
    return from(apiId, null);
  }

  public static LibraryContent from(ContentRef apiId, LibraryContent parent) {
    var entity = new LibraryContent();
    if (parent != null) {
      entity.path = Objects.toString(parent.path, "") + parent.apiId + PATH_DELIMITER;
    }
    entity.apiId = apiId;
    return entity;
  }

  /**
   *
   *
   * <pre>
   * A
   *  \
   *   B
   *  / \
   * D   C
   * </pre>
   *
   * In the tree above, C's "full path" would be "A.B.C."
   *
   * @return a nodes path including itself
   */
  public String getFullPath() {
    return Objects.toString(path, "") + apiId + PATH_DELIMITER;
  }

  public ContentRef getApiId() {
    return apiId;
  }

  /**
   *
   *
   * <pre>
   * A
   *  \
   *   B
   *  / \
   * D   C
   * </pre>
   *
   * In the tree above, C's "path" would be "A.B."
   *
   * @return a nodes path including itself
   */
  public String getPath() {
    return path;
  }

  public String getTitle() {
    return title;
  }

  public String getDescription() {
    return description;
  }

  public LibraryContentType getType() {
    return type;
  }

  public void setTitle(String title) {
    this.title = title;
  }

  public void setDescription(String description) {
    this.description = description;
  }

  public void setType(LibraryContentType type) {
    this.type = type;
  }

  public Set<LibraryContent> getAncestors() {
    return ancestors;
  }

  public void setAncestors(Set<LibraryContent> ancestors) {
    this.ancestors = ancestors;
  }

  public Set<LibraryContent> getChildren() {
    return children;
  }

  public ContentRef getParentId() {
    var ancestors = getAncestorIds();
    return ancestors.isEmpty() ? null : ancestors.get(ancestors.size() - 1);
  }

  public List<ContentRef> getAncestorIds() {
    if (isRootNode()) {
      return List.of();
    }

    return Arrays.stream(path.split("\\" + PATH_DELIMITER)).map(ContentRef::of).toList();
  }

  public boolean isRootNode() {
    return path == null;
  }

  public void setPath(String path) {
    this.path = path;
  }

  public RemoteContentSource getRemoteContentSource() {
    return remoteContentSource;
  }

  public void setRemoteContentSource(RemoteContentSource remoteContentSource) {
    this.remoteContentSource = remoteContentSource;
  }

  public String getRemoteContentId() {
    return remoteContentId;
  }

  public void setRemoteContentId(String remoteContentId) {
    this.remoteContentId = remoteContentId;
  }

  public Set<LibraryContent> getDescendants() {
    return descendants;
  }

  public void setDescendants(Set<LibraryContent> descendants) {
    this.descendants = descendants;
  }

  public void setChildren(Set<LibraryContent> children) {
    this.children = children;
  }

  public String getContent() {
    return content;
  }

  public void setContent(String content) {
    this.content = content;
  }

  public void removeSegment(ContentRef apiId) {
    if (!this.isRootNode()) {
      this.path = this.path.replace(apiId + PATH_DELIMITER, "");
    }
    if (!StringUtils.hasText(this.path)) {
      this.path = null;
    }
  }
}
