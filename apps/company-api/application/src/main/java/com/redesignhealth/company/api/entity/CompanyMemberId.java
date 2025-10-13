package com.redesignhealth.company.api.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;
import lombok.Getter;
import lombok.Setter;

@Embeddable
@Getter
@Setter
public class CompanyMemberId implements Serializable {

  @Column(name = "member_of_id")
  private Long memberOfId;

  @Column(name = "members_id")
  private Long memberId;

  public CompanyMemberId() {}

  public CompanyMemberId(Long memberOfId, Long memberId) {
    this.memberOfId = memberOfId;
    this.memberId = memberId;
  }

  @Override
  public int hashCode() {
    final int prime = 31;
    int result = 1;
    result = prime * result + ((memberOfId == null) ? 0 : memberOfId.hashCode());
    result = prime * result + ((memberId == null) ? 0 : memberId.hashCode());
    return result;
  }

  @Override
  public boolean equals(Object obj) {
    if (this == obj) return true;
    if (obj == null) return false;
    if (getClass() != obj.getClass()) return false;
    CompanyMemberId other = (CompanyMemberId) obj;
    return Objects.equals(getMemberOfId(), other.getMemberOfId())
        && Objects.equals(getMemberId(), other.getMemberId());
  }
}
