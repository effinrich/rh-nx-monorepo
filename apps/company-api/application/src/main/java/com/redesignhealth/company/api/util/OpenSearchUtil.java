package com.redesignhealth.company.api.util;

import java.util.List;
import java.util.Map;
import org.opensearch.client.opensearch._types.mapping.Property;
import org.opensearch.client.opensearch._types.mapping.TextProperty;

public class OpenSearchUtil {

  /**
   * Represents the [KEY] in $.properties.[FIELD].fields.[KEY] for an index mapping
   *
   * <pre>
   * Example:
   * {
   *   "properties": {
   *     "[FIELD]" {
   *       "type": "text",
   *       "fields": {
   *         "[KEY]": {"type": "keyword"}
   *       }
   *     }
   *   }
   * }
   * </pre>
   *
   * This is useful for "text" fields which have higher performance requirements vs. "keywords."
   *
   * <p>We could have called this something like "raw" which would have helped differentiate from
   * the "type:keyword" but "keyword" felt more descriptive and is the default name dynamic mappings
   * give to "text/keyword" fields.
   *
   * <p>More info: <a
   * href="https://opensearch.org/docs/2.1/opensearch/supported-field-types/index/#multifields">multifields</a>
   */
  private static final String KEYWORD_FIELD_NAME = "keyword";

  private static final String DEPTH_SEPARATOR = "\\.";

  /**
   * Extract property's internal OpenSearch name
   *
   * <p>Helpful when a "text" field has an underlying "keyword" representation.
   *
   * <p>We'd like to use "keyword" values when possible to filter, sort, and aggregate. OpenSearch
   * does not return results when using the "text" version of these fields.
   *
   * @param requestedField property requested (allows for dot-notation)
   * @param searchIndexProperties list of properties that exist in the search index
   * @return requestedField or requestedField.keyword
   */
  public static String getProperty(
      String requestedField, Map<String, Property> searchIndexProperties) {
    var hierarchy = List.of(requestedField.split(DEPTH_SEPARATOR));
    var currProp = searchIndexProperties.get(hierarchy.get(0));
    // find lowest level property
    for (int i = 1; i < hierarchy.size() && currProp != null; i++) {
      if (currProp.isObject()) {
        currProp = currProp.object().properties().get(hierarchy.get(i));
      }
    }
    if (hasKeyword(currProp)) {
      return requestedField + "." + KEYWORD_FIELD_NAME;
    }
    return requestedField;
  }

  // Text fields are expensive to sort by and lead to errors
  // Get the keyword version of that field instead
  private static boolean hasKeyword(Property indexProperty) {
    return indexProperty != null
        && indexProperty.isText()
        && hasKeywordVersionOfTextField(indexProperty.text());
  }

  private static boolean hasKeywordVersionOfTextField(TextProperty textProperty) {
    return textProperty.fields().containsKey(KEYWORD_FIELD_NAME);
  }
}
