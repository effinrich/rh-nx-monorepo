package com.redesignhealth.company.api.repository;

import com.redesignhealth.company.api.entity.ref.VendorRef;
import com.redesignhealth.company.api.entity.vendor.Vendor;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface VendorRepository
    extends JpaRepository<Vendor, Integer>, JpaSpecificationExecutor<Vendor>, RefRepository {
  boolean existsByApiId(VendorRef companyVendorRef);

  boolean existsByName(String name);

  Optional<Vendor> findByApiId(VendorRef apiId);

  List<Vendor> findByApiIdIsNull();

  Optional<Vendor> findByName(String name);
}
