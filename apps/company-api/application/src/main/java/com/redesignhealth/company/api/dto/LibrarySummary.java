package com.redesignhealth.company.api.dto;

import com.redesignhealth.company.api.entity.library.Library;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import org.springframework.hateoas.RepresentationModel;

@Getter
public class LibrarySummary extends RepresentationModel<LibrarySummary> {

  @Schema(example = "zxY7ykku")
  public String id;

  @Schema(example = "Developer Documentation")
  public String displayName;

  public static LibrarySummary from(Library library) {
    var summary = new LibrarySummary();
    summary.id = library.getApiId().value();
    summary.displayName = library.getDisplayName();
    return summary;
  }
}
