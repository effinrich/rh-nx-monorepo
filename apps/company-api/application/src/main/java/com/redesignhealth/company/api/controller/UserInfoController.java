package com.redesignhealth.company.api.controller;

import com.redesignhealth.company.api.assembler.UserInfoAssembler;
import com.redesignhealth.company.api.dto.UserInfoSummary;
import com.redesignhealth.company.api.entity.Person;
import com.redesignhealth.company.api.entity.ref.PersonRef;
import com.redesignhealth.company.api.exception.PersonNotFoundException;
import com.redesignhealth.company.api.openapi.IncludeSecurityHeaders;
import com.redesignhealth.company.api.repository.PersonRepository;
import com.redesignhealth.company.api.security.RedesignUserDetails;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** Get information about a requester */
@RestController
@IncludeSecurityHeaders
@RequestMapping("/userinfo")
@Tag(name = "User Info", description = "Get info based on bearer token")
public class UserInfoController {

  private final PersonRepository personRepository;
  private final UserInfoAssembler userInfoAssembler;

  public UserInfoController(PersonRepository personRepository) {
    this.personRepository = personRepository;
    this.userInfoAssembler = new UserInfoAssembler();
  }

  @GetMapping
  public UserInfoSummary getUserInfo(Authentication auth) {
    var userDetails = (RedesignUserDetails) auth.getPrincipal();
    Person p =
        personRepository
            .findByEmail(PersonRef.of(userDetails.getUsername()))
            .orElseThrow(PersonNotFoundException::new);

    return userInfoAssembler.toModel(UserInfoSummary.from(p, userDetails));
  }
}
