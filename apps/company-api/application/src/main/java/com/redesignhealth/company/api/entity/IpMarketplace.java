package com.redesignhealth.company.api.entity;

import static jakarta.persistence.EnumType.STRING;

import com.redesignhealth.company.api.dto.LinkRef;
import com.redesignhealth.company.api.dto.enums.IpMarketplaceFreedomToOperateCertification;
import com.redesignhealth.company.api.dto.enums.IpMarketplaceOrganOfFocus;
import com.redesignhealth.company.api.dto.enums.IpMarketplacePatentGeographyValidity;
import com.redesignhealth.company.api.dto.enums.IpMarketplacePatentStatus;
import com.redesignhealth.company.api.dto.enums.IpMarketplacePreferredTerms;
import com.redesignhealth.company.api.dto.enums.IpMarketplaceSpeciality;
import com.redesignhealth.company.api.dto.enums.IpMarketplaceStatus;
import com.redesignhealth.company.api.dto.enums.IpMarketplaceTechnologyLevelOfMaturity;
import com.redesignhealth.company.api.dto.enums.IpMarketplaceTechnologyType;
import com.redesignhealth.company.api.entity.audit.Auditable;
import com.redesignhealth.company.api.entity.converter.IpMarketPlaceConverter;
import com.redesignhealth.company.api.entity.ref.IpMarketplaceRef;
import com.vladmihalcea.hibernate.type.json.JsonBinaryType;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import java.time.Instant;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.Type;

@Entity
@Getter
public class IpMarketplace extends Auditable {
  @Id @GeneratedValue private Long id;

  @OneToOne @Setter private CompanyIpMarketplace companyIpMarketplace;

  @Convert(converter = IpMarketPlaceConverter.class)
  @Setter
  private IpMarketplaceRef apiId;

  @Setter private String name;
  @Setter private String executiveSummary;
  @Setter private String therapeuticNeedOrTrendsBeingAddressed;
  @Setter private String technologyOverview;
  @Setter private Boolean licenseRestriction;
  @Setter private String aboutLicenseRestriction;

  @Enumerated(STRING)
  @Setter
  private List<IpMarketplacePreferredTerms> preferredTerms;

  @Setter private String preferredTermsOther;

  @Type(JsonBinaryType.class)
  @Column(columnDefinition = "jsonb", name = "files")
  @Setter
  private List<LinkRef> associatedFilesOrMedia;

  @Enumerated(STRING)
  @Setter
  private IpMarketplacePatentStatus patentStatus;

  @Setter private Instant patentIssueDate;

  @Enumerated(STRING)
  @Setter
  private List<IpMarketplacePatentGeographyValidity> patentGeographicValidity;

  @Setter private String patentGeographicValidityOther;
  @Setter private String patentStatusOtherInfo;
  @Setter private String disease;

  @Setter
  @Enumerated(STRING)
  private List<IpMarketplaceOrganOfFocus> organOfFocus;

  @Enumerated(STRING)
  @Setter
  private List<IpMarketplaceTechnologyType> technologyType;

  @Enumerated(STRING)
  @Setter
  private List<IpMarketplaceSpeciality> speciality;

  @Setter private String sellerSummaryTechTransferApproach;
  @Setter private String responsibleInventor;

  @Enumerated(STRING)
  @Setter
  private List<IpMarketplaceTechnologyLevelOfMaturity> technologyLevelOfMaturity;

  @Setter private String patentStatusHref;

  @Enumerated(STRING)
  @Setter
  private IpMarketplaceFreedomToOperateCertification freedomToOperateCertification;

  @Setter private boolean legalPatentabilityAssessmentAvailable;
  @Setter private boolean copyrighted;

  @Enumerated(STRING)
  @Setter
  private IpMarketplaceStatus status;

  @OneToOne(cascade = CascadeType.ALL, mappedBy = "ipMarketplace")
  @JoinColumn(name = "id", referencedColumnName = "ip_marketplace_id")
  @Setter
  private IpMarketplaceSeller ipMarketplaceSeller;

  @OneToMany(cascade = CascadeType.ALL, mappedBy = "ipMarketplace")
  @Setter
  private Set<IpMarketplaceTrack> ipMarketplaceTracks;

  public IpMarketplace() {
    this.ipMarketplaceTracks = new HashSet<>();
  }
}
