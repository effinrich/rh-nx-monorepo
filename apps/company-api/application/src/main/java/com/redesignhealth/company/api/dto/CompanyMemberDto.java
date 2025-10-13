package com.redesignhealth.company.api.dto;

import com.redesignhealth.company.api.entity.CompanyMember;
import com.redesignhealth.company.api.entity.Person;
import lombok.Value;

@Value
public class CompanyMemberDto {
  private Person person;
  private CompanyMember companyMember;
}
