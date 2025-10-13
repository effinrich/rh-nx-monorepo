package com.redesignhealth.company.api.repository;

import static com.redesignhealth.company.api.expansion.Expansion.MEMBERS;

import com.redesignhealth.company.api.dto.CompanyMemberDto;
import com.redesignhealth.company.api.entity.Company;
import com.redesignhealth.company.api.entity.CompanyMember;
import com.redesignhealth.company.api.entity.ref.CompanyRef;
import com.redesignhealth.company.api.entity.ref.PersonRef;
import com.redesignhealth.company.api.expansion.Expansion;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.transaction.annotation.Transactional;

public class CompanyRepositoryImpl extends BaseCustomRepository<Company>
    implements CompanyRepositoryCustom {

  @PersistenceContext private EntityManager em;

  private static final Set<Expansion> VALID_EXPANSIONS = Set.of(MEMBERS);

  public CompanyRepositoryImpl() {
    super(Company.class, VALID_EXPANSIONS);
  }

  @Override
  public Page<Company> findAllByMembersEmail(
      Pageable pageable, PersonRef email, Expansion... expansions) {
    var cb = em.getCriteriaBuilder();
    var qb = cb.createQuery(Long.class);
    var opCo = qb.from(Company.class);

    qb.select(opCo.get("id"));

    var person = opCo.join("members");
    person.on(cb.equal(person.get("person").get("email"), cb.parameter(String.class, "ref")));

    var query = em.createQuery(qb).setParameter("ref", email);
    var ids = attachLimitAndOffset(pageable, query);

    return findAll(ids, pageable, expansions);
  }

  @Override
  public Optional<Company> findByApiId(CompanyRef apiId, Expansion... expansions) {
    return findByRef(apiId, expansions);
  }

  public List<CompanyMemberDto> getMembers(CompanyRef apiId) {
    String query =
        "select new com.redesignhealth.company.api.dto.CompanyMemberDto(p , cm) "
            + "from Person p inner join CompanyMember cm on p.id = cm.person.id where cm.company.apiId = ?1";
    return em.createQuery(query, CompanyMemberDto.class).setParameter(1, apiId).getResultList();
  }

  @Override
  public CompanyMember getMember(CompanyRef apiId, PersonRef email) {
    String query =
        "select cm " + "from CompanyMember cm where cm.company.apiId = ?1 and cm.person.email = ?2";
    return em.createQuery(query, CompanyMember.class)
        .setParameter(1, apiId)
        .setParameter(2, email)
        .getSingleResult();
  }

  @Override
  @Transactional
  public int deleteMembers(Long apiId) {
    String query = "delete from company_members where member_of_id = ?1";
    return em.createNativeQuery(query).setParameter(1, apiId).executeUpdate();
  }

  @Transactional
  @Override
  public int deleteMember(Long apiId, Long personId) {
    String query = "delete from company_members where member_of_id = ?1 and members_id = ?2";
    return em.createNativeQuery(query)
        .setParameter(1, apiId)
        .setParameter(2, personId)
        .executeUpdate();
  }

  @Transactional
  @Override
  public int deleteConflicts(Long apiId) {
    String query =
        "delete from company_conflicts where member_of_id = ?1 or company_conflicts_id = ?1";
    return em.createNativeQuery(query).setParameter(1, apiId).executeUpdate();
  }
}
