package com.redesignhealth.company.api.repository;

import com.redesignhealth.company.api.entity.Person;
import com.redesignhealth.company.api.entity.ref.CompanyRef;
import com.redesignhealth.company.api.entity.ref.PersonRef;
import com.redesignhealth.company.api.expansion.Expansion;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface PersonRepositoryCustom {
  Page<Person> findAll(Pageable pageable, Expansion... expansions);

  Optional<Person> findByEmail(PersonRef email, Expansion... expansions);

  List<Person> findAllByMemberOf(CompanyRef apiId, Expansion... expansions);
}
