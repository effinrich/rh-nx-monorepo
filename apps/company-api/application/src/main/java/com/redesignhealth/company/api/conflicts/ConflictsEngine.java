package com.redesignhealth.company.api.conflicts;

import com.google.common.annotations.VisibleForTesting;
import com.redesignhealth.company.api.entity.ref.CompanyRef;
import com.redesignhealth.company.api.repository.CompanyConflictRepository;
import com.redesignhealth.company.api.security.AuthChecks;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;
import org.springframework.stereotype.Component;

@Component
public class ConflictsEngine {
  private final CompanyConflictRepository companyConflictRepository;

  public ConflictsEngine(CompanyConflictRepository companyConflictRepository) {
    this.companyConflictRepository = companyConflictRepository;
  }

  /** Check if Principal has access to company */
  public boolean hasAccess(CompanyRef company) {
    var conflictsForCompany = getCompaniesInConflict(company);
    return AuthChecks.getPrincipal().getMemberOf().stream()
        .noneMatch(conflictsForCompany::contains);
  }

  public Map<CompanyRef, Boolean> canAccess(Set<CompanyRef> companiesRequested) {
    return companiesRequested.stream()
        .collect(Collectors.toMap(Function.identity(), this::hasAccess));
  }

  @VisibleForTesting
  List<CompanyRef> getCompaniesInConflict(CompanyRef apiId) {
    var companiesApiRefInConflict =
        new ArrayList<>(
            companyConflictRepository.findByMemberOfIdApiId(apiId).stream()
                .map(y -> y.getCompanyConflictsId().getApiId())
                .toList());
    companiesApiRefInConflict.addAll(
        companyConflictRepository.findByCompanyConflictsIdApiId(apiId).stream()
            .map(y -> y.getMemberOfId().getApiId())
            .toList());
    return companiesApiRefInConflict;
  }
}
