package com.redesignhealth.company.api.repository;

import com.redesignhealth.company.api.entity.IpMarketplace;
import com.redesignhealth.company.api.entity.ref.IpMarketplaceRef;
import java.util.Optional;
import org.springframework.data.repository.CrudRepository;

public interface IpMarketplaceRepository
    extends CrudRepository<IpMarketplace, Long>, RefRepository {
  Optional<IpMarketplace> findByApiId(IpMarketplaceRef apiId);
}
