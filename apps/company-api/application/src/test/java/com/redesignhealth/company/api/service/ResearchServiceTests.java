package com.redesignhealth.company.api.service;

import static com.redesignhealth.company.api.scaffolding.Fixtures.testCompany;
import static com.redesignhealth.company.api.scaffolding.Fixtures.testCompanyRef;
import static com.redesignhealth.company.api.scaffolding.Fixtures.testCompanyTaxonomy;
import static com.redesignhealth.company.api.scaffolding.Fixtures.testPerson;
import static com.redesignhealth.company.api.service.ResearchService.RESEARCH_REPORT_SUPPORTING_FILES_KEY;
import static org.mockito.AdditionalAnswers.returnsFirstArg;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.util.MimeTypeUtils.TEXT_PLAIN;

import com.redesignhealth.company.api.client.file.GoogleDriveClient;
import com.redesignhealth.company.api.client.search.SearchClient;
import com.redesignhealth.company.api.client.search.command.SearchIndex;
import com.redesignhealth.company.api.client.search.command.SearchIndexCommand;
import com.redesignhealth.company.api.client.search.entity.ResearchAuthor;
import com.redesignhealth.company.api.client.search.entity.ResearchSearchDoc;
import com.redesignhealth.company.api.conflicts.ConflictsEngine;
import com.redesignhealth.company.api.dto.LinkRef;
import com.redesignhealth.company.api.dto.command.ResearchCommand;
import com.redesignhealth.company.api.entity.research.Research;
import com.redesignhealth.company.api.property.ResearchEntityConverter;
import com.redesignhealth.company.api.repository.CompanyRepository;
import com.redesignhealth.company.api.repository.PersonRepository;
import com.redesignhealth.company.api.repository.ResearchRepository;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class ResearchServiceTests {

  @Mock private GoogleDriveClient googleDriveClient;
  @Mock private SearchClient searchClient;
  @Mock private ConflictsEngine conflictsEngine;
  @Mock private CompanyRepository companyRepository;
  @Mock private ResearchEntityConverter researchEntityConverter;
  @Mock private PersonRepository personRepository;
  @Mock private ResearchRepository researchRepository;

  private ResearchService researchService;

  @BeforeEach
  public void setup() {
    researchService =
        new ResearchService(
            searchClient,
            conflictsEngine,
            companyRepository,
            researchEntityConverter,
            personRepository,
            googleDriveClient,
            testCompanyTaxonomy(),
            researchRepository);
  }

  @Test
  public void testCreate_handles_Google_Drive_link() {
    when(companyRepository.findByApiId(testCompanyRef())).thenReturn(Optional.of(testCompany()));
    when(companyRepository.existsByApiId(testCompanyRef())).thenReturn(true);
    when(researchRepository.save(any(Research.class))).then(returnsFirstArg());
    var documentIdToCheck = "1Nxjzmmp7gw0Zs5p3-XZZbIBkHKVomRnAde4rgQluGJ8";
    var command =
        ResearchCommand.builder()
            .companyId(testCompanyRef().value())
            .supportingFiles(
                List.of(
                    LinkRef.of(
                        "https://docs.google.com/presentation/d/" + documentIdToCheck,
                        RESEARCH_REPORT_SUPPORTING_FILES_KEY)))
            .build();

    researchService.create(command);
    verify(googleDriveClient, times(1)).getDocument(documentIdToCheck, TEXT_PLAIN);
    verify(searchClient).index(any());
  }

  @Test
  public void testCreate_indexes_all_fields() {
    var companyId = testCompanyRef();
    var company = testCompany();
    var author = testPerson();
    var testLink = LinkRef.of("https://example.com", RESEARCH_REPORT_SUPPORTING_FILES_KEY);
    var command =
        ResearchCommand.builder()
            .title("Shinra User Research")
            .authors(List.of(author.getEmail().value()))
            .companyId(companyId.value())
            .objectives("Free form text")
            .services(List.of("Concept Test"))
            .segments(List.of("Segments"))
            .methods(List.of("Survey"))
            .supportingFiles(List.of(testLink))
            .sampleSize(100L)
            .teamRole("In-house")
            .additionalSegments(List.of("GenZ"))
            .specializedMethods(List.of("Q-sort Exercise"))
            .build();

    when(companyRepository.findByApiId(companyId)).thenReturn(Optional.of(company));
    when(companyRepository.existsByApiId(companyId)).thenReturn(true);
    when(personRepository.existsByEmail(author.getEmail())).thenReturn(true);
    when(researchRepository.save(any(Research.class))).then(returnsFirstArg());
    var research = researchService.create(command);
    verify(searchClient, times(1))
        .index(
            SearchIndexCommand.builder()
                .documentId(research.getApiId().value())
                .index(SearchIndex.RESEARCH)
                .document(
                    ResearchSearchDoc.builder()
                        .id(research.getApiId().value())
                        .sprintName("Shinra User Research")
                        .authors(List.of(ResearchAuthor.of(author.getEmail().value())))
                        .opcoSprNew(company.getName())
                        .companyApiCompanyId(companyId.value())
                        .researchObjectives("Free form text")
                        .researchServices(List.of("Concept Test"))
                        .toplineSegments(List.of("Segments"))
                        .methods(List.of("Survey"))
                        .documentLinks(List.of(testLink))
                        .documentText(List.of())
                        .researchSampleSize(100L)
                        .createdAt(research.getCreated())
                        .teamRole("In-house")
                        .patientSegments(List.of("GenZ"))
                        .specializedMethods(List.of("Q-sort Exercise"))
                        .taxonomyTerm1(company.getTaxonomyTerms().get(0).getDisplayName())
                        .taxonomyTerm2(company.getTaxonomyTerms().get(1).getDisplayName())
                        .taxonomyTerm3(company.getTaxonomyTerms().get(2).getDisplayName())
                        .build())
                .build());
  }
}
