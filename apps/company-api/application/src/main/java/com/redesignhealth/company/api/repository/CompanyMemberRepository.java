package com.redesignhealth.company.api.repository;

import com.redesignhealth.company.api.dto.enums.CompanyMemberStatus;
import com.redesignhealth.company.api.entity.CompanyMember;
import com.redesignhealth.company.api.entity.CompanyMemberId;
import java.util.List;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CompanyMemberRepository extends CrudRepository<CompanyMember, CompanyMemberId> {
  List<CompanyMember> findAllByStatusAndGoogleDriveFolderAccess(
      CompanyMemberStatus status, boolean googleDriveFolderAccess);
}
