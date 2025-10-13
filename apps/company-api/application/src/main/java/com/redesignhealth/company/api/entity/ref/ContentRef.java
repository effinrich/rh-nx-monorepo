package com.redesignhealth.company.api.entity.ref;

import com.redesignhealth.company.api.controller.util.Paths;
import com.redesignhealth.company.api.entity.library.LibraryContent;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.enums.ParameterIn;

/** Natural key for an {@link LibraryContent} */
public class ContentRef extends Ref {
  @Parameter(in = ParameterIn.PATH, name = Paths.CONTENT_ID_PATH_VARIABLE)
  private final String value;

  // parameter name must be the same as path parameter to hydrate properly
  private ContentRef(String id) {
    this.value = id;
  }

  public static ContentRef of(String apiId) {
    return new ContentRef(apiId);
  }

  @Override
  public String getColumnName() {
    return DEFAULT_REF_COLUMN_NAME;
  }

  @Override
  public String value() {
    return value;
  }

  // Needed to resolve property for OpenAPI Definition file
  public String getValue() {
    return value;
  }
}
