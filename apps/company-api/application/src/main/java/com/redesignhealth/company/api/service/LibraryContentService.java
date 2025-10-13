package com.redesignhealth.company.api.service;

import static com.redesignhealth.company.api.client.search.command.SearchIndex.CONTENT;
import static com.redesignhealth.company.api.exception.dto.FieldErrorType.EXISTS;
import static com.redesignhealth.company.api.exception.dto.FieldErrorType.INVALID_REFERENCE;
import static com.redesignhealth.company.api.exception.dto.FieldErrorType.NOT_NULL;
import static org.springframework.util.MimeTypeUtils.TEXT_PLAIN;

import com.redesignhealth.company.api.client.email.EmailSender;
import com.redesignhealth.company.api.client.file.GoogleDriveClient;
import com.redesignhealth.company.api.client.file.RemoteFileClient;
import com.redesignhealth.company.api.client.search.SearchClient;
import com.redesignhealth.company.api.client.search.command.SearchCommand;
import com.redesignhealth.company.api.client.search.command.SearchDeleteDocCommand;
import com.redesignhealth.company.api.client.search.command.SearchField;
import com.redesignhealth.company.api.client.search.command.SearchIndexCommand;
import com.redesignhealth.company.api.client.search.entity.LibraryContentSearchDoc;
import com.redesignhealth.company.api.dto.command.ContentCommand;
import com.redesignhealth.company.api.dto.command.LibraryFeedbackCommand;
import com.redesignhealth.company.api.dto.enums.RemoteContentSource;
import com.redesignhealth.company.api.entity.id.ApiIdGenerator;
import com.redesignhealth.company.api.entity.library.LibraryContent;
import com.redesignhealth.company.api.entity.ref.ContentRef;
import com.redesignhealth.company.api.entity.ref.LibraryRef;
import com.redesignhealth.company.api.exception.ContentNotFoundException;
import com.redesignhealth.company.api.exception.GoogleDriveException;
import com.redesignhealth.company.api.exception.InvalidFieldException;
import com.redesignhealth.company.api.exception.LibraryNotFoundException;
import com.redesignhealth.company.api.exception.SearchServerException;
import com.redesignhealth.company.api.exception.dto.FieldErrorDetails;
import com.redesignhealth.company.api.expansion.Expansion;
import com.redesignhealth.company.api.repository.ContentRepository;
import com.redesignhealth.company.api.repository.LibraryRepository;
import jakarta.annotation.Nullable;
import jakarta.transaction.Transactional;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.util.MimeTypeUtils;
import org.springframework.util.StringUtils;

@Service
public class LibraryContentService {
  private static final String PARENT_ID_FIELD = "parentId";
  private static final String LIBRARY_ID_FIELD = "libraryId";
  private final Logger logger = LoggerFactory.getLogger(LibraryContentService.class);
  private final ContentRepository contentRepository;
  private final LibraryRepository libraryRepository;
  private final SearchClient searchClient;
  private final GoogleDriveClient googleDriveClient;
  private final EmailSender emailSender;

  private final Map<RemoteContentSource, RemoteFileClient> remoteFileClients;

  public static final List<SearchField> FIELDS_TO_SEARCH =
      List.of(SearchField.of("title", 4), SearchField.of("description"), SearchField.of("content"));

  private final List<String> libraryFeedbackRecipients;

  public LibraryContentService(
      ContentRepository contentRepository,
      SearchClient searchClient,
      LibraryRepository libraryRepository,
      Map<RemoteContentSource, RemoteFileClient> remoteFileClients,
      GoogleDriveClient googleDriveClient,
      EmailSender emailSender,
      @Value("${library-feedback.recipients:}") List<String> libraryFeedbackRecipients) {
    this.contentRepository = contentRepository;
    this.searchClient = searchClient;
    this.libraryRepository = libraryRepository;
    this.remoteFileClients = remoteFileClients;
    this.googleDriveClient = googleDriveClient;
    this.emailSender = emailSender;
    this.libraryFeedbackRecipients = libraryFeedbackRecipients;
  }

  public LibraryContent get(ContentRef contentRef, List<Expansion> expansions) {
    var content = getLibraryContent(contentRef);
    if (content.getRemoteContentSource() != null) {
      var remoteFileClient = remoteFileClients.get(content.getRemoteContentSource());
      content.setContent(
          remoteFileClient.getDocument(content.getRemoteContentId(), MimeTypeUtils.TEXT_HTML));
    }
    hydrate(content, expansions);
    return content;
  }

  private LibraryContent getLibraryContent(ContentRef contentRef) {
    return contentRepository.findByApiId(contentRef).orElseThrow(ContentNotFoundException::new);
  }

