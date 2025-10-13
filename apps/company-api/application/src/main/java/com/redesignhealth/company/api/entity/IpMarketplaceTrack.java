package com.redesignhealth.company.api.entity;

import static jakarta.persistence.EnumType.STRING;

import com.redesignhealth.company.api.dto.enums.IpMarketplaceTrackContactInfo;
import com.redesignhealth.company.api.entity.audit.Auditable;
import com.redesignhealth.company.api.entity.converter.IpMarketplaceTrackConverter;
import com.redesignhealth.company.api.entity.ref.IpMarketplaceTrackRef;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import java.time.Instant;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
public class IpMarketplaceTrack extends Auditable {
  @Id @GeneratedValue private Long id;

  @Convert(converter = IpMarketplaceTrackConverter.class)
  @Setter
  private IpMarketplaceTrackRef apiId;

  @ManyToOne
  @JoinColumn(name = "ip_marketplace_id")
  @Setter
  private IpMarketplace ipMarketplace;

  @ManyToOne(cascade = CascadeType.MERGE)
  @JoinColumn(name = "buyer_company_ip_marketplace_id")
  @Setter
  private CompanyIpMarketplace buyerCompanyIpMarketplace;

  @ManyToOne
  @JoinColumn(name = "buyer_id")
  @Setter
  private Person buyer;

  @Enumerated(STRING)
  @Setter
  private IpMarketplaceTrackContactInfo status;

  @Setter private Instant dateRequested;
  @Setter private Instant dateReleasedSellerContactInfo;
  @Setter private String roomId;
}
