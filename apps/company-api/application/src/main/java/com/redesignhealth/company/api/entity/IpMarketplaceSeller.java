package com.redesignhealth.company.api.entity;

import com.redesignhealth.company.api.entity.audit.Auditable;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
public class IpMarketplaceSeller extends Auditable {
  @Id @GeneratedValue private Long id;

  @OneToOne
  @JoinColumn(name = "ip_marketplace_id")
  @Setter
  private IpMarketplace ipMarketplace;

  @ManyToOne
  @JoinColumn(name = "seller_id")
  @Setter
  private Person seller;
}
