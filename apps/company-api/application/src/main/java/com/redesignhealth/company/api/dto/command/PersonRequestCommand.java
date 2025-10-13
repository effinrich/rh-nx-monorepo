package com.redesignhealth.company.api.dto.command;

import com.redesignhealth.company.api.entity.request.RoleAuthority;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;

public class PersonRequestCommand {

  @Schema(example = "sazh.katzroy@redesignhealth.com")
  private String email;

  @Schema(example = "Katzroy")
  private String familyName;

  @Schema(example = "Sazh")
  private String givenName;

  @ArraySchema(schema = @Schema(example = "ever-body"))
  private List<String> companies = List.of();

  @ArraySchema(schema = @Schema(example = "ROLE_RH_ADMIN"))
  private List<RoleAuthority> roles = List.of();

  public String getEmail() {
    return email;
  }

  public List<RoleAuthority> getRoles() {
    return roles;
  }

  public String getGivenName() {
    return givenName;
  }

  public String getFamilyName() {
    return familyName;
  }

  public List<String> getCompanies() {
    return companies;
  }

  public static Builder builder(String email) {
    return new Builder(email);
  }

  public static class Builder {
    private final String email;
    private List<String> companies;
    private List<RoleAuthority> roles;

    public Builder(String email) {
      this.email = email;
    }

    public PersonRequestCommand build() {
      var command = new PersonRequestCommand();
      command.email = email;
      command.companies = companies;
      command.roles = roles;
      return command;
    }

    public Builder companies(List<String> companies) {
      this.companies = companies;
      return this;
    }

    public Builder roles(List<RoleAuthority> roles) {
      this.roles = roles;
      return this;
    }
  }
}
