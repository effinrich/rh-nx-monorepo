package com.redesignhealth.company.api.entity.audit;

import jakarta.persistence.EntityListeners;
import jakarta.persistence.MappedSuperclass;
import java.time.Instant;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

/**
 * Centralized logic to attach audit fields to database tables
 *
 * @see RedesignAuditorAware for how {@link CreatedBy} and {@link LastModifiedBy} are hydrated
 */
@MappedSuperclass
@EntityListeners(AuditingEntityListener.class)
public abstract class Auditable {

  @CreatedBy private String createdBy;
  @CreatedDate private Instant created;
  @LastModifiedBy private String lastModifiedBy;
  @LastModifiedDate private Instant lastModified;

  public Instant getCreated() {
    return created;
  }

  public Auditable setCreated(Instant created) {
    this.created = created;
    return this;
  }

  public Instant getLastModified() {
    return lastModified;
  }

  public Auditable setLastModified(Instant lastModified) {
    this.lastModified = lastModified;
    return this;
  }

  public String getLastModifiedBy() {
    return lastModifiedBy;
  }

  public String getCreatedBy() {
    return createdBy;
  }

  public void setCreatedBy(String createdBy) {
    this.createdBy = createdBy;
  }

  public void setLastModifiedBy(String lastModifiedBy) {
    this.lastModifiedBy = lastModifiedBy;
  }
}
