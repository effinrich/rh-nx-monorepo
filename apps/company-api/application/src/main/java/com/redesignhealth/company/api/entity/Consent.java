package com.redesignhealth.company.api.entity;

import com.redesignhealth.company.api.dto.SerializableEnum;
import com.redesignhealth.company.api.entity.audit.Auditable;
import jakarta.persistence.*;
import java.time.Instant;

@Entity
public class Consent extends Auditable {
  @Id @GeneratedValue private Long id;

  @ManyToOne private Person person;

  private String version;

  @Column(unique = true)
  @Enumerated(EnumType.STRING)
  private Type type;

  private Instant accepted;

  public static Consent of(Type type) {
    var consent = new Consent();
    consent.type = type;
    return consent;
  }

  public String getVersion() {
    return version;
  }

  public Type getType() {
    return type;
  }

  public Instant getAccepted() {
    return accepted;
  }

  public Person getPerson() {
    return person;
  }

  public void setVersion(String version) {
    this.version = version;
  }

  public void setAccepted(Instant accepted) {
    this.accepted = accepted;
  }

  public void setPerson(Person person) {
    this.person = person;
  }

  public enum Type implements SerializableEnum {
    BUYER_TERMS_OF_SERVICE("Buyer Terms of Service"),
    SELLER_TERMS_OF_SERVICE("Seller Terms of Service"),
    TERMS_OF_SERVICE("Terms of service");

    private final String displayName;

    Type(String displayName) {
      this.displayName = displayName;
    }

    @Override
    public String getValue() {
      return this.name();
    }

    @Override
    public String getDisplayName() {
      return this.displayName;
    }
  }
}
