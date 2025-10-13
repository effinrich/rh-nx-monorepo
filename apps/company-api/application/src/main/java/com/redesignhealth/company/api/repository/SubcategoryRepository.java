package com.redesignhealth.company.api.repository;

import com.redesignhealth.company.api.entity.Category;
import com.redesignhealth.company.api.entity.Subcategory;
import com.redesignhealth.company.api.entity.ref.SubcategoryRef;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface SubcategoryRepository
    extends JpaRepository<Subcategory, Long>, JpaSpecificationExecutor<Subcategory>, RefRepository {
  boolean existsByApiId(SubcategoryRef apiId);

  Optional<Subcategory> findSubcategoryByApiId(SubcategoryRef apiId);

  List<Subcategory> findByNameContainingAndCategory(String name, Category category);

  List<Subcategory> findByCategory(Category category);

  Set<Subcategory> findByApiIdIn(List<SubcategoryRef> apiIds);

  Optional<Subcategory> findByName(String name);
}
