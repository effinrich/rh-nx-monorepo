package com.redesignhealth.company.api.dto.command;

import com.redesignhealth.company.api.dto.enums.LibraryContentType;
import com.redesignhealth.company.api.dto.enums.RemoteContentSource;
import com.redesignhealth.company.api.entity.ref.ContentRef;
import com.redesignhealth.company.api.entity.ref.LibraryRef;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;

@Getter
public class ContentCommand {
  @NotBlank private String title;
  private String description;
  @NotNull private LibraryContentType type;

  @Schema(type = "string")
  private ContentRef parentId;

  private RemoteContentSource remoteContentSource;
  private String remoteContentId;

  @Schema(type = "string")
  private LibraryRef libraryId;

  private Integer orderId;
}
