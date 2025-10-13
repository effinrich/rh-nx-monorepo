package com.redesignhealth.company.api.assembler;

import com.redesignhealth.company.api.controller.PersonController;
import com.redesignhealth.company.api.controller.UserInfoController;
import com.redesignhealth.company.api.dto.UserInfoSummary;
import org.springframework.hateoas.Link;
import org.springframework.hateoas.server.mvc.RepresentationModelAssemblerSupport;
import org.springframework.hateoas.server.mvc.WebMvcLinkBuilder;

public class UserInfoAssembler
    extends RepresentationModelAssemblerSupport<UserInfoSummary, UserInfoSummary> {

  public UserInfoAssembler() {
    super(UserInfoController.class, UserInfoSummary.class);
  }

  @Override
  public UserInfoSummary toModel(UserInfoSummary user) {
    return (UserInfoSummary) user.add(createSelfRel(), createPersonRel(user.getEmail()));
  }

  private Link createSelfRel() {
    return WebMvcLinkBuilder.linkTo(getControllerClass()).withSelfRel();
  }

  private Link createPersonRel(String email) {
    return WebMvcLinkBuilder.linkTo(PersonController.class).slash(email).withRel("person");
  }
}