  public Page<LibraryContent> search(
      String q, List<String> filters, Pageable pageable, List<Expansion> expansions) {
    var command =
        SearchCommand.builder()
            .query(q)
            .searchFilters(filters)
            .index(CONTENT)
            .fields(FIELDS_TO_SEARCH)
            .build();

    var searchResults = searchClient.search(command, pageable, LibraryContentSearchDoc.class);
    var ids =
        searchResults.map(result -> ContentRef.of(result.getSource().getId())).stream().toList();
    var entities = contentRepository.findByApiIdIn(ids).stream().toList();
    entities.forEach(e -> hydrate(e, expansions));
    Map<String, Integer> orderHelper = new HashMap<>();
    if (q != null) {
      // A fulltext search should preserve the order of results that OpenSearch returned
      for (int i = 0; i < ids.size(); ++i) {
        orderHelper.put(ids.get(i).getValue(), i);
      }
    } else {
      // Any other query should try to preserve the ordering recorded in the database
      for (int i = 0; i < entities.size(); ++i) {
        Integer orderId = entities.get(i).getOrderId();
        if (orderId != null) {
          orderHelper.put(entities.get(i).getApiId().getValue(), orderId);
        } else {
          orderHelper.put(entities.get(i).getApiId().getValue(), 0);
        }
      }
    }
    List<LibraryContent> sortableEntities = new ArrayList<>(entities);
    sortableEntities.sort(
        (a, b) ->
            orderHelper.get(a.getApiId().getValue()) - orderHelper.get(b.getApiId().getValue()));
    return new PageImpl<>(sortableEntities, pageable, searchResults.getTotalElements());
  }

  public Page<LibraryContent> search(
      @Nullable String q,
      List<String> filters,
      Pageable pageable,
      List<Expansion> expansions,
      LibraryRef libraryId) {
    if (!libraryRepository.existsByApiId(libraryId)) {
      throw new LibraryNotFoundException();
    }
    filters.add("libraryId," + libraryId.getApiId());
    return search(q, filters, pageable, expansions);
  }

  public LibraryContent create(ContentCommand command) {
    var content = createInternal(command);
    index(content.getApiId(), command);
    return content;
  }

  @Transactional
  private LibraryContent createInternal(ContentCommand command) {
    ContentRef newId = null;
    while (newId == null) {
      ContentRef potential = ContentRef.of(ApiIdGenerator.generate());
      if (!contentRepository.existsByApiId(potential)) {
        newId = potential;
      } else {
        logger.warn("ID: \"{}\" collision detected when creating content", potential);
      }
    }
    var parent = getParent(command.getParentId());
    var newContent = LibraryContent.from(newId, parent);
    return save(command, newContent);
  }

  public LibraryContent update(ContentRef apiId, ContentCommand command) {
    var updatedContent = updateInternal(apiId, command);
    index(apiId, command);
    return updatedContent;
  }

  @Transactional
  private LibraryContent updateInternal(ContentRef apiId, ContentCommand command) {
    var content = getLibraryContent(apiId);

    content = updatePaths(content, command.getParentId());

    return save(command, content);
  }

  @Transactional
  private LibraryContent updatePaths(LibraryContent content, ContentRef parentId) {
    if (parentId != content.getParentId()) {
      validateNewParentId(content.getApiId(), parentId);
      LibraryContent newParent = getParent(parentId);
      contentRepository.saveAll(updateSubtreePaths(newParent, content));
      content.setPath(updateAncestor(content, newParent, content));
    }
    return contentRepository.save(content);
  }

  private static void validateNewParentId(ContentRef contentId, ContentRef newParent) {
    if (contentId.equals(newParent)) {
      throw new InvalidFieldException(
          FieldErrorDetails.builder()
              .name(PARENT_ID_FIELD)
              .type(INVALID_REFERENCE)
              .rejectedValue(newParent.value())
              .build());
    }
  }

  private LibraryContent getParent(@Nullable ContentRef parentId) {
    if (parentId == null) {
      return null;
    }
    return contentRepository
        .findByApiId(parentId)
        .orElseThrow(
            () -> {
              throw new InvalidFieldException(
                  FieldErrorDetails.builder()
                      .name(PARENT_ID_FIELD)
                      .type(EXISTS)
                      .rejectedValue(parentId.value())
                      .build());
            });
  }

  private LibraryContent save(ContentCommand command, LibraryContent newContent) {
    newContent.setTitle(command.getTitle());
    newContent.setDescription(command.getDescription());
    newContent.setType(command.getType());
    newContent.setRemoteContentId(command.getRemoteContentId());
    newContent.setRemoteContentSource(command.getRemoteContentSource());
    newContent.setOrderId(command.getOrderId());

    if (command.getLibraryId() == null) {
      throw new InvalidFieldException(
          FieldErrorDetails.builder().name(LIBRARY_ID_FIELD).type(NOT_NULL).build());
    }

    var library =
        libraryRepository
            .findByApiId(command.getLibraryId())
            .orElseThrow(
                () -> {
                  throw new InvalidFieldException(
                      FieldErrorDetails.builder()
                          .name(LIBRARY_ID_FIELD)
                          .type(EXISTS)
                          .rejectedValue(command.getLibraryId().value())
                          .build());
                });
    newContent.setLibrary(library);
    return contentRepository.save(newContent);
  }

