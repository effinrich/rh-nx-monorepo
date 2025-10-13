package com.redesignhealth.company.api.dto.command;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.redesignhealth.company.api.client.search.entity.ResearchAuthor;
import com.redesignhealth.company.api.dto.LinkRef;
import com.redesignhealth.company.api.entity.ref.CompanyRef;
import com.redesignhealth.company.api.entity.ref.PersonRef;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import java.util.List;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ExpertNoteCommand {
  public static final String NOTE_TAKER_FIELD = "noteTaker";
  public static final String NOTE_HREF_FIELD = "noteHref";
  public static final String COMPANY_IDS_FIELD = "companyIds";

  @Schema(example = "Jane Doe", requiredMode = Schema.RequiredMode.REQUIRED)
  @NotBlank
  private String intervieweeName;

  @Schema(example = "Redesign Health")
  private String intervieweeCompany;

  @Schema(example = "Expert Call", requiredMode = Schema.RequiredMode.REQUIRED)
  @NotBlank
  private String type;

  @Schema(example = "Organically Sourced (Paid)", requiredMode = Schema.RequiredMode.REQUIRED)
  @NotBlank
  private String sourceOfInterview;

  @Schema(example = "jane.doe@example.com")
  private PersonRef intervieweeEmail;

  @JsonProperty(NOTE_TAKER_FIELD)
  @Schema(example = "terra.branford@example.com", requiredMode = Schema.RequiredMode.REQUIRED)
  private PersonRef noteTaker;

  @Schema(example = "https://example.com/profile/1")
  private String linkedInProfileHref;

  @Schema(example = "[\"Government\"]")
  private List<String> stakeholders;

  @JsonProperty(COMPANY_IDS_FIELD)
  @Schema(example = "[\"1jlaksd1\"]", requiredMode = Schema.RequiredMode.REQUIRED)
  @NotEmpty
  private List<CompanyRef> companyIds;

  @Schema(example = "[\"tag\"]")
  private List<String> additionalTags;

  @Schema(example = "[{\"name\" : \"authors\"}]")
  private List<ResearchAuthor> authors;

  @JsonProperty(NOTE_HREF_FIELD)
  @Schema(example = "https://example.com", requiredMode = Schema.RequiredMode.REQUIRED)
  @NotBlank
  private String noteHref;

  @Schema(example = "[{ \"href\": \"https://example.com\", \"name\": \"report\" }]")
  private List<LinkRef> attachments;

  @Schema(example = "false")
  private Boolean isAttachmentDisclaimerAccepted;
}
