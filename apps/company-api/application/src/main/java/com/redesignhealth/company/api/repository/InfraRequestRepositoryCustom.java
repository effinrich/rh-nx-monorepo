package com.redesignhealth.company.api.repository;

import com.redesignhealth.company.api.entity.ref.CompanyRef;
import com.redesignhealth.company.api.entity.request.InfrastructureRequest;
import com.redesignhealth.company.api.expansion.Expansion;
import java.util.Optional;

public interface InfraRequestRepositoryCustom {

  Optional<InfrastructureRequest> findByCompanyApiId(CompanyRef apiId, Expansion... expansions);
}
