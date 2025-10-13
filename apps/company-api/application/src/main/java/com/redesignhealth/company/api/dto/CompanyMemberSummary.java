package com.redesignhealth.company.api.dto;

import com.redesignhealth.company.api.dto.enums.CompanyMemberStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import java.time.Instant;
import java.util.List;
import lombok.Getter;
import org.springframework.hateoas.RepresentationModel;

@Getter
public class CompanyMemberSummary extends RepresentationModel<CompanyMemberSummary> {
  @Schema(example = "sazh.katzroy@redesignhealth.com", requiredMode = Schema.RequiredMode.REQUIRED)
  private final String email;

  @Schema(example = "Sazh")
  private final String givenName;

  @Schema(example = "Katzroy")
  private final String familyName;

  private List<RoleSummary> roles;

  private RoleSummary role;

  private final Instant created;

  private final Instant lastModified;

  protected CompanyMemberSummary(CompanyMemberDto companyMemberDto) {
    this.email = companyMemberDto.getPerson().getEmail().value();
    this.givenName = companyMemberDto.getPerson().getGivenName();
    this.familyName = companyMemberDto.getPerson().getFamilyName();
    if (companyMemberDto.getPerson().getRole() != null) {
      this.role = RoleSummary.from(companyMemberDto.getPerson().getRole());
    }
    this.roles = this.role != null ? List.of(this.role) : List.of();
    this.status = companyMemberDto.getCompanyMember().getStatus();
    this.created = companyMemberDto.getPerson().getCreated();
    this.lastModified = companyMemberDto.getPerson().getLastModified();
  }

  private CompanyMemberStatus status;

  public static CompanyMemberSummary from(CompanyMemberDto companyMemberDto) {
    return new CompanyMemberSummary(companyMemberDto);
  }
}
