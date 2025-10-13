package com.redesignhealth.company.api.repository;

import static com.redesignhealth.company.api.entity.ref.Ref.COMPANY;
import static com.redesignhealth.company.api.entity.ref.Ref.DEFAULT_REF_COLUMN_NAME;
import static com.redesignhealth.company.api.expansion.Expansion.MEMBER_OF;

import com.redesignhealth.company.api.entity.Person;
import com.redesignhealth.company.api.entity.ref.CompanyRef;
import com.redesignhealth.company.api.entity.ref.PersonRef;
import com.redesignhealth.company.api.expansion.Expansion;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import java.util.List;
import java.util.Optional;
import java.util.Set;

public class PersonRepositoryImpl extends BaseCustomRepository<Person>
    implements PersonRepositoryCustom {

  @PersistenceContext private EntityManager em;

  private static final Set<Expansion> VALID_EXPANSIONS = Set.of(MEMBER_OF);

  protected PersonRepositoryImpl() {
    super(Person.class, VALID_EXPANSIONS);
  }

  @Override
  public Optional<Person> findByEmail(PersonRef email, Expansion... expansions) {
    return findByRef(email, expansions);
  }

  @Override
  public List<Person> findAllByMemberOf(CompanyRef apiId, Expansion... expansions) {
    var cb = em.getCriteriaBuilder();
    var qb = cb.createQuery(Person.class);
    var person = qb.from(Person.class);
    var opCo = person.join("memberOf");
    opCo.on(
        cb.equal(
            opCo.get(COMPANY).get(DEFAULT_REF_COLUMN_NAME), cb.parameter(String.class, "ref")));
    fetchExpansions(person, expansions);
    return em.createQuery(qb).setParameter("ref", apiId).getResultList();
  }
}
