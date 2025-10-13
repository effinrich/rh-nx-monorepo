package com.redesignhealth.company.api.repository;

import com.redesignhealth.company.api.entity.ref.Ref;
import com.redesignhealth.company.api.exception.UnsupportedExpansionException;
import com.redesignhealth.company.api.expansion.Expansion;
import jakarta.persistence.EntityManager;
import jakarta.persistence.NoResultException;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.function.Supplier;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.query.QueryUtils;
import org.springframework.data.jpa.support.PageableUtils;
import org.springframework.data.support.PageableExecutionUtils;

/**
 * Inspired by {@link org.springframework.data.jpa.repository.support.SimpleJpaRepository}
 *
 * <p>Adds support for {@link Expansion} to JPA queries
 */
public abstract class BaseCustomRepository<T> {

  @PersistenceContext private EntityManager em;

  private final Class<T> domainClass;
  private final Set<Expansion> validExpansions;

  protected BaseCustomRepository(Class<T> domainClass, Set<Expansion> validExpansions) {
    this.domainClass = domainClass;
    this.validExpansions = validExpansions;
  }

  /**
   * Replacement for {@link
   * org.springframework.data.repository.PagingAndSortingRepository#findAll(Pageable)} with support
   * for {@link Expansion}
   */
  public Page<T> findAll(Pageable pageable, Expansion... expansions) {
    return findAll(findIds(pageable), pageable, expansions);
  }

  protected Page<T> findAll(List<Long> ids, Pageable pageable, Expansion... expansions) {
    var cb = em.getCriteriaBuilder();
    var qb = cb.createQuery(domainClass);
    var root = qb.from(domainClass);

    fetchExpansions(root, expansions);

    qb.where(root.get("id").in(cb.parameter(List.class, "ids")));

    qb.orderBy(QueryUtils.toOrders(pageable.getSort(), root, cb));

    List<T> results = em.createQuery(qb).setParameter("ids", ids).getResultList();

    return PageableExecutionUtils.getPage(results, pageable, this::getTotalRows);
  }

  /**
   * Useful for retrieving paginated results without hydrating fields. Hibernate has a limitation in
   * paginating and hydrating at the same time.
   *
   * <p>Also, this will help us later on in caching this query while also giving us the flexibility
   * to expand fields.
   *
   * <p>Equivalent to SELECT id FROM table LIMIT ? OFFSET ?
   */
  protected List<Long> findIds(Pageable pageable) {
    var criteriaQuery = em.getCriteriaBuilder().createQuery(Long.class);
    var root = criteriaQuery.from(domainClass);
    criteriaQuery.select(root.get("id"));

    return attachLimitAndOffset(pageable, em.createQuery(criteriaQuery));
  }

  protected Optional<T> findByRef(Ref ref, Expansion[] expansions) {

    var cb = em.getCriteriaBuilder();
    var queryBuilder = cb.createQuery(domainClass);
    var root = queryBuilder.from(domainClass);
    fetchExpansions(root, expansions);

    Predicate predicate =
        cb.equal(root.get(ref.getColumnName()), cb.parameter(String.class, ref.getColumnName()));
    queryBuilder.where(predicate);

    return handleMissingResults(
        () ->
            em.createQuery(queryBuilder).setParameter(ref.getColumnName(), ref).getSingleResult());
  }

  protected List<Long> attachLimitAndOffset(Pageable pageable, TypedQuery<Long> query) {
    return query
        .setFirstResult(PageableUtils.getOffsetAsInteger(pageable))
        .setMaxResults(pageable.getPageSize())
        .getResultList();
  }

  /** Equivalent to SELECT count(*) FROM table */
  protected Long getTotalRows() {
    var cb = em.getCriteriaBuilder();
    var query = cb.createQuery(Long.class);
    var root = query.from(domainClass);
    return em.createQuery(query.select(cb.count(root))).getSingleResult();
  }

  /**
   * Used to hydrate child entities that are defaulted to be lazy loaded
   *
   * @throws UnsupportedExpansionException informs client of unsupported expansion
   */
  protected void fetchExpansions(Root<T> root, Expansion[] expansions) {
    for (var expansion : expansions) {
      if (!validExpansions.contains(expansion)) {
        throw new UnsupportedExpansionException(expansion);
      }
      root.fetch(expansion.getFieldName(), JoinType.LEFT);
    }
  }

  /** Wrap result in an Optional to avoid exception handling of no results */
  protected Optional<T> handleMissingResults(Supplier<T> query) {
    try {
      return Optional.of(query.get());
    } catch (NoResultException e) {
      return Optional.empty();
    }
  }
}
