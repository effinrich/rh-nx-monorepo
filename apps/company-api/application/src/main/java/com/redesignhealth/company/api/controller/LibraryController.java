package com.redesignhealth.company.api.controller;

import static com.redesignhealth.company.api.security.RedesignAuthenticationFilter.GOOGLE_ACCESS_TOKEN_HEADER;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;

import com.redesignhealth.company.api.assembler.LibraryAssembler;
import com.redesignhealth.company.api.assembler.LibraryContentAssembler;
import com.redesignhealth.company.api.assembler.TopicAssembler;
import com.redesignhealth.company.api.controller.util.Paths;
import com.redesignhealth.company.api.document.Topic;
import com.redesignhealth.company.api.dto.LibraryCommand;
import com.redesignhealth.company.api.dto.LibraryContentSummary;
import com.redesignhealth.company.api.dto.LibrarySummary;
import com.redesignhealth.company.api.dto.TermSummary;
import com.redesignhealth.company.api.dto.TopicSummary;
import com.redesignhealth.company.api.dto.command.TopicCommand;
import com.redesignhealth.company.api.entity.library.Library;
import com.redesignhealth.company.api.entity.library.LibraryContent;
import com.redesignhealth.company.api.entity.ref.LibraryRef;
import com.redesignhealth.company.api.expansion.Expansion;
import com.redesignhealth.company.api.openapi.IncludeSecurityHeaders;
import com.redesignhealth.company.api.service.LibraryContentService;
import com.redesignhealth.company.api.service.LibraryService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.PagedModel;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/library")
@IncludeSecurityHeaders
@Tag(name = "Knowledge Library")
public class LibraryController {

  private final LibraryService libraryService;
  private final LibraryContentService libraryContentService;
  private final TopicAssembler topicAssembler;
  private final PagedResourcesAssembler<Topic> pageAssembler;
  private final LibraryAssembler libraryAssembler;
  private final LibraryContentAssembler libraryContentAssembler;
  private final PagedResourcesAssembler<Library> libraryPagedResourcesAssembler;
  private final PagedResourcesAssembler<LibraryContent> libraryContentPagedResourcesAssembler;

  public LibraryController(
      LibraryService libraryService,
      TopicAssembler topicAssembler,
      PagedResourcesAssembler<Topic> pageAssembler,
      PagedResourcesAssembler<Library> libraryPagedResourcesAssembler,
      LibraryContentService libraryContentService,
      PagedResourcesAssembler<LibraryContent> libraryContentPagedResourcesAssembler,
      LibraryContentAssembler libraryContentAssembler) {
    this.libraryService = libraryService;
    this.topicAssembler = topicAssembler;
    this.libraryAssembler = new LibraryAssembler();
    this.pageAssembler = pageAssembler;
    this.libraryPagedResourcesAssembler = libraryPagedResourcesAssembler;
    this.libraryContentService = libraryContentService;
    this.libraryContentPagedResourcesAssembler = libraryContentPagedResourcesAssembler;
    this.libraryContentAssembler = libraryContentAssembler;
  }

  @GetMapping("/topic/search")
  @PreAuthorize("@authChecks.hasRoleOrHigher(authentication, 'ROLE_OP_CO_USER')")
  public PagedModel<TopicSummary> searchTopics(
      @RequestParam Optional<String> q,
      @RequestParam Optional<List<String>> filter,
      @ParameterObject Pageable pageable) {
    return pageAssembler.toModel(
        libraryService.search(q.orElse(null), filter.orElse(List.of()), pageable), topicAssembler);
  }

  @GetMapping("/category")
  @PreAuthorize("@authChecks.hasRoleOrHigher(authentication, 'ROLE_OP_CO_USER')")
  public CollectionModel<TermSummary> getCategories() {
    return CollectionModel.of(
            libraryService.getCategories().stream().map(TermSummary::from).toList())
        .add(linkTo(CompanyController.class).slash("library/topic/search").withRel("search"));
  }

  @GetMapping("/topic/{id}")
  @PreAuthorize("@authChecks.hasRoleOrHigher(authentication, 'ROLE_OP_CO_USER')")
  public TopicSummary get(@PathVariable String id) {
    return topicAssembler.toModel(libraryService.get(id));
  }

  @PutMapping("/topic/{id}")
  @PreAuthorize("@authChecks.isAdmin(authentication)")
  public TopicSummary upsert(@PathVariable String id, @Valid @RequestBody TopicCommand command) {
    return topicAssembler.toModel(libraryService.index(id, command));
  }

  @PostMapping("/topic/{id}/copy")
  @PreAuthorize("@authChecks.hasRoleOrHigher(authentication, 'ROLE_OP_CO_USER')")
  public TopicSummary copy(
      @PathVariable String id, @RequestHeader(GOOGLE_ACCESS_TOKEN_HEADER) String accessToken) {
    return topicAssembler.toModel(libraryService.copyToGoogleDrive(id, accessToken));
  }

  @GetMapping
  @PreAuthorize("@authChecks.hasRoleOrHigher(authentication, 'ROLE_OP_CO_USER')")
  public PagedModel<LibrarySummary> getAll(@ParameterObject Pageable pageable) {
    return libraryPagedResourcesAssembler.toModel(
        libraryService.getAll(pageable), libraryAssembler);
  }

  @GetMapping(Paths.LIBRARY_ID)
  @PreAuthorize("@authChecks.hasRoleOrHigher(authentication, 'ROLE_OP_CO_USER')")
  public LibrarySummary getAll(@ParameterObject LibraryRef libraryId) {
    Library library = libraryService.getLibrary(libraryId);
    return libraryAssembler.toModel(library);
  }

  @GetMapping(Paths.LIBRARY_ID + "/content")
  @PreAuthorize("@authChecks.hasRoleOrHigher(authentication, 'ROLE_OP_CO_USER')")
  public PagedModel<LibraryContentSummary> getContentsByLibrary(
      @ParameterObject LibraryRef libraryId,
      @ParameterObject Pageable pageable,
      @RequestParam Optional<String> q,
      @RequestParam Optional<List<String>> filter,
      @RequestParam Optional<List<Expansion>> expand) {
    return libraryContentPagedResourcesAssembler.toModel(
        libraryContentService.search(
            q.orElse(null),
            filter.orElse(new ArrayList<>()),
            pageable,
            expand.orElse(Collections.emptyList()),
            libraryId),
        libraryContentAssembler);
  }

  @PostMapping
  @PreAuthorize("@authChecks.isAdmin(authentication)")
  public ResponseEntity<LibrarySummary> create(@RequestBody @Valid LibraryCommand command) {
    return new ResponseEntity<>(
        libraryAssembler.toModel(libraryService.create(command)), HttpStatus.CREATED);
  }
}
