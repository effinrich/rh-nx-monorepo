package com.redesignhealth.company.api.service;

import com.google.common.collect.Sets;
import com.redesignhealth.company.api.client.jira.CreateIssueRequest;
import com.redesignhealth.company.api.client.jira.JiraClient;
import com.redesignhealth.company.api.dto.command.PersonRequestCommand;
import com.redesignhealth.company.api.entity.Company;
import com.redesignhealth.company.api.entity.PersonRequest;
import com.redesignhealth.company.api.entity.ref.CompanyRef;
import com.redesignhealth.company.api.entity.request.RequestStatus;
import com.redesignhealth.company.api.entity.request.RoleAuthority;
import com.redesignhealth.company.api.exception.InvalidFieldException;
import com.redesignhealth.company.api.exception.dto.FieldErrorDetails;
import com.redesignhealth.company.api.exception.dto.FieldErrorType;
import com.redesignhealth.company.api.property.JiraRequestProperties;
import com.redesignhealth.company.api.repository.CompanyRepository;
import com.redesignhealth.company.api.repository.PersonRequestRepository;
import java.util.Set;
import java.util.stream.Collectors;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

@Service
public class PersonRequestService {

  private final JiraClient client;
  private final JiraRequestProperties properties;
  private final CompanyRepository companyRepository;
  private final PersonRequestRepository personRequestRepository;

  public PersonRequestService(
      JiraClient jiraClient,
      JiraRequestProperties properties,
      CompanyRepository companyRepository,
      PersonRequestRepository personRequestRepository) {
    this.client = jiraClient;
    this.properties = properties;
    this.companyRepository = companyRepository;
    this.personRequestRepository = personRequestRepository;
  }

  public Mono<PersonRequest> requestPerson(PersonRequestCommand command) {

    var roles = command.getRoles();
    var companies =
        lookupCompanies(
            command.getCompanies().stream().map(CompanyRef::of).collect(Collectors.toSet()));

    String summary = "User Request: " + command.getEmail();
    String description =
        String.format(
            """
                        Email: %s
                        First name: %s
                        Last name: %s
                        Roles: %s
                        Companies: %s""",
            command.getEmail(),
            command.getGivenName(),
            command.getFamilyName(),
            String.join(", ", command.getRoles().stream().map(RoleAuthority::name).toList()),
            String.join(", ", command.getCompanies()));
    var user = properties.getUser();
    var request =
        CreateIssueRequest.builder()
            .summary(summary)
            .description(description)
            .project(user.getProject())
            .issuetype(user.getIssue().getType())
            .build();

    return client
        .createIssue(request)
        .flatMap(
            (createdIssue) -> {
              var personRequest =
                  PersonRequest.builder()
                      .setEmail(command.getEmail())
                      .setFamilyName(command.getFamilyName())
                      .setGivenName(command.getGivenName())
                      .setJiraIssueId(createdIssue.getKey())
                      .setStatus(RequestStatus.PENDING)
                      .setCompanies(companies)
                      .setRole(roles.get(0))
                      .build();
              return Mono.just(personRequestRepository.save(personRequest));
            });
  }

  public Page<PersonRequest> findAll(Pageable pageable) {
    return personRequestRepository.findAll(pageable);
  }

  private Set<Company> lookupCompanies(Set<CompanyRef> apiIds) {
    var existingCompanies = companyRepository.findAllByApiIdIn(apiIds);
    var existingIds = existingCompanies.stream().map(Company::getApiId).collect(Collectors.toSet());

    var unknownCompanies = Sets.difference(apiIds, existingIds);
    if (!unknownCompanies.isEmpty()) {
      throw new InvalidFieldException(
          FieldErrorDetails.builder()
              .type(FieldErrorType.EXISTS)
              .name("roles")
              .rejectedValue(
                  unknownCompanies.stream().map(CompanyRef::value).collect(Collectors.joining(",")))
              .build());
    }
    return existingCompanies;
  }
}
