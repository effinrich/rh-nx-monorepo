package com.redesignhealth.company.api.dto;

import com.redesignhealth.company.api.entity.Company;
import java.util.List;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CompanyDto {
  private Company company;
  List<CompanyMemberDto> companyMembersDto;
}
