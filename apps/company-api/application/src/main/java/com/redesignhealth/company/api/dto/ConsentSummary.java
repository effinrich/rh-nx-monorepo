package com.redesignhealth.company.api.dto;

import com.redesignhealth.company.api.entity.Consent;
import java.time.Instant;
import org.springframework.hateoas.RepresentationModel;

public class ConsentSummary extends RepresentationModel<ConsentSummary> {
  private SerializableEnum type;
  private String version;
  private Instant accepted;

  public static ConsentSummary from(Consent consent) {
    var summary = new ConsentSummary();
    summary.type = consent.getType();
    summary.accepted = consent.getAccepted();
    summary.version = consent.getVersion();
    return summary;
  }

  public SerializableEnum getType() {
    return type;
  }

  public String getVersion() {
    return version;
  }

  public Instant getAccepted() {
    return accepted;
  }
}
