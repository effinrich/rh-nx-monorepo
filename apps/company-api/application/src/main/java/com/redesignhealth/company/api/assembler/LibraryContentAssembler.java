package com.redesignhealth.company.api.assembler;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;

import com.redesignhealth.company.api.assembler.google.GoogleDocsLinkGenerator;
import com.redesignhealth.company.api.controller.LibraryContentController;
import com.redesignhealth.company.api.dto.LibraryContentSummary;
import com.redesignhealth.company.api.dto.enums.RemoteContentSource;
import com.redesignhealth.company.api.entity.library.LibraryContent;
import org.springframework.hateoas.Link;
import org.springframework.hateoas.server.mvc.RepresentationModelAssemblerSupport;
import org.springframework.stereotype.Component;

@Component
public class LibraryContentAssembler
    extends RepresentationModelAssemblerSupport<LibraryContent, LibraryContentSummary> {

  private final LinkGenerator googleDocsLinkGenerator;

  public LibraryContentAssembler(GoogleDocsLinkGenerator googleDocsLinkGenerator) {
    super(LibraryContentController.class, LibraryContentSummary.class);
    this.googleDocsLinkGenerator = googleDocsLinkGenerator;
  }

  @Override
  public LibraryContentSummary toModel(LibraryContent entity) {
    var summary = LibraryContentSummary.from(entity).add(createSelfRel(entity));
    if (entity.getRemoteContentSource() == RemoteContentSource.GOOGLE_DRIVE
        && entity.getRemoteContentId() != null) {
      summary.add(googleDocsLinkGenerator.generate(entity.getRemoteContentId()));
    }
    return summary;
  }

  private Link createSelfRel(LibraryContent content) {
    return linkTo(this.getControllerClass()).slash(content.getApiId()).withSelfRel();
  }
}
