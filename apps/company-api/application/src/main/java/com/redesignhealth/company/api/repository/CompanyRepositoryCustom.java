package com.redesignhealth.company.api.repository;

import com.redesignhealth.company.api.dto.CompanyMemberDto;
import com.redesignhealth.company.api.entity.Company;
import com.redesignhealth.company.api.entity.CompanyMember;
import com.redesignhealth.company.api.entity.ref.CompanyRef;
import com.redesignhealth.company.api.entity.ref.PersonRef;
import com.redesignhealth.company.api.expansion.Expansion;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface CompanyRepositoryCustom {

  Page<Company> findAll(Pageable pageable, Expansion... expansions);

  Page<Company> findAllByMembersEmail(Pageable pageable, PersonRef email, Expansion... expansions);

  Optional<Company> findByApiId(CompanyRef apiId, Expansion... expansions);

  List<CompanyMemberDto> getMembers(CompanyRef apiId);

  int deleteMembers(Long apiId);

  CompanyMember getMember(CompanyRef apiId, PersonRef email);

  public int deleteMember(Long apiId, Long personId);

  public int deleteConflicts(Long apiId);
}
