package com.redesignhealth.company.api.repository;

import com.redesignhealth.company.api.entity.Consent;
import com.redesignhealth.company.api.entity.Person;
import java.util.Optional;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ConsentRepository extends CrudRepository<Consent, Long> {

  Optional<Consent> findByTypeAndPerson(Consent.Type type, Person person);
}
