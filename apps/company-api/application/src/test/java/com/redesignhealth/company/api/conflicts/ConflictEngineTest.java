package com.redesignhealth.company.api.conflicts;

import static com.redesignhealth.company.api.scaffolding.Fixtures.TEST_COMPANY_ID;
import static com.redesignhealth.company.api.scaffolding.Fixtures.testCompany;
import static com.redesignhealth.company.api.scaffolding.Fixtures.testCompanyRef;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.when;

import com.redesignhealth.company.api.entity.Company;
import com.redesignhealth.company.api.entity.CompanyConflict;
import com.redesignhealth.company.api.entity.ref.CompanyRef;
import com.redesignhealth.company.api.repository.CompanyConflictRepository;
import com.redesignhealth.company.api.scaffolding.WithRedesignUser;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@ExtendWith(SpringExtension.class)
public class ConflictEngineTest {
  @Mock CompanyConflictRepository companyConflictRepository;
  private ConflictsEngine conflictEngine;

  @BeforeEach
  public void initConflictEngine() {
    conflictEngine = new ConflictsEngine(companyConflictRepository);
  }

  @Test
  @WithRedesignUser
  public void When_Company_Doesnt_Have_Conflict_Should_Return_Empty_List() {
    var apiId = testCompanyRef();
    when(companyConflictRepository.findByMemberOfIdApiId(apiId)).thenReturn(List.of());
    when(companyConflictRepository.findByCompanyConflictsIdApiId(apiId)).thenReturn(List.of());
    assertEquals(List.of(), conflictEngine.getCompaniesInConflict(apiId));
  }

  @Test
  @WithRedesignUser
  public void When_Company_Has_Conflict_Should_Return_List_With_Elements() {
    var apiId = testCompanyRef();
    var apiId2 = CompanyRef.of("company_id");
    var companyInConflict = new CompanyConflict();
    companyInConflict.setMemberOfId(Company.from(apiId));
    companyInConflict.setCompanyConflictsId(Company.from(apiId2));
    when(companyConflictRepository.findByMemberOfIdApiId(apiId))
        .thenReturn(List.of(companyInConflict));
    when(companyConflictRepository.findByCompanyConflictsIdApiId(apiId)).thenReturn(List.of());
    assertEquals(1, conflictEngine.getCompaniesInConflict(apiId).size());
  }

  @Test
  @WithRedesignUser(memberOf = {})
  public void When_Person_Doesnt_Belong_To_Any_Company_Should_Access_To_Any_Document() {
    assertTrue(conflictEngine.hasAccess(testCompanyRef()));
  }

  @Test
  @WithRedesignUser(memberOf = TEST_COMPANY_ID)
  public void
      When_Person_Belong_To_Any_Company_But_Doesnt_Have_Conflicts_Should_Access_To_Any_Document() {
    assertTrue(conflictEngine.hasAccess(CompanyRef.of("companyRef1")));
  }

  @Test
  @WithRedesignUser(memberOf = TEST_COMPANY_ID)
  public void
      When_Person_Belong_To_Any_Company_But_It_Has_Conflicts_Not_Should_Access_To_Any_Document() {
    var company = testCompany();
    var conflictApiId = CompanyRef.of("companyRef1");

    var companyInConflict = new CompanyConflict();
    companyInConflict.setMemberOfId(Company.from(conflictApiId));
    companyInConflict.setCompanyConflictsId(company);
    when(companyConflictRepository.findByMemberOfIdApiId(conflictApiId))
        .thenReturn(List.of(companyInConflict));
    when(companyConflictRepository.findByCompanyConflictsIdApiId(conflictApiId))
        .thenReturn(List.of());
    assertFalse(conflictEngine.hasAccess(CompanyRef.of("companyRef1")));
  }
}
