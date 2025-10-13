package com.redesignhealth.company.api.controller;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.*;

import java.util.HashMap;
import java.util.Map;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.hateoas.EntityModel;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

@RestController
public class RootController {

  private final String version;

  public RootController(@Value("${build.version}") String version) {
    this.version = version;
  }

  @GetMapping("/")
  public EntityModel<Map<String, Object>> root() {
    Map<String, Object> content = new HashMap<>();
    Map<String, String> values = new HashMap<>();
    content.put("version", version);
    content.put("Redesign Health", values);
    values.put("Redesign Healthcare", "We bring positive change to patients' lives");
    values.put("Own the outcome", "We do the work to get the job done");
    values.put("Champion diverse perspectives", "We work to unlock our joint potential");
    values.put("Be trusted partners", "We strive to be the teammates and co-founders of choice");
    values.put("Practice kindness", "We aim to build bridges, not walls");
    values.put("Learn continuously", "We focus on constantly growing as individuals and as a team");
    return EntityModel.of(content)
        .add(linkTo(RootController.class).slash("/public/docs").withRel("documentation"))
        .add(linkTo(RootController.class).slash("/public/swagger").withRel("swagger"))
        .add(linkTo(RootController.class).slash("/public/open-api").withRel("openApi"));
  }

  /**
   * Redirect to static documentation
   *
   * <p>This is just a helper function to remove the need to append .html to the end of the
   * documentation URL.
   *
   * <p>Spring Boot automatically serves static files from various locations. On build, we
   * compile/copy our documentation into /static/public/docs/index.html. /static gets automatically
   * removed from the generated URL.
   *
   * <p>Before: https://localhost:8080/public/docs/index.html
   *
   * <p>After: https://localhost:8080/public/docs -> redirects to html file
   */
  @GetMapping("/public/docs")
  public ModelAndView documentation() {
    return new ModelAndView("redirect:/public/docs/index.html");
  }
}
