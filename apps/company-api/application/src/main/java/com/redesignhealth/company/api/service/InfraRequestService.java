package com.redesignhealth.company.api.service;

import static com.redesignhealth.company.api.entity.FormDefinition.Type.*;
import static com.redesignhealth.company.api.property.JiraRequestProperties.Issue.EPIC_NAME_FIELD;
import static com.redesignhealth.company.api.property.JiraRequestProperties.Issue.REQUESTED_RESOURCE_TYPE_FIELD;

import com.google.common.collect.Sets;
import com.networknt.schema.ValidationMessage;
import com.redesignhealth.company.api.client.jira.CreateIssueRequest;
import com.redesignhealth.company.api.client.jira.FileAwareByteArrayResource;
import com.redesignhealth.company.api.client.jira.JiraClient;
import com.redesignhealth.company.api.entity.FormDefinition.Type;
import com.redesignhealth.company.api.entity.ref.CompanyRef;
import com.redesignhealth.company.api.entity.request.InfrastructureRequest;
import com.redesignhealth.company.api.entity.request.PublicationStatus;
import com.redesignhealth.company.api.entity.request.RequestForm;
import com.redesignhealth.company.api.entity.request.RequestStatus;
import com.redesignhealth.company.api.exception.*;
import com.redesignhealth.company.api.expansion.Expansion;
import com.redesignhealth.company.api.property.JiraRequestProperties;
import com.redesignhealth.company.api.repository.CompanyRepository;
import com.redesignhealth.company.api.repository.FormDefinitionRepository;
import com.redesignhealth.company.api.repository.InfraRequestRepository;
import com.redesignhealth.company.api.repository.RequestFormRepository;
import com.redesignhealth.company.api.template.TemplateGenerator;
import com.redesignhealth.company.api.template.data.FormAnswer;
import com.redesignhealth.company.api.template.data.TechStackOption;
import com.redesignhealth.company.api.client.jira.IssueCreated;
import com.redesignhealth.company.api.util.JsonSchemaUtils;
import java.util.*;
import java.util.regex.Pattern;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
public class InfraRequestService {
  public static final Logger logger = LoggerFactory.getLogger(InfraRequestService.class);
  private final InfraRequestRepository repository;
  private final RequestFormRepository requestFormRepository;
  private final CompanyRepository companyRepository;
  private final FormDefinitionRepository formDefinitionRepository;
  private final JiraClient client;
  private final JiraRequestProperties properties;

  private final String portalInfrastructureRoute;

  private final int createSubIssuesRateLimit;

  public InfraRequestService(
      InfraRequestRepository repository,
      RequestFormRepository requestFormRepository,
      CompanyRepository companyRepository,
      JiraClient client,
      JiraRequestProperties properties,
      TemplateGenerator templateGenerator,
      @Value("${notification.portal.routes.infrastructure}") String portalInfrastructureRoute,
      @Value("${rate-limit.infra-request.create-sub-issues}") int createSubIssuesRateLimit,
      FormDefinitionRepository formDefinitionRepository) {
    this.repository = repository;
    this.requestFormRepository = requestFormRepository;
    this.companyRepository = companyRepository;
    this.client = client;
    this.properties = properties;
    this.templateGenerator = templateGenerator;
    this.portalInfrastructureRoute = portalInfrastructureRoute;
    this.formDefinitionRepository = formDefinitionRepository;
    this.createSubIssuesRateLimit = createSubIssuesRateLimit;
  }

  private final TemplateGenerator templateGenerator;

  private static final Set<Type> REQUIRED_FORMS = Set.of(TECH_STACK, PRIVACY_QUESTIONNAIRE);

  public InfrastructureRequest findByApiId(CompanyRef apiId, List<Expansion> expansions) {
    return repository
        .findByCompanyApiId(apiId, expansions.toArray(new Expansion[0]))
        .orElseThrow(InfraRequestNotFoundException::new);
  }

  public InfrastructureRequest save(InfrastructureRequest infraRequest) {
    return repository.save(infraRequest);
  }

  public InfrastructureRequest getOrCreate(CompanyRef apiId) {
    return repository
        .findByCompanyApiId(apiId)
        .orElseGet(
            () -> {
              var company =
                  companyRepository
                      .findByApiId(apiId)
                      .orElseThrow(() -> new UnknownCompanyException(apiId));
              return repository.save(InfrastructureRequest.builder(company).build());
            });
  }

