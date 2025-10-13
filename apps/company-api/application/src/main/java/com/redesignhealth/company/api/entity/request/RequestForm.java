package com.redesignhealth.company.api.entity.request;

import com.fasterxml.jackson.databind.JsonNode;
import com.redesignhealth.company.api.entity.FormDefinition;
import com.redesignhealth.company.api.entity.audit.Auditable;
import com.vladmihalcea.hibernate.type.json.JsonBinaryType;
import jakarta.persistence.*;
import java.util.Objects;
import org.hibernate.annotations.Type;

@Entity
public class RequestForm extends Auditable {

  @Id @GeneratedValue private Long id;

  @Enumerated(EnumType.STRING)
  private FormDefinition.Type type;

  @Enumerated(EnumType.STRING)
  private PublicationStatus status;

  @Type(JsonBinaryType.class)
  @Column(columnDefinition = "jsonb")
  private JsonNode form;

  @ManyToOne private InfrastructureRequest infrastructureRequest;

  private RequestForm() {
    this.status = PublicationStatus.NOT_STARTED;
  }

  public static Builder builder(InfrastructureRequest infraRequest, FormDefinition.Type type) {
    return new Builder(infraRequest, type);
  }

  public FormDefinition.Type getType() {
    return type;
  }

  public PublicationStatus getStatus() {
    return status;
  }

  public JsonNode getForm() {
    return form;
  }

  public void setForm(JsonNode form) {
    this.form = form;
  }

  public void setStatus(PublicationStatus status) {
    this.status = status;
  }

  @Override
  public int hashCode() {
    return Objects.hash(infrastructureRequest, type);
  }

  @Override
  public boolean equals(Object obj) {
    if (this == obj) return true;
    if (obj == null) return false;
    if (getClass() != obj.getClass()) return false;
    RequestForm other = (RequestForm) obj;
    return Objects.equals(infrastructureRequest, other.infrastructureRequest) && type == other.type;
  }

  public static class Builder {

    private final InfrastructureRequest infraRequest;
    private final FormDefinition.Type type;
    private PublicationStatus status;
    private JsonNode form;

    public Builder(InfrastructureRequest infraRequest, FormDefinition.Type type) {
      this.infraRequest = infraRequest;
      this.type = type;
    }

    public RequestForm build() {
      var requestForm = new RequestForm();
      requestForm.infrastructureRequest = infraRequest;
      requestForm.type = type;
      requestForm.status = status;
      requestForm.form = form;
      return requestForm;
    }

    public Builder status(PublicationStatus status) {
      this.status = status;
      return this;
    }

    public Builder form(JsonNode form) {
      this.form = form;
      return this;
    }
  }
}
