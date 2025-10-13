package com.redesignhealth.company.api.entity;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "company_conflicts")
@Getter
@Setter
public class CompanyConflict {
  @Id @GeneratedValue private Long id;

  @OneToOne(cascade = CascadeType.MERGE)
  @JoinColumn(name = "member_of_id", referencedColumnName = "id")
  Company memberOfId;

  @OneToOne(cascade = CascadeType.MERGE)
  @JoinColumn(name = "company_conflicts_id", referencedColumnName = "id")
  Company companyConflictsId;
}
