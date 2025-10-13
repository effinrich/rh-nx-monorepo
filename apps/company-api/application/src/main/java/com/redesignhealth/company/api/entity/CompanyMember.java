package com.redesignhealth.company.api.entity;

import static jakarta.persistence.EnumType.STRING;

import com.redesignhealth.company.api.dto.enums.CompanyMemberStatus;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Enumerated;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "company_members")
public class CompanyMember {
  @EmbeddedId private CompanyMemberId id = new CompanyMemberId();

  @ManyToOne
  @MapsId("memberOfId")
  @JoinColumn(name = "member_of_id")
  @Getter
  private Company company;

  @ManyToOne
  @MapsId("memberId")
  @JoinColumn(name = "members_id")
  @Getter
  private Person person;

  @Enumerated(STRING)
  @Getter
  @Setter
  private CompanyMemberStatus status;

  @Getter @Setter private boolean googleDriveFolderAccess;

  private CompanyMember() {}

  public CompanyMember(
      Company company, Person person, CompanyMemberStatus status, boolean googleDriveFolderAccess) {
    this.company = company;
    this.person = person;
    this.id = new CompanyMemberId(company.getId(), person.getId());
    this.status = status;
    this.googleDriveFolderAccess = googleDriveFolderAccess;
  }

  public CompanyMember(Company company, Person person, CompanyMemberStatus status) {
    this.company = company;
    this.person = person;
    this.id = new CompanyMemberId(company.getId(), person.getId());
    this.status = status;
    this.googleDriveFolderAccess = true;
  }
}
