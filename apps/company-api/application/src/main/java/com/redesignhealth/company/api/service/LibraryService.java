package com.redesignhealth.company.api.service;

import static org.springframework.util.MimeTypeUtils.TEXT_HTML;
import static org.springframework.util.MimeTypeUtils.TEXT_PLAIN;

import com.redesignhealth.company.api.client.file.GoogleDriveClient;
import com.redesignhealth.company.api.client.file.GoogleDriveClientImpl;
import com.redesignhealth.company.api.client.file.RemoteFileClient;
import com.redesignhealth.company.api.client.search.SearchClient;
import com.redesignhealth.company.api.client.search.command.SearchCommand;
import com.redesignhealth.company.api.client.search.command.SearchFilterOptionsCommand;
import com.redesignhealth.company.api.client.search.command.SearchGetCommand;
import com.redesignhealth.company.api.client.search.command.SearchIndex;
import com.redesignhealth.company.api.client.search.command.SearchIndexCommand;
import com.redesignhealth.company.api.client.search.entity.FilterOptions;
import com.redesignhealth.company.api.client.search.entity.SearchResult;
import com.redesignhealth.company.api.client.search.entity.Term;
import com.redesignhealth.company.api.document.Topic;
import com.redesignhealth.company.api.dto.LibraryCommand;
import com.redesignhealth.company.api.dto.command.TopicCommand;
import com.redesignhealth.company.api.dto.enums.RemoteContentSource;
import com.redesignhealth.company.api.entity.id.ApiIdGenerator;
import com.redesignhealth.company.api.entity.library.Library;
import com.redesignhealth.company.api.entity.ref.LibraryRef;
import com.redesignhealth.company.api.entity.ref.PersonRef;
import com.redesignhealth.company.api.exception.LibraryNotFoundException;
import com.redesignhealth.company.api.exception.SearchServerException;
import com.redesignhealth.company.api.exception.TopicNotFoundException;
import com.redesignhealth.company.api.repository.LibraryRepository;
import jakarta.transaction.Transactional;
import java.util.List;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class LibraryService {
  private static final Logger logger = LoggerFactory.getLogger(LibraryService.class);
  private final SearchClient searchClient;
  private static final String REDESIGN_HEALTH_FOLDER_NAME = "Redesign Health Exports";
  private final GoogleDriveClient googleDriveClient;
  private final Map<RemoteContentSource, RemoteFileClient> remoteFileClients;
  private final LibraryRepository libraryRepository;

  @Value("${google.service.email}")
  private String googleServiceEmail;

  public LibraryService(
      SearchClient searchClient,
      GoogleDriveClient googleDriveClient,
      Map<RemoteContentSource, RemoteFileClient> remoteFileClients,
      LibraryRepository libraryRepository) {
    this.searchClient = searchClient;
    this.googleDriveClient = googleDriveClient;
    this.remoteFileClients = remoteFileClients;
    this.libraryRepository = libraryRepository;
  }

  public Page<Topic> search(String query, List<String> filters, Pageable pageable) {
    return searchClient
        .search(
            SearchCommand.builder()
                .query(query)
                .searchFilters(filters)
                .index(SearchIndex.TOPIC)
                .build(),
            pageable,
            Topic.class)
        .map(SearchResult::getSource);
  }

  public Topic get(String id) {
    var topic =
        searchClient
            .get(
                SearchGetCommand.builder().index(SearchIndex.TOPIC).documentId(id).build(),
                Topic.class)
            .orElseThrow(TopicNotFoundException::new)
            .getSource();

    String output =
        remoteFileClients.get(RemoteContentSource.GOOGLE_DRIVE).getDocument(id, TEXT_HTML);
    topic.setContent(output);

    return topic;
  }

  public Topic index(String id, TopicCommand command) {
    var documentText =
        remoteFileClients.get(RemoteContentSource.GOOGLE_DRIVE).getDocument(id, TEXT_PLAIN);
    var document =
        Topic.builder()
            .id(id)
            .title(command.getTitle())
            .description(command.getDescription())
            .category(command.getCategory())
            .type(command.getType())
            .content(documentText)
            .metadata(command.getMetadata())
            .build();
    try {
      searchClient.index(
          SearchIndexCommand.builder()
              .index(SearchIndex.TOPIC)
              .documentId(document.getId())
              .document(document)
              .build());
    } catch (Exception e) {
      throw new SearchServerException(e);
    }
    return document;
  }

  public List<Term> getCategories() {
    final var CATEGORY_FIELD_NAME = "category";
    var command =
        SearchFilterOptionsCommand.builder()
            .index(SearchIndex.TOPIC)
            .fields(List.of(CATEGORY_FIELD_NAME))
            .build();

    var filterOptions = searchClient.getFilterOptions(command);
    var categoryOptions =
        !filterOptions.isEmpty() ? filterOptions.get(0) : FilterOptions.builder().build();

    return categoryOptions.getTerms().stream()
        .map(f -> Term.of(f.getKeyword(), f.getCount()))
        .toList();
  }

  /**
   * Copy a file (shared with our service account) to a customer's Google Drive.
   *
   * @param fileId source Google Drive file to copy
   * @param accessToken customer OAuth access token granting us access to their Google Drive
   * @return Copied file's id
   */
  public Topic copyToGoogleDrive(String fileId, String accessToken) {
    var oauthClient = GoogleDriveClientImpl.getOauthClient(accessToken);

    var redesignFolderId =
        oauthClient
            .getFolder(REDESIGN_HEALTH_FOLDER_NAME)
            .orElseGet(() -> oauthClient.createFolder(REDESIGN_HEALTH_FOLDER_NAME));

    if (!googleDriveClient.canEdit(redesignFolderId)) {
      oauthClient.grantEditAccess(redesignFolderId, PersonRef.of(googleServiceEmail));
    }

    var copyId = googleDriveClient.copy(fileId, redesignFolderId);
    return Topic.builder().id(copyId).build();
  }

  public Page<Library> getAll(Pageable pageable) {
    return libraryRepository.findAll(pageable);
  }

  public Library getLibrary(LibraryRef libraryRef) {
    return libraryRepository.findByApiId(libraryRef).orElseThrow(LibraryNotFoundException::new);
  }

  @Transactional
  public Library create(LibraryCommand command) {
    LibraryRef newId = null;
    while (newId == null) {
      LibraryRef potential = LibraryRef.of(ApiIdGenerator.generate());
      if (!libraryRepository.existsByApiId(potential)) {
        newId = potential;
      } else {
        logger.warn("ID: \"{}\" collision detected when creating library", potential);
      }
    }
    var library = Library.from(newId);
    library.setDisplayName(command.getDisplayName());
    libraryRepository.save(library);
    return library;
  }
}
