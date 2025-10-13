package com.redesignhealth.company.api.service;

import static com.redesignhealth.company.api.scaffolding.Fixtures.testCompany;
import static com.redesignhealth.company.api.scaffolding.Fixtures.testCompanyRef;
import static com.redesignhealth.company.api.scaffolding.Fixtures.testPersonRef;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.AdditionalAnswers.returnsFirstArg;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.util.MimeTypeUtils.TEXT_PLAIN;

import com.redesignhealth.company.api.client.file.GoogleDriveClient;
import com.redesignhealth.company.api.client.search.SearchClient;
import com.redesignhealth.company.api.client.search.entity.ExpertNoteSearchDoc;
import com.redesignhealth.company.api.client.search.entity.SearchResult;
import com.redesignhealth.company.api.conflicts.ConflictsEngine;
import com.redesignhealth.company.api.dto.command.ExpertNoteCommand;
import com.redesignhealth.company.api.entity.ExpertNote;
import com.redesignhealth.company.api.entity.ref.CompanyRef;
import com.redesignhealth.company.api.property.ExpertNoteEntityConverter;
import com.redesignhealth.company.api.repository.CompanyRepository;
import com.redesignhealth.company.api.repository.ExpertNoteRepository;
import com.redesignhealth.company.api.repository.PersonRepository;
import com.redesignhealth.company.api.scaffolding.Fixtures;
import com.redesignhealth.company.api.taxonomy.CompanyTaxonomy;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;

@ExtendWith(MockitoExtension.class)
public class ExpertNoteServiceTests {

  private ExpertNoteService expertNoteService;

  @Mock private SearchClient searchClient;

  @Mock private CompanyRepository companyRepository;

  @Mock private PersonRepository personRepository;

  @Mock private ExpertNoteEntityConverter expertNoteEntityConverter;

  @Mock private CompanyTaxonomy companyTaxonomy;

  @Mock private ConflictsEngine conflictsEngine;

  @Mock private ExpertNoteRepository expertNoteRepository;

  @Mock private GoogleDriveClient googleDriveClient;

  @BeforeEach
  public void setup() {
    expertNoteService =
        new ExpertNoteService(
            searchClient,
            expertNoteEntityConverter,
            companyRepository,
            personRepository,
            conflictsEngine,
            companyTaxonomy,
            googleDriveClient,
            expertNoteRepository);
  }

  @Test
  public void testQuery_accessDeniedToCompany() {
    var doc = Fixtures.testExpertCallSearchDoc();
    var companyRefToAccess = CompanyRef.of(doc.getCompanyApiCompanyIds().get(0));
    when(searchClient.search(any(), any(), any()))
        .thenReturn(new PageImpl<>(List.of(SearchResult.of(doc))));
    Map<CompanyRef, Boolean> access = new HashMap<>();
    access.put(companyRefToAccess, false);
    when(conflictsEngine.canAccess(Set.of(companyRefToAccess))).thenReturn(access);

    var results = expertNoteService.query("", List.of(), PageRequest.of(0, 20), List.of());
    assertThat(results.getContent().get(0).canAccess()).isFalse();
  }

  @Test
  public void testQuery_accessToCompany() {
    var doc = Fixtures.testExpertCallSearchDoc();
    var companyRefToAccess = Fixtures.testCompanyRef();
    when(searchClient.search(any(), any(), any()))
        .thenReturn(new PageImpl<>(List.of(SearchResult.of(doc))));
    Map<CompanyRef, Boolean> access = new HashMap<>();
    access.put(companyRefToAccess, true);
    when(conflictsEngine.canAccess(Set.of(companyRefToAccess))).thenReturn(access);

    var results = expertNoteService.query("", List.of(), PageRequest.of(0, 20), List.of());
    assertThat(results.getContent().get(0).canAccess()).isTrue();
  }

  @Test
  public void testQuery_accessToDocumentWithNoCompany() {
    var doc = ExpertNoteSearchDoc.builder().build();
    when(searchClient.search(any(), any(), any()))
        .thenReturn(new PageImpl<>(List.of(SearchResult.of(doc))));

    var results = expertNoteService.query("", List.of(), PageRequest.of(0, 20), List.of());
    verify(conflictsEngine, never()).hasAccess(any());
    assertThat(results.getContent().get(0).canAccess()).isTrue();
  }

  @Test
  public void testQuery_knownCompanyPopulatesCompanies() {
    var doc = Fixtures.testExpertCallSearchDoc();
    var companyRefToAccess = Fixtures.testCompanyRef();
    var company = Fixtures.testCompany();

    when(companyRepository.findAllByApiIdIn(Set.of(companyRefToAccess)))
        .thenReturn(Set.of(company));
    when(searchClient.search(any(), any(), any()))
        .thenReturn(new PageImpl<>(List.of(SearchResult.of(doc))));

    var results = expertNoteService.query("", List.of(), PageRequest.of(0, 20), List.of());
    assertThat(results.getContent().get(0).getCompanies().size()).isEqualTo(1);

    var companyInSet = results.getContent().get(0).getCompanies().iterator().next();
    assertThat(companyInSet).isEqualTo(company);
  }

  @Test
  public void testQuery_unknownCompanyDoesNotHydrateCompanies() {
    var doc = Fixtures.testExpertCallSearchDoc();
    var companyRefToAccess = Fixtures.testCompanyRef();

    when(companyRepository.findAllByApiIdIn(Set.of(companyRefToAccess))).thenReturn(Set.of());
    when(searchClient.search(any(), any(), any()))
        .thenReturn(new PageImpl<>(List.of(SearchResult.of(doc))));

    var results = expertNoteService.query("", List.of(), PageRequest.of(0, 20), List.of());
    assertThat(results.getContent().get(0).getCompanies()).isEmpty();
  }

  @Test
  public void testCreate_handles_Google_Drive_noteHref() {
    when(companyRepository.findAllByApiIdIn(List.of(testCompanyRef())))
        .thenReturn(Set.of(testCompany()));
    when(personRepository.existsByEmail(testPersonRef())).thenReturn(true);
    when(expertNoteRepository.save(any(ExpertNote.class))).then(returnsFirstArg());
    var documentIdToCheck = "1Nxjzmmp7gw0Zs5p3-XZZbIBkHKVomRnAde4rgQluGJ8";
    var command =
        ExpertNoteCommand.builder()
            .companyIds(List.of(testCompanyRef()))
            .noteTaker(testPersonRef())
            .noteHref("https://docs.google.com/presentation/d/" + documentIdToCheck)
            .build();

    expertNoteService.create(command);
    verify(googleDriveClient, times(1)).getDocument(documentIdToCheck, TEXT_PLAIN);
    verify(searchClient).index(any());
  }

  @Test
  public void testCreate_handles_non_Google_Drive_noteHref() {
    when(companyRepository.findAllByApiIdIn(List.of(testCompanyRef())))
        .thenReturn(Set.of(testCompany()));
    when(personRepository.existsByEmail(testPersonRef())).thenReturn(true);
    when(expertNoteRepository.save(any(ExpertNote.class))).then(returnsFirstArg());
    var command =
        ExpertNoteCommand.builder()
            .companyIds(List.of(testCompanyRef()))
            .noteTaker(testPersonRef())
            .noteHref("https://example.com/1")
            .build();

    expertNoteService.create(command);
    verify(googleDriveClient, never()).getDocument(any(), any());
    verify(searchClient).index(any());
  }
}
