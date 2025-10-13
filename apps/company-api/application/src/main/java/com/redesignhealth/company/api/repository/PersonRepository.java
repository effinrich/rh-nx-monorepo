package com.redesignhealth.company.api.repository;

import com.redesignhealth.company.api.entity.Person;
import com.redesignhealth.company.api.entity.ref.PersonRef;
import org.springframework.data.repository.CrudRepository;

public interface PersonRepository extends CrudRepository<Person, Long>, PersonRepositoryCustom {

  boolean existsByEmail(PersonRef email);
}
