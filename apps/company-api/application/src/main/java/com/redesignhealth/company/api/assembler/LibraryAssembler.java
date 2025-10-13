package com.redesignhealth.company.api.assembler;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;

import com.redesignhealth.company.api.controller.LibraryController;
import com.redesignhealth.company.api.dto.LibrarySummary;
import com.redesignhealth.company.api.entity.library.Library;
import org.springframework.hateoas.Link;
import org.springframework.hateoas.server.mvc.RepresentationModelAssemblerSupport;

public class LibraryAssembler extends RepresentationModelAssemblerSupport<Library, LibrarySummary> {

  public LibraryAssembler() {
    super(LibraryController.class, LibrarySummary.class);
  }

  @Override
  public LibrarySummary toModel(Library library) {
    return LibrarySummary.from(library).add(createSelfRel(library));
  }

  private Link createSelfRel(Library library) {
    return linkTo(this.getControllerClass()).slash(library.getApiId()).withSelfRel();
  }
}