  private LibraryContentSearchDoc index(ContentRef apiId, ContentCommand contentCommand) {
    var documentBuilder =
        LibraryContentSearchDoc.builder()
            .id(apiId.value())
            .title(contentCommand.getTitle())
            .description(contentCommand.getDescription())
            .type(contentCommand.getType().name())
            .libraryId(contentCommand.getLibraryId().value());

    if (contentCommand.getRemoteContentSource() != null) {
      var remoteFileClient = remoteFileClients.get(contentCommand.getRemoteContentSource());
      // TODO: PDEV-418
      if (contentCommand.getRemoteContentSource() == RemoteContentSource.GOOGLE_DRIVE) {
        try {
          var content =
              googleDriveClient.getDocument(contentCommand.getRemoteContentId(), TEXT_PLAIN);
          documentBuilder.content(content);
        } catch (GoogleDriveException e) {
          logger.warn(
              "Can't get text/plain content to index for: " + contentCommand.getRemoteContentId(),
              e);
        }
      } else {
        documentBuilder.content(
            remoteFileClient.getDocument(contentCommand.getRemoteContentId(), TEXT_PLAIN));
      }
    }

    var document = documentBuilder.build();

    var searchIndexCommand =
        SearchIndexCommand.builder()
            .index(CONTENT)
            .documentId(document.getId())
            .document(document)
            .build();
    try {
      searchClient.index(searchIndexCommand);
    } catch (Exception e) {
      throw new SearchServerException(e);
    }
    return document;
  }

  private void hydrate(LibraryContent content, List<Expansion> expansions) {
    if (expansions.contains(Expansion.CHILDREN)) {
      content.setChildren(getChildren(content));
    }
    if (expansions.contains(Expansion.ANCESTORS)) {
      content.setAncestors(getAncestors(content));
    }
    if (expansions.contains(Expansion.DESCENDANTS)) {
      content.setDescendants(getDescendants(content));
    }
  }

  /**
   * @return all ancestors at any level above the content
   */
  private Set<LibraryContent> getAncestors(@Nullable LibraryContent content) {
    if (content.isRootNode()) {
      return null;
    }

    return contentRepository.findByApiIdIn(content.getAncestorIds());
  }

  /**
   * @return immediate descendants of content
   */
  private Set<LibraryContent> getChildren(LibraryContent content) {
    return contentRepository.findByPath(content.getFullPath());
  }

  /**
   * @return all descendants at any level below the content
   */
  private Set<LibraryContent> getDescendants(LibraryContent content) {
    return contentRepository.findByPathStartsWith(content.getFullPath());
  }

  private static String updateAncestor(
      LibraryContent oldAncestor, LibraryContent newAncestor, LibraryContent content) {
    var newAncestorPath = newAncestor != null ? newAncestor.getFullPath() : "";
    var newPath = "";
    if (oldAncestor.isRootNode()) {
      newPath = newAncestorPath + Objects.toString(content.getPath(), "");
    } else {
      newPath = content.getPath().replace(oldAncestor.getPath(), newAncestorPath);
    }
    return StringUtils.hasText(newPath) ? newPath : null;
  }

  private Set<LibraryContent> updateSubtreePaths(
      LibraryContent newAncestor, LibraryContent content) {
    var descendants = getDescendants(content);
    for (var descendant : descendants) {
      descendant.setPath(updateAncestor(content, newAncestor, descendant));
    }
    return descendants;
  }

  public LibraryContent move(ContentRef id, ContentRef parentId) {
    var content = getLibraryContent(id);
    updatePaths(getLibraryContent(id), parentId);
    return content;
  }

  public void delete(ContentRef id) {
    searchClient.delete(
        SearchDeleteDocCommand.builder().index(CONTENT).documentId(id.getValue()).build());
    deleteInternal(id);
  }

  /**
   * Delete content. Descendant nodes will become descendants of content's parent. If content was a
   * root node, child nodes become root level nodes.
   */
  @Transactional
  public void deleteInternal(ContentRef id) {
    var content = getLibraryContent(id);
    var descendants = getDescendants(content);
    for (var descendant : descendants) {
      descendant.removeSegment(content.getApiId());
    }
    contentRepository.saveAll(descendants);
    contentRepository.delete(content);
  }

  public void parseLibraryFeedback(ContentRef Id, LibraryFeedbackCommand command) {
    emailSender.sendLibraryFeedback(libraryFeedbackRecipients, command);
  }
}
