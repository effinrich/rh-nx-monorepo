package com.redesignhealth.company.api.util;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;

class GoogleDriveUtilTest {

  @ParameterizedTest
  @ValueSource(
      strings = {
        "https://docs.google.com/presentation/d/%s",
        "https://docs.google.com/document/d/%s",
        "[https://docs.google.com/presentation/d/%s/edit?usp=sharing](https://docs.google.com/presentation/d/123/edit?usp=sharing)"
      })
  public void testGetDocumentIdFromLink_validReturnsId(String linkFormat) {
    var id = "123";
    var link = String.format(linkFormat, id);
    var result = GoogleDriveUtil.getDocumentIdFromLink(link);
    assertThat(result.get()).isEqualTo(id);
  }

  @Test
  public void testGetDocumentIdFromLink_invalidReturnsEmpty() {
    var id = 123;
    var link = "https://example.com/" + id;
    var result = GoogleDriveUtil.getDocumentIdFromLink(link);
    assertThat(result.isEmpty()).isTrue();
  }
}
