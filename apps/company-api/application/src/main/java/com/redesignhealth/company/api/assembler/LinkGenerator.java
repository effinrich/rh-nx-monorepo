package com.redesignhealth.company.api.assembler;

import org.springframework.hateoas.Link;

/** Utility to generate a HAL link */
public interface LinkGenerator {
  Link generate(String id);
}
