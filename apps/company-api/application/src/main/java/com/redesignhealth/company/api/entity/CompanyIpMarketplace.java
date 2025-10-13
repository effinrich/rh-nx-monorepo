package com.redesignhealth.company.api.entity;

import static jakarta.persistence.EnumType.STRING;

import com.redesignhealth.company.api.dto.enums.CompanyIPMarketplaceOrganizationType;
import com.redesignhealth.company.api.dto.enums.CompanyIPMarketplaceRegion;
import com.redesignhealth.company.api.dto.enums.CompanyIPMarketplaceType;
import com.redesignhealth.company.api.entity.audit.Auditable;
import jakarta.persistence.Entity;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import java.util.HashSet;
import java.util.Set;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class CompanyIpMarketplace extends Auditable {
  @Id @GeneratedValue private Long id;

  @Enumerated(STRING)
  private CompanyIPMarketplaceType activityType;

  @Enumerated(STRING)
  private CompanyIPMarketplaceOrganizationType organizationType;

  @Enumerated(STRING)
  private CompanyIPMarketplaceRegion region;

  @OneToOne
  @JoinColumn(name = "company_id")
  private Company company;

  @OneToMany
  @JoinColumn(name = "id")
  private Set<IpMarketplaceTrack> ipMarketplaceTrack;

  @OneToMany
  @JoinColumn(name = "id")
  private Set<IpMarketplace> ipMarketplace;

  public CompanyIpMarketplace() {
    this.ipMarketplace = new HashSet<>();
    this.ipMarketplaceTrack = new HashSet<>();
  }
}
