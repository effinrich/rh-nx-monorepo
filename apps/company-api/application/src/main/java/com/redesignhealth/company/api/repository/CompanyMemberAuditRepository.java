package com.redesignhealth.company.api.repository;

import com.redesignhealth.company.api.entity.CompanyMemberAudit;
import java.util.List;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CompanyMemberAuditRepository extends CrudRepository<CompanyMemberAudit, Long> {
  List<CompanyMemberAudit> findCompanyMemberAuditByMembersId(String email);
}
