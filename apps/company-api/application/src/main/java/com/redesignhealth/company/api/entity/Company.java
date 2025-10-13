package com.redesignhealth.company.api.entity;

import static jakarta.persistence.EnumType.STRING;

import com.redesignhealth.company.api.dto.enums.CompanyFundraiseStatus;
import com.redesignhealth.company.api.dto.enums.CompanyStage;
import com.redesignhealth.company.api.dto.enums.CompanyStatus;
import com.redesignhealth.company.api.entity.audit.Auditable;
import com.redesignhealth.company.api.entity.converter.CompanyRefConverter;
import com.redesignhealth.company.api.entity.converter.TaxonomyRefConverter;
import com.redesignhealth.company.api.entity.ref.CompanyRef;
import com.redesignhealth.company.api.entity.ref.TaxonomyRef;
import com.redesignhealth.company.api.taxonomy.TaxonomyTerm;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Transient;
import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import lombok.Getter;
import lombok.Setter;

/** A company started by Redesign Health */
@Entity
@Getter
@Setter
public class Company extends Auditable {
  @Id @GeneratedValue private Long id;

  /** User-friendly id to be used in API calls */
  @Column(unique = true)
  @Convert(converter = CompanyRefConverter.class)
  private CompanyRef apiId;

  /** ex. Pip */
  private String name;

  /** ex. Pip Care Inc. */
  private String legalName;

  /** ex. 31 */
  @Column(unique = true)
  private Long number;

  /** ex. Info about the company */
  private String description;

  @OneToMany(mappedBy = "company", cascade = CascadeType.ALL, orphanRemoval = true)
  private Set<CompanyMember> members;

  /** References a Cloud-hosted folder of documents */
  private String onboardDocsFolderId;

  @Enumerated(STRING)
  private CompanyStage stage;

  @Enumerated(STRING)
  private CompanyStatus status;

  @Convert(converter = CompanyRefConverter.class)
  private CompanyRef linkedApiId;

  @Convert(converter = TaxonomyRefConverter.class)
  private TaxonomyRef taxonomyId;

  @Transient private List<TaxonomyTerm> taxonomyTerms;

  @ManyToMany(mappedBy = "companies")
  private Set<ExpertNote> expertNotes;

  @Enumerated(STRING)
  private CompanyFundraiseStatus fundraiseStatus;

  @OneToOne(cascade = CascadeType.ALL, mappedBy = "company", orphanRemoval = true)
  @JoinColumn(name = "id", referencedColumnName = "company_id")
  private CompanyIpMarketplace companyIpMarketplace;

  private String href;

  private String dashboardHref;

  private Boolean hasPlatformAgreement;

  private Company() {
    this.members = new HashSet<>();
    this.stage = CompanyStage.OP_CO;
  }

  public static Company from(String apiId) {
    return Company.from(CompanyRef.of(apiId));
  }

  public static Company from(CompanyRef ref) {
    Company company = new Company();
    company.apiId = ref;
    return company;
  }

  @Override
  public boolean equals(Object o) {
    if (o == this) return true;
    if (!(o instanceof Company)) {
      return false;
    }
    Company company = (Company) o;
    return Objects.equals(apiId, company.getApiId());
  }

  @Override
  public int hashCode() {
    return Objects.hashCode(apiId.value());
  }
}