  public RequestForm getOrCreateForm(InfrastructureRequest infraRequest, Type type) {
    return requestFormRepository
        .findByInfrastructureRequestAndType(infraRequest, type)
        .orElseGet(
            () -> requestFormRepository.save(RequestForm.builder(infraRequest, type).build()));
  }

  public RequestForm save(RequestForm requestForm) {
    var formDefinition =
        formDefinitionRepository
            .findByType(requestForm.getType())
            .orElseThrow(() -> new UnknownFormDefinitionException(requestForm.getType()));
    var schema = JsonSchemaUtils.getSchema(formDefinition.getSchema());
    Set<ValidationMessage> errors = schema.validate(requestForm.getForm());
    if (!errors.isEmpty()) {
      throw new InvalidFieldException(JsonSchemaUtils.convertErrors(errors, "form"));
    }
    return requestFormRepository.save(requestForm);
  }

  public Mono<InfrastructureRequest> submitRequest(CompanyRef apiId) {
    var infraRequest = findByApiId(apiId, List.of(Expansion.FORMS));

    validate(infraRequest);

    var techStackOptions = parseTechStackForm(infraRequest.getForm(TECH_STACK).get());
    var privacyQuestionnaireAnswers =
        parsePrivacyQuestionnaire(infraRequest.getForm(PRIVACY_QUESTIONNAIRE).get());

    var files =
        List.of(
            generateTechStackAttachment(techStackOptions),
            generatePrivacyAttachment(privacyQuestionnaireAnswers));

    Mono<IssueCreated> parent = createParentIssue(infraRequest);

    // TODO Jira issue clean up in case any of this fails
    return parent
        .flatMap(
            (parentIssue) ->
                client.attachFilesToIssue(parentIssue.getKey(), files).thenReturn(parentIssue))
        .flatMap(
            (parentIssue) ->
                Mono.when(createSubIssues(parentIssue.getKey(), techStackOptions))
                    .thenReturn(parentIssue))
        .map(
            (parentIssue) -> {
              infraRequest.setStatus(RequestStatus.PENDING);
              infraRequest.setJiraIssueId(parentIssue.getKey());
              return repository.save(infraRequest);
            });
  }

  private Mono<IssueCreated> createParentIssue(InfrastructureRequest infraRequest) {
    String title =
        String.format("Infrastructure requested for %s", infraRequest.getCompany().getName());

    String portalUrl =
        portalInfrastructureRoute.replace(
            "{companyId}", infraRequest.getCompany().getApiId().value());
    String description = "View in UI: " + portalUrl;

    var parentIssueConfig = properties.getInfrastructure().getParentIssue();

    var epicName = parentIssueConfig.getFieldId(EPIC_NAME_FIELD);

    var additionalFields = new HashMap<String, String>();
    if (epicName != null) {
      additionalFields.put(epicName, infraRequest.getCompany().getName());
    }
    return client.createIssue(
        CreateIssueRequest.builder()
            .summary(title)
            .description(description)
            .project(properties.getInfrastructure().getProject())
            .issuetype(parentIssueConfig.getType())
            .additionalFields(additionalFields)
            .labels(List.of(infraRequest.getCompany().getName()))
            .build());
  }

  private Flux<IssueCreated> createSubIssues(
      String parentKey, List<TechStackOption> techStackOptions) {
    var requests = techStackOptions.stream().map((o) -> createSubIssueRequest(parentKey, o));
    return Flux.fromStream(requests).flatMap(client::createIssue, createSubIssuesRateLimit);
  }

  private CreateIssueRequest createSubIssueRequest(String parentKey, TechStackOption option) {
    if (option.getType() == null || option.getName() == null) {
      logger.warn("Tech Stack Option is missing info: {}", option);
    }

    var summary = String.format("%s - %s", option.getType(), option.getName());
    var childIssueConfig = properties.getInfrastructure().getChildIssue();

    Map<String, String> additionalFields = new HashMap<>();
    var requestedResourceType = childIssueConfig.getFieldId(REQUESTED_RESOURCE_TYPE_FIELD);
    if (requestedResourceType != null) {
      additionalFields.put(requestedResourceType, option.getName());
    }

    return CreateIssueRequest.builder()
        .parentIssue(parentKey)
        .summary(summary)
        .description(option.getComment())
        .project(properties.getInfrastructure().getProject())
        .issuetype(childIssueConfig.getType())
        .additionalFields(additionalFields)
        .build();
  }

