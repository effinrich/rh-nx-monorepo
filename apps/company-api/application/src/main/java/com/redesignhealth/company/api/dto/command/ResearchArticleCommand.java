package com.redesignhealth.company.api.dto.command;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.redesignhealth.company.api.dto.LinkRef;
import com.redesignhealth.company.api.entity.ref.CompanyRef;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import java.util.List;
import lombok.Getter;

@Getter
public class ResearchArticleCommand {
  public static final String COMPANY_IDS_FIELD = "companyIds";

  @Schema(example = "Shinra Research")
  @NotBlank
  private String title;

  @Schema(example = "Article/Publication")
  @NotBlank
  private String type;

  @Schema(example = "https://example.com")
  @NotBlank
  private String articleHref;

  @Schema(example = "[\"Patient\"]")
  private List<String> stakeholders;

  @JsonProperty(COMPANY_IDS_FIELD)
  @Schema(example = "[\"1jlaksd1\"]")
  @NotEmpty
  private List<CompanyRef> companyIds;

  @Schema(example = "[\"New\"]")
  private List<String> additionalTags;

  @Schema(
      example =
          """
    [{
      "name": "article.pdf",
      "href": "https://example.com"
    }]
    """)
  private List<LinkRef> attachments;

  @Schema(example = "true")
  private Boolean isAttachmentDisclaimerAccepted;
}
