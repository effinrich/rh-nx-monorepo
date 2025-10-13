package com.redesignhealth.company.api.entity;

import com.redesignhealth.company.api.entity.audit.Auditable;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import java.time.Instant;
import lombok.Getter;
import lombok.Setter;

@Getter
@Entity
public class RocketChatCheckMonitoring extends Auditable {
  @Id @GeneratedValue private Long id;

  @ManyToOne
  @JoinColumn(name = "user_id")
  @Setter
  private Person user;

  @Setter private String roomId;
  @Setter private Instant lastCheck;
}
