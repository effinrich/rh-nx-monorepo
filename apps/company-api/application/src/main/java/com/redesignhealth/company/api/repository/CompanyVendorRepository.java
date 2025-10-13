package com.redesignhealth.company.api.repository;

import com.redesignhealth.company.api.entity.Company;
import com.redesignhealth.company.api.entity.ref.CompanyVendorRef;
import com.redesignhealth.company.api.entity.vendor.CompanyVendor;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CompanyVendorRepository extends JpaRepository<CompanyVendor, Long>, RefRepository {
  Optional<CompanyVendor> findByApiId(CompanyVendorRef apiId);

  List<CompanyVendor> findAllByCompany(Company company, Pageable page);
}
