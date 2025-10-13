package com.redesignhealth.company.api.util;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.Map;
import org.junit.jupiter.api.Test;
import org.opensearch.client.opensearch._types.mapping.Property;

public class OpenSearchUtilTests {

  @Test
  public void testGetProperty_handleSimpleField() {
    Map<String, Property> properties = Map.of("field", generateKeyword());
    assertThat(OpenSearchUtil.getProperty("field", properties)).isEqualTo("field");
  }

  @Test
  public void testGetProperty_handleTextFieldWithKeyword() {
    Map<String, Property> properties = Map.of("field", generateTextWithKeyword());
    assertThat(OpenSearchUtil.getProperty("field", properties)).isEqualTo("field.keyword");
  }

  @Test
  public void testGetProperty_handleObjectWithTextKeyword() {
    Map<String, Property> properties = Map.of("parent", generateObjectWIthTextWithKeyword());
    assertThat(OpenSearchUtil.getProperty("parent.child", properties))
        .isEqualTo("parent.child.keyword");
  }

  @Test
  public void testGetProperty_handleUnknownProperty() {
    Map<String, Property> properties = Map.of();
    assertThat(OpenSearchUtil.getProperty("unknownProperty", properties))
        .isEqualTo("unknownProperty");
  }

  /** { "field": { "type": "keyword" } } */
  private static Property generateKeyword() {
    return Property.of(p -> p.keyword(k -> k.name("value")));
  }

  /** { "field": { "type": "text", "fields: { "keyword: { "type": "keyword" } } } } */
  private static Property generateTextWithKeyword() {
    return Property.of(p -> p.text(t -> t.name("value").fields("keyword", generateKeyword())));
  }

  /**
   * { "parent": { "type": "object", "properties": { "child": { "type": "text", "fields: { "keyword:
   * { "type": "keyword" } } } } }
   */
  private static Property generateObjectWIthTextWithKeyword() {
    return Property.of(p -> p.object(o -> o.properties("child", generateTextWithKeyword())));
  }
}
