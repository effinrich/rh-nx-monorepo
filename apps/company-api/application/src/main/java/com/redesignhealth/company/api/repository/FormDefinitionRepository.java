package com.redesignhealth.company.api.repository;

import com.redesignhealth.company.api.entity.FormDefinition;
import java.util.Optional;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FormDefinitionRepository extends CrudRepository<FormDefinition, Long> {
  Optional<FormDefinition> findByType(FormDefinition.Type type);
}
