package com.redesignhealth.company.api.controller;

import static org.springframework.http.HttpStatus.CREATED;
import static org.springframework.http.HttpStatus.NO_CONTENT;

import com.redesignhealth.company.api.assembler.LibraryContentAssembler;
import com.redesignhealth.company.api.controller.util.Paths;
import com.redesignhealth.company.api.dto.LibraryContentSummary;
import com.redesignhealth.company.api.dto.command.ContentCommand;
import com.redesignhealth.company.api.dto.command.LibraryFeedbackCommand;
import com.redesignhealth.company.api.entity.library.LibraryContent;
import com.redesignhealth.company.api.entity.ref.ContentRef;
import com.redesignhealth.company.api.expansion.Expansion;
import com.redesignhealth.company.api.openapi.IncludeSecurityHeaders;
import com.redesignhealth.company.api.service.LibraryContentService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import java.util.Optional;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.PagedModel;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/library-content")
@IncludeSecurityHeaders
@Tag(name = "Library Content")
public class LibraryContentController {

  private final LibraryContentAssembler libraryContentAssembler;
  private final LibraryContentService libraryContentService;
  private final PagedResourcesAssembler<LibraryContent> pageAssembler;

  public LibraryContentController(
      LibraryContentService libraryContentService,
      LibraryContentAssembler libraryContentAssembler,
      PagedResourcesAssembler<LibraryContent> pagedResourcesAssembler) {
    this.libraryContentService = libraryContentService;
    this.libraryContentAssembler = libraryContentAssembler;
    this.pageAssembler = pagedResourcesAssembler;
  }

  @PostMapping
  @PreAuthorize("@authChecks.isAdmin(authentication)")
  public ResponseEntity<LibraryContentSummary> createContent(
      @RequestBody @Valid ContentCommand command) {
    return new ResponseEntity<>(
        libraryContentAssembler.toModel(libraryContentService.create(command)), CREATED);
  }

  @PutMapping(Paths.CONTENT_ID)
  @PreAuthorize("@authChecks.isAdmin(authentication)")
  public LibraryContentSummary updateContent(
      @ParameterObject ContentRef id, @RequestBody @Valid ContentCommand command) {
    return libraryContentAssembler.toModel(libraryContentService.update(id, command));
  }

  @GetMapping(Paths.CONTENT_ID)
  @PreAuthorize("@authChecks.hasRoleOrHigher(authentication, 'ROLE_OP_CO_USER')")
  public LibraryContentSummary getContent(
      @ParameterObject ContentRef id, @RequestParam Optional<List<Expansion>> expand) {
    return libraryContentAssembler.toModel(libraryContentService.get(id, expand.orElse(List.of())));
  }

  @GetMapping
  @PreAuthorize("@authChecks.hasRoleOrHigher(authentication, 'ROLE_OP_CO_USER')")
  public PagedModel<LibraryContentSummary> queryContent(
      @ParameterObject Pageable pageable,
      @RequestParam Optional<String> q,
      @RequestParam Optional<List<String>> filter,
      @RequestParam Optional<List<Expansion>> expand) {
    return pageAssembler.toModel(
        libraryContentService.search(
            q.orElse(null), filter.orElse(List.of()), pageable, expand.orElse(List.of())),
        libraryContentAssembler);
  }

  @PutMapping(Paths.CONTENT_ID + "/child/{childId}")
  @PreAuthorize("@authChecks.isAdmin(authentication)")
  public ResponseEntity<Void> appendChild(
      @ParameterObject ContentRef id, @PathVariable String childId) {
    libraryContentService.move(ContentRef.of(childId), id);
    return new ResponseEntity<>(NO_CONTENT);
  }

  @DeleteMapping(Paths.CONTENT_ID)
  @PreAuthorize("@authChecks.isAdmin(authentication)")
  public ResponseEntity<Void> deleteContent(@ParameterObject ContentRef id) {
    libraryContentService.delete(id);
    return new ResponseEntity<>(NO_CONTENT);
  }

  @PutMapping(Paths.CONTENT_ID + "/feedback")
  @PreAuthorize("@authChecks.hasRoleOrHigher(authentication, 'ROLE_OP_CO_USER')")
  public ResponseEntity<Void> sendFeedback(
      @ParameterObject ContentRef id, @RequestBody LibraryFeedbackCommand command) {
    libraryContentService.parseLibraryFeedback(id, command);
    return new ResponseEntity<>(NO_CONTENT);
  }
}
