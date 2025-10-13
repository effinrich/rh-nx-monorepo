package com.redesignhealth.company.api.repository;

import com.redesignhealth.company.api.entity.Company;
import com.redesignhealth.company.api.entity.CompanyConflict;
import com.redesignhealth.company.api.entity.ref.CompanyRef;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CompanyConflictRepository extends JpaRepository<CompanyConflict, Integer> {
  boolean existsByMemberOfIdAndCompanyConflictsId(Company memberOfId, Company companyConflictsId);

  CompanyConflict findCompanyConflictsByMemberOfIdAndCompanyConflictsId(
      Company memberOfId, Company companyConflictsId);

  List<CompanyConflict> findByMemberOfId(Company memberOfId);

  List<CompanyConflict> findByMemberOfIdApiId(CompanyRef apiId);

  List<CompanyConflict> findByCompanyConflictsId(Company companyConflictsId);

  List<CompanyConflict> findByCompanyConflictsIdApiId(CompanyRef apiId);
}