  private void validate(InfrastructureRequest infraRequest) {
    if (infraRequest.getStatus() != RequestStatus.AWAITING_SUBMISSION) {
      throw new InfraRequestAlreadySubmittedException();
    }

    var forms = infraRequest.getForms();

    if (null == forms) {
      throw new RequiredFormsMissingException(REQUIRED_FORMS);
    }

    var completedForms =
        forms.stream()
            .filter((f) -> f.getStatus() == PublicationStatus.COMPLETED)
            .map(RequestForm::getType)
            .collect(Collectors.toSet());

    var missingCompletedForms = Sets.difference(REQUIRED_FORMS, completedForms);
    if (!missingCompletedForms.isEmpty()) {
      throw new RequiredFormsMissingException(missingCompletedForms);
    }
  }

  private FileAwareByteArrayResource generateTechStackAttachment(
      List<TechStackOption> techStackOptions) {
    var attachment = templateGenerator.createTechStackAttachment(techStackOptions);
    return new FileAwareByteArrayResource("tech-stack.md", attachment.getBytes());
  }

  // TODO: Work with frontend on improving the structure
  // Current format is
  // { "Type-Name": "Yes/No", "Type-Name-comment" : "Comment text" }
  private List<TechStackOption> parseTechStackForm(RequestForm form) {
    var fields = form.getForm().fields();
    List<TechStackOption> options = new ArrayList<>();
    while (fields.hasNext()) {
      var techStackOption = TechStackOption.builder();
      var field = fields.next();
      String[] parts = field.getKey().split("-");
      techStackOption.type(parts[0]).name(parts[1]).optIn(field.getValue().asText().equals("Yes"));
      if (fields.hasNext()) {
        var commentField = fields.next();
        if (StringUtils.hasText(commentField.getValue().asText())) {
          techStackOption.comment(commentField.getValue().asText());
        }
      } else {
        logger.warn("Expected comment in Tech Stack form");
      }
      options.add(techStackOption.build());
    }
    return options;
  }

  private FileAwareByteArrayResource generatePrivacyAttachment(List<FormAnswer> answers) {
    var attachment = templateGenerator.createPrivacyAttachment(answers);
    return new FileAwareByteArrayResource("privacy-questionnaire.md", attachment.getBytes());
  }

  // TODO: Work with frontend on improving the structure
  // Current format is
  // { "q#-[a-z]#?": "Yes/No", "q#-[a-z]-comment" : "Comment text" }
  private List<FormAnswer> parsePrivacyQuestionnaire(RequestForm form) {
    List<FormAnswer> answers = new ArrayList<>();
    var fields = form.getForm().fields();
    FormAnswer prevAnswer = new FormAnswer("SEED");
    while (fields.hasNext()) {
      var field = fields.next();
      var pattern = Pattern.compile("(?<question>q\\d-[a-z])\\d?(?<comment>-comment)?");
      var matcher = pattern.matcher(field.getKey());

      if (matcher.find()) {
        var question = matcher.group("question");
        var comment = matcher.group("comment");
        var currentAnswer = new FormAnswer(question);
        if (currentAnswer.getQuestion().equals(prevAnswer.getQuestion())) {
          currentAnswer = prevAnswer;
        } else {
          answers.add(currentAnswer);
        }
        if (comment != null) {
          currentAnswer.setComment(field.getValue().asText());
        } else {
          var answer = field.getValue().asText();
          if (currentAnswer.getAnswer() != null) {
            // handle saving multiple answers
            currentAnswer.setAnswer(currentAnswer.getAnswer() + ", " + answer);
          } else {
            currentAnswer.setAnswer(field.getValue().asText());
          }
        }
        prevAnswer = currentAnswer;
      } else {
        logger.error("Unable to parse privacy questionnaire key {}", field.getKey());
      }
    }
    return answers;
  }
}
