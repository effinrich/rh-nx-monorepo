package com.redesignhealth.company.api.entity.ref;

import com.redesignhealth.company.api.controller.util.Paths;
import com.redesignhealth.company.api.entity.library.Library;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.enums.ParameterIn;

/** Natural key for an {@link Library} */
public class LibraryRef extends Ref {
  @Parameter(in = ParameterIn.PATH, name = Paths.LIBRARY_ID_PATH_VARIABLE)
  private final String apiId;

  // parameter name must be the same as path parameter to hydrate properly
  private LibraryRef(String libraryId) {
    this.apiId = libraryId;
  }

  public static LibraryRef of(String apiId) {
    return new LibraryRef(apiId);
  }

  @Override
  public String getColumnName() {
    return DEFAULT_REF_COLUMN_NAME;
  }

  public String value() {
    return apiId;
  }

  // Needed to resolve property for OpenAPI Definition file
  public String getApiId() {
    return apiId;
  }
}
