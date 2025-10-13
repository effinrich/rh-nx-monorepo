package com.redesignhealth.company.api.repository;

import com.redesignhealth.company.api.dto.enums.CompanyIPMarketplaceType;
import com.redesignhealth.company.api.entity.Company;
import com.redesignhealth.company.api.entity.ref.CompanyRef;
import java.util.Collection;
import java.util.Set;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CompanyRepository extends CrudRepository<Company, Long>, CompanyRepositoryCustom {

  Set<Company> findAllByApiIdIn(Collection<CompanyRef> apiId);

  boolean existsByApiId(CompanyRef apiId);

  boolean existsCompaniesByLinkedApiId(CompanyRef apiId);

  boolean existsByCompanyIpMarketplaceActivityTypeAndApiIdIn(
      CompanyIPMarketplaceType companyIPMarketplaceType, Set<CompanyRef> companyRefs);
}
