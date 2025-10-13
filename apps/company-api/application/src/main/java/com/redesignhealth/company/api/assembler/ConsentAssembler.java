package com.redesignhealth.company.api.assembler;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;

import com.redesignhealth.company.api.controller.ConsentController;
import com.redesignhealth.company.api.controller.PersonController;
import com.redesignhealth.company.api.dto.ConsentSummary;
import com.redesignhealth.company.api.entity.Consent;
import com.redesignhealth.company.api.entity.Person;
import org.springframework.hateoas.Link;
import org.springframework.hateoas.server.mvc.RepresentationModelAssemblerSupport;

public class ConsentAssembler extends RepresentationModelAssemblerSupport<Consent, ConsentSummary> {
  public ConsentAssembler() {
    super(ConsentController.class, ConsentSummary.class);
  }

  @Override
  public ConsentSummary toModel(Consent entity) {
    return ConsentSummary.from(entity).add(getMeLink(entity.getPerson()));
  }

  private static Link getMeLink(Person person) {
    return linkTo(PersonController.class).slash(person.getEmail()).withRel("me");
  }
}
