package com.redesignhealth.company.api.repository;

import static com.redesignhealth.company.api.entity.ref.Ref.DEFAULT_REF_COLUMN_NAME;

import com.redesignhealth.company.api.entity.ref.CompanyRef;
import com.redesignhealth.company.api.entity.request.InfrastructureRequest;
import com.redesignhealth.company.api.expansion.Expansion;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import java.util.Optional;
import java.util.Set;

public class InfraRequestRepositoryImpl extends BaseCustomRepository<InfrastructureRequest>
    implements InfraRequestRepositoryCustom {

  @PersistenceContext private EntityManager em;

  public static final Set<Expansion> VALID_EXPANSIONS = Set.of(Expansion.FORMS);

  protected InfraRequestRepositoryImpl() {
    super(InfrastructureRequest.class, VALID_EXPANSIONS);
  }

  @Override
  public Optional<InfrastructureRequest> findByCompanyApiId(
      CompanyRef apiId, Expansion... expansions) {
    var cb = em.getCriteriaBuilder();
    var queryBuilder = cb.createQuery(InfrastructureRequest.class);

    var infraRequest = queryBuilder.from(InfrastructureRequest.class);

    var opCo = infraRequest.join("company");
    opCo.on(cb.equal(opCo.get(DEFAULT_REF_COLUMN_NAME), cb.parameter(String.class, "ref")));

    fetchExpansions(infraRequest, expansions);

    return handleMissingResults(
        () -> em.createQuery(queryBuilder).setParameter("ref", apiId).getSingleResult());
  }
}
