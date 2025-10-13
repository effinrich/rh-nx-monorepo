package com.redesignhealth.company.api.expansion;

import com.fasterxml.jackson.annotation.JsonValue;

/**
 * Framework for hydrating lazy-loaded child-entities
 *
 * <pre>
 *   // include OpCo members
 *   opCoRepository.findByApiId(apiId, Expansion.MEMBERS)
 * </pre>
 *
 * <p>By default, lazy-loaded child-entities can only be initialized within a session by accessing a
 * lazy-loaded field.
 *
 * <pre>
 *   &#064;Transactional
 *   public void method() {
 *     var opCo = opCoRepo.findByApiId(apiId);
 *     opCo.getMembers();
 *   }
 * </pre>
 *
 * <p>Repositories that extend {@link
 * com.redesignhealth.company.api.repository.BaseCustomRepository} have access to pass {@link
 * Expansion} to hydrate desired fields.
 */
public enum Expansion {
  ANCESTORS("ancestors"),
  CHILDREN("children"),
  CONTACTS("contacts"),
  DESCENDANTS("descendants"),
  FORMS("forms"),
  MEMBERS("members"),
  MEMBER_OF("memberOf"),
  HIGHLIGHTED_TEXT("highlightedText"),
  SUBCATEGORIES("subcategories"),
  METRICS("metrics"),
  REQUESTS("requests");

  private final String fieldName;

  Expansion(String fieldName) {
    this.fieldName = fieldName;
  }

  @JsonValue
  public String getFieldName() {
    return fieldName;
  }
}
