package com.redesignhealth.company.api.entity;

import static jakarta.persistence.EnumType.STRING;

import com.redesignhealth.company.api.dto.enums.CompanyMemberAuditOperation;
import com.redesignhealth.company.api.dto.enums.CompanyMemberStatus;
import com.redesignhealth.company.api.entity.audit.Auditable;
import jakarta.persistence.Entity;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "company_members_audit")
public class CompanyMemberAudit extends Auditable {
  @Id @GeneratedValue private Long id;

  private String memberOfId;

  private String membersId;

  @Enumerated(STRING)
  private CompanyMemberStatus status;

  @Enumerated(STRING)
  private CompanyMemberAuditOperation operation;
}
