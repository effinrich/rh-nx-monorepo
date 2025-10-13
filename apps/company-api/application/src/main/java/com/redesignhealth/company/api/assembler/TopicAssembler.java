package com.redesignhealth.company.api.assembler;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;

import com.redesignhealth.company.api.assembler.google.GoogleDocsLinkGenerator;
import com.redesignhealth.company.api.controller.LibraryController;
import com.redesignhealth.company.api.document.Topic;
import com.redesignhealth.company.api.dto.TopicSummary;
import org.springframework.hateoas.Link;
import org.springframework.hateoas.server.mvc.RepresentationModelAssemblerSupport;
import org.springframework.stereotype.Component;

@Component
public class TopicAssembler extends RepresentationModelAssemblerSupport<Topic, TopicSummary> {
  private final GoogleDocsLinkGenerator linkGenerator;

  public TopicAssembler(GoogleDocsLinkGenerator linkGenerator) {
    super(LibraryController.class, TopicSummary.class);
    this.linkGenerator = linkGenerator;
  }

  @Override
  public TopicSummary toModel(Topic entity) {
    return TopicSummary.from(entity)
        .add(createSelfRel(entity))
        .add(linkGenerator.generate(entity.getId()));
  }

  private Link createSelfRel(Topic document) {
    return linkTo(this.getControllerClass()).slash(document.getId()).withSelfRel();
  }
}
