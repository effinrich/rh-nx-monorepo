package com.redesignhealth.company.api.service;

import static com.redesignhealth.company.api.dto.command.CompanyCommand.TAXONOMY_FIELD;
import static com.redesignhealth.company.api.taxonomy.TaxonomyTerm.LEAF_NODE_LEVEL;

import com.redesignhealth.company.api.client.file.GoogleDriveClient;
import com.redesignhealth.company.api.dto.CompanyDto;
import com.redesignhealth.company.api.dto.CompanyMemberDto;
import com.redesignhealth.company.api.dto.command.CompanyCommand;
import com.redesignhealth.company.api.dto.command.CompanyConflictsCommand;
import com.redesignhealth.company.api.dto.command.CompanyMemberCommand;
import com.redesignhealth.company.api.dto.enums.CompanyFundraiseStatus;
import com.redesignhealth.company.api.dto.enums.CompanyIPMarketplaceType;
import com.redesignhealth.company.api.dto.enums.CompanyMemberAuditOperation;
import com.redesignhealth.company.api.dto.enums.CompanyMemberStatus;
import com.redesignhealth.company.api.dto.enums.CompanyStage;
import com.redesignhealth.company.api.dto.enums.CompanyStatus;
import com.redesignhealth.company.api.entity.Company;
import com.redesignhealth.company.api.entity.CompanyConflict;
import com.redesignhealth.company.api.entity.CompanyIpMarketplace;
import com.redesignhealth.company.api.entity.CompanyMember;
import com.redesignhealth.company.api.entity.CompanyMemberAudit;
import com.redesignhealth.company.api.entity.Person;
import com.redesignhealth.company.api.entity.id.ApiIdGenerator;
import com.redesignhealth.company.api.entity.ref.CompanyRef;
import com.redesignhealth.company.api.entity.ref.PersonRef;
import com.redesignhealth.company.api.entity.ref.TaxonomyRef;
import com.redesignhealth.company.api.entity.request.RoleAuthority;
import com.redesignhealth.company.api.exception.CompanyMemberNotFoundException;
import com.redesignhealth.company.api.exception.CompanyNotFoundException;
import com.redesignhealth.company.api.exception.ForbiddenAddConflictsException;
import com.redesignhealth.company.api.exception.ForbiddenAddMemberException;
import com.redesignhealth.company.api.exception.ForbiddenDeleteCompanyException;
import com.redesignhealth.company.api.exception.GoogleDriveException;
import com.redesignhealth.company.api.exception.InvalidFieldException;
import com.redesignhealth.company.api.exception.LinkedCompanyException;
import com.redesignhealth.company.api.exception.PersonNotFoundException;
import com.redesignhealth.company.api.exception.StageConflictException;
import com.redesignhealth.company.api.exception.dto.FieldErrorDetails;
import com.redesignhealth.company.api.exception.dto.FieldErrorType;
import com.redesignhealth.company.api.exception.status.NotFoundException;
import com.redesignhealth.company.api.expansion.Expansion;
import com.redesignhealth.company.api.repository.CompanyConflictRepository;
import com.redesignhealth.company.api.repository.CompanyMemberAuditRepository;
import com.redesignhealth.company.api.repository.CompanyRepository;
import com.redesignhealth.company.api.repository.IpMarketplaceTrackRepository;
import com.redesignhealth.company.api.repository.PersonRepository;
import com.redesignhealth.company.api.security.AuthChecks;
import com.redesignhealth.company.api.service.helper.BuilderForException;
import com.redesignhealth.company.api.taxonomy.CompanyTaxonomy;
import jakarta.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import org.hibernate.Hibernate;
import org.hibernate.exception.ConstraintViolationException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

@Service
public class CompanyService {

  private static final Logger logger = LoggerFactory.getLogger(CompanyService.class);
  private final CompanyRepository companyRepository;
  private final PersonRepository personRepository;
  private final CompanyMemberAuditRepository companyMemberAuditRepository;
  private final GoogleDriveClient googleDriveClient;
  private final String companySharedDriveId;
  private final String onboardTemplateFileId;
  private final CompanyConflictRepository companyConflictRepository;
  private final CompanyTaxonomy companyTaxonomy;
  private final IpMarketplaceTrackRepository ipMarketplaceTrackRepository;

  public CompanyService(
      CompanyRepository companyRepository,
      PersonRepository personRepository,
      GoogleDriveClient googleDriveClient,
      @Value("${google.drive.companySharedDrive}") String companySharedDriveId,
      @Value("${google.drive.onboardTemplate}") String onboardTemplateFileId,
      CompanyMemberAuditRepository companyMemberAuditRepository,
      CompanyConflictRepository companyConflictRepository,
      CompanyTaxonomy companyTaxonomy,
      IpMarketplaceTrackRepository ipMarketplaceTrackRepository) {
    this.companyRepository = companyRepository;
    this.personRepository = personRepository;
    this.googleDriveClient = googleDriveClient;
    this.companySharedDriveId = companySharedDriveId;
    this.onboardTemplateFileId = onboardTemplateFileId;
    this.companyMemberAuditRepository = companyMemberAuditRepository;
    this.companyConflictRepository = companyConflictRepository;
    this.companyTaxonomy = companyTaxonomy;
    this.ipMarketplaceTrackRepository = ipMarketplaceTrackRepository;
  }

  public Page<CompanyDto> getList(Pageable pageable, List<Expansion> expansions) {
    var expansion = (expansions.size() == 1) ? expansions.get(0) : null;
    var auth = SecurityContextHolder.getContext().getAuthentication();
    UserDetails user = (UserDetails) auth.getPrincipal();
    var companies =
        (AuthChecks.hasRoleOrHigher(auth, RoleAuthority.ROLE_RH_USER))
            ? companyRepository.findAll(pageable)
            : companyRepository.findAllByMembersEmail(pageable, PersonRef.of(user.getUsername()));
    List<CompanyDto> companyDtos = new ArrayList<>();
    for (Company company : companies.getContent()) {
      var companyDto = new CompanyDto();
      companyTaxonomy.setTaxonomyTerms(company);
      companyDto.setCompany(company);
      if (expansion != null && expansion.equals(Expansion.MEMBERS))
        companyDto.setCompanyMembersDto(companyRepository.getMembers(company.getApiId()));
      companyDtos.add(companyDto);
    }
    return new PageImpl<>(companyDtos);
  }

  public CompanyDto get(CompanyRef apiId, List<Expansion> expansions) {
    var companyDto = new CompanyDto();
    var company = get(apiId, expansions.toArray(new Expansion[0]));
    Hibernate.initialize(company.getCompanyIpMarketplace());
    if (company.getCompanyIpMarketplace() == null) companyTaxonomy.setTaxonomyTerms(company);
    companyDto.setCompany(company);
    if (expansions.contains(Expansion.MEMBERS))
      companyDto.setCompanyMembersDto(companyRepository.getMembers(company.getApiId()));
    return companyDto;
  }

  public List<CompanyMemberDto> getMembers(CompanyRef apiId) {
    // check if exists to handle 404
    get(apiId);
    return companyRepository.getMembers(apiId);
  }

  public Company create(CompanyCommand command) {
    if (command.isIpMarketPlace()) {
      if (command.areMissingIpMarketPlaceFields())
        BuilderForException.buildInvalidFieldException(
            "activityType",
            command.getActivityType().get().getValue(),
            "For companies IP Marketplace are required the organizationType and region");
      if (command.getStatus() != null
          && command.getStatus().isPresent()
          && command.getStatus().get().equals(CompanyStatus.PAUSED))
        BuilderForException.buildInvalidFieldException(
            "status",
            command.getStatus().get().getValue(),
            "A IP marketplace company can't be created in PAUSED status");
    }
    CompanyRef newId = null;
    while (newId == null) {
      CompanyRef potential = CompanyRef.of(ApiIdGenerator.generate());
      if (!companyRepository.existsByApiId(potential)) {
        newId = potential;
      } else {
        logger.warn("ID: \"{}\" collision detected when creating company", potential);
      }
    }

    var newCompany = Company.from(newId);
    newCompany.setStatus(command.getStatus().orElse(CompanyStatus.ACTIVE));
    if (command.isRHCompany() && shouldSetupGFolder(command)) {
      String folderId = setupCompanyOnboardDocs(command);
      newCompany.setOnboardDocsFolderId(folderId);
    }
    var company = save(newCompany, command);
    if (command.isRHCompany()) companyTaxonomy.setTaxonomyTerms(company);
    return company;
  }

  public CompanyDto update(CompanyRef apiId, CompanyCommand command) {
    Company company = get(apiId, Expansion.MEMBERS);
    Hibernate.initialize(company.getCompanyIpMarketplace());
    if (shouldChangeStage(command, company)) {
      if (company.getCompanyIpMarketplace() != null) {
        if (command.getActivityType().isEmpty() || command.areMissingIpMarketPlaceFields()) {
          List<FieldErrorDetails> errors = new ArrayList<>();
          if (command.getActivityType().isEmpty())
            errors.add(
                BuilderForException.buildError(
                    "activityType",
                    "",
                    "The company was defined as part of IP Marketplace and the field is required"));
          if (command.getRegion().isEmpty())
            errors.add(
                BuilderForException.buildError(
                    "region",
                    "",
                    "The company was defined as part of IP Marketplace and the field is required"));
          if (command.getOrganizationType().isEmpty())
            errors.add(
                BuilderForException.buildError(
                    "organizationType",
                    "",
                    "The company was defined as part of IP Marketplace and the field is required"));
          throw new InvalidFieldException(errors);
        }
        if (!company
            .getCompanyIpMarketplace()
            .getActivityType()
            .equals(command.getActivityType().get()))
          BuilderForException.buildInvalidFieldException(
              "activityType", command.getActivityType().get().getValue(), "Value can't be changed");
        if (command.getStatus().isPresent()
            && command.getStatus().get().equals(CompanyStatus.PAUSED))
          BuilderForException.buildInvalidFieldException(
              "status",
              command.getStatus().get().getValue(),
              "An ip_marketplace company can't be PAUSED only ACTIVE and ARCHIVED are valid entries");
      }
      CompanyStatus companyStatus = command.getStatus().orElse(CompanyStatus.ACTIVE);
      boolean shouldUpdateMembers = !company.getStatus().equals(companyStatus);
      company.setStatus(command.getStatus().orElse(CompanyStatus.ACTIVE));
      updateInternal(company, command, shouldUpdateMembers, company.getMembers());
      if (command.isRHCompany()) companyTaxonomy.setTaxonomyTerms(company);
      var companyDto = new CompanyDto();
      companyDto.setCompany(company);
      return companyDto;
    } else throw new StageConflictException();
  }

  public void addMember(CompanyRef apiId, PersonRef email, CompanyMemberCommand command) {
    if (command.getStatus() == null) command.setStatus(Optional.of(CompanyMemberStatus.ACTIVE));

    Company company = get(apiId, Expansion.MEMBERS);
    if (company.getCompanyIpMarketplace() == null
        && (company.getStage().equals(CompanyStage.THEME)
            || company.getStage().equals(CompanyStage.CONCEPT)))
      throw new ForbiddenAddMemberException("Stage must be OP_CO or NEW_CO to add members");

    Person person =
        personRepository
            .findByEmail(email, Expansion.MEMBER_OF)
            .orElseThrow(PersonNotFoundException::new);
    if (person.getCeo() != null
        && person.getMemberOf().stream()
                .filter(x -> x.getStatus().equals(CompanyMemberStatus.ACTIVE))
                .toList()
                .size()
            != 0) throw new ForbiddenAddMemberException("CEO only can be active in one Company");

    if (command.getStatus().isPresent()
        && command.getStatus().get().equals(CompanyMemberStatus.ACTIVE)
        && isPersonInConflictWithCompany(company, person))
      throw new ForbiddenAddMemberException(
          String.format(
              "The person %s belongs to a company in conflict with this company %s",
              person.getEmail().getEmail(), company.getName()));

    CompanyMember companyMember =
        new CompanyMember(company, person, command.getStatus().orElse(CompanyMemberStatus.ACTIVE));

    if (!company.getMembers().contains(companyMember)) {
      var companyMemberAudit = upsertMember(company.getMembers(), companyMember);

      if (company.getCompanyIpMarketplace() == null && company.getOnboardDocsFolderId() != null) {
        if (companyMember.getStatus().equals(CompanyMemberStatus.ACTIVE))
          googleDriveClient.grantEditAccess(company.getOnboardDocsFolderId(), person.getEmail());
        else googleDriveClient.revokeAccess(company.getOnboardDocsFolderId(), person.getEmail());
      }
      companyRepository.save(company);
      companyMemberAuditRepository.save(companyMemberAudit);
    }
  }

  public void upsertConflicts(CompanyRef apiId, CompanyConflictsCommand companyConflictsCommand) {
    var conflictsToProcess = companyConflictsCommand.getConflicts();
    if (conflictsToProcess == null) return;
    var company = get(apiId);
    var conflicts =
        companyConflictRepository.findByMemberOfId(company).stream()
            .map(x -> x.getCompanyConflictsId().getApiId())
            .toList();
    if (conflicts.isEmpty() && conflictsToProcess.isEmpty()) return;
    if (conflictsToProcess.isEmpty()) {
      removeConflicts(apiId, company, conflicts);
      return;
    }

    companiesHaveMemberInCommon(apiId, conflictsToProcess);
    // Calculating the difference into Conflicts sent and Conflicts existent - only persisted the
    // new ones
    var insertConflicts =
        conflictsToProcess.stream().filter(element -> !conflicts.contains(element)).toList();

    int insertFailed = 0;
    List<CompanyRef> companyRefFailures = new ArrayList<>();
    for (CompanyRef companyRef : insertConflicts) {
      if (!apiId.equals(companyRef)) {
        try {
          var companyInConflict = get(companyRef);
          var companyConflict = new CompanyConflict();
          companyConflict.setMemberOfId(company);
          companyConflict.setCompanyConflictsId(companyInConflict);
          companyConflictRepository.save(companyConflict);
        } catch (NotFoundException ex) {
          logger.info("Not existent ApiId {}", companyRef);
          ++insertFailed;
          companyRefFailures.add(companyRef);
        } catch (DataIntegrityViolationException div) {
          logger.info("Trying to create the same existent conflict: {}", div.getMessage());
          ++insertFailed;
        }
      }
    }
    if (insertFailed > 0 && insertFailed == conflictsToProcess.size()) return;
    var conflictsToProcessCleaned =
        (insertFailed > 0)
            ? conflictsToProcess.stream().filter(x -> !companyRefFailures.contains(x)).toList()
            : conflictsToProcess;
    var removeConflicts =
        conflicts.stream().filter(element -> !conflictsToProcessCleaned.contains(element)).toList();
    removeConflicts(apiId, company, removeConflicts);
  }

  public List<CompanyDto> getConflicts(CompanyRef apiId) {
    var company = get(apiId);
    List<CompanyDto> companyDtos = new ArrayList<>();
    for (CompanyConflict conflict : companyConflictRepository.findByMemberOfId(company)) {
      var companyDto = new CompanyDto();
      companyDto.setCompany(conflict.getCompanyConflictsId());
      companyTaxonomy.setTaxonomyTerms(companyDto.getCompany());
      companyDtos.add(companyDto);
    }
    for (CompanyConflict conflict : companyConflictRepository.findByCompanyConflictsId(company)) {
      var companyDto = new CompanyDto();
      companyDto.setCompany(conflict.getMemberOfId());
      companyTaxonomy.setTaxonomyTerms(companyDto.getCompany());
      companyDtos.add(companyDto);
    }
    return companyDtos;
  }

  @Transactional
  public void removeMember(CompanyRef apiId, PersonRef email) {
    Company company = get(apiId);
    Person person = personRepository.findByEmail(email).orElseThrow(PersonNotFoundException::new);
    CompanyMember companyMember = companyRepository.getMember(apiId, email);
    var companyIpMarketPlace = companyMember.getCompany().getCompanyIpMarketplace();
    deleteBuyerRequestContactInfo(companyIpMarketPlace, companyMember.getPerson());
    if (companyRepository.deleteMember(company.getId(), person.getId()) == 1) {
      if (company.getOnboardDocsFolderId() != null) {
        googleDriveClient.revokeAccess(company.getOnboardDocsFolderId(), person.getEmail());
      }
      var companyMemberAudit = new CompanyMemberAudit();
      companyMemberAudit.setMemberOfId(company.getName());
      companyMemberAudit.setMembersId(person.getEmail().getEmail());
      companyMemberAudit.setOperation(CompanyMemberAuditOperation.DELETE);
      companyMemberAudit.setStatus(companyMember.getStatus());
      companyMemberAuditRepository.save(companyMemberAudit);
    } else throw new CompanyMemberNotFoundException();
  }

  public void delete(CompanyRef apiId) {
    if (companyRepository.existsCompaniesByLinkedApiId(apiId))
      throw new ForbiddenDeleteCompanyException(
          String.format(
              "This company %s is linked to another and it can't be deleted", apiId.getApiId()));
    var company =
        companyRepository
            .findByApiId(apiId, Expansion.MEMBERS)
            .orElseThrow(CompanyNotFoundException::new);
    var folderName = company.getOnboardDocsFolderId();
    if (folderName != null)
      try {
        googleDriveClient.deleteFolder(folderName);
      } catch (GoogleDriveException gde) {
        logger.error(
            "failed to delete the Onboarding folder {} for the company {}. Error {}",
            folderName,
            company.getName(),
            gde.getMessage());
      }
    deleteInternal(company);
  }

  @Transactional
  private void deleteInternal(Company company) {
    Set<CompanyMember> members = company.getMembers();
    if (!members.isEmpty() && companyRepository.deleteMembers(company.getId()) >= 1) {
      for (CompanyMember member : members) {
        var companyMemberAudit = new CompanyMemberAudit();
        setCompanyMemberAudit(
            companyMemberAudit, member, CompanyMemberAuditOperation.DELETE_BY_COMPANY);
        companyMemberAuditRepository.save(companyMemberAudit);
      }
    }
    companyRepository.deleteConflicts(company.getId());
    companyRepository.delete(company);
  }

  @Transactional
  private void updateInternal(
      Company company,
      CompanyCommand command,
      boolean shouldUpdateMembers,
      Set<CompanyMember> members) {
    if (shouldUpdateMembers) {
      for (CompanyMember member : members) {
        var companyMemberAudit = setStatusToMember(member, company.getStatus());
        if (companyMemberAudit != null) companyMemberAuditRepository.save(companyMemberAudit);
      }
    }
    save(company, command);
  }

  private CompanyMemberAudit setStatusToMember(
      CompanyMember companyMember, CompanyStatus companyStatus) {
    if (!companyStatus.equals(CompanyStatus.ACTIVE)
        && companyMember.getStatus().equals(CompanyMemberStatus.ACTIVE)) {
      var companyMemberAudit = new CompanyMemberAudit();
      setCompanyMemberAudit(
          companyMemberAudit, companyMember, CompanyMemberAuditOperation.UPDATE_BY_COMPANY);
      companyMember.setStatus(CompanyMemberStatus.INACTIVE);
      return companyMemberAudit;
    }
    return null;
  }

  private Company get(CompanyRef apiId, Expansion... expansions) {
    return companyRepository
        .findByApiId(apiId, expansions)
        .orElseThrow(CompanyNotFoundException::new);
  }

  private String setupCompanyOnboardDocs(CompanyCommand command) {
    var folderId = googleDriveClient.createFolder(command.getName(), companySharedDriveId);
    googleDriveClient.copy(onboardTemplateFileId, folderId);
    return folderId;
  }

  private Company save(Company company, CompanyCommand command) {
    boolean isCreate = (company.getCreated() == null);
    var originalStage = company.getStage();
    if (command.isRHCompany()) {
      company.setFundraiseStatus(
          command.getFundraiseStatus().orElse(CompanyFundraiseStatus.PRE_LAUNCH_PHASE));
      command
          .getStage()
          .ifPresent(
              stage -> {
                if (!stage.equals(CompanyStage.OP_CO) && command.getFundraiseStatus().isPresent())
                  BuilderForException.buildInvalidFieldException(
                      "fundraiseStatus",
                      command.getFundraiseStatus().get().getDisplayName(),
                      "Can only be assigned to OP_CO");
                company.setStage(stage);
              });
      command
          .getLinkedApiId()
          .ifPresentOrElse(
              linkedCompany -> {
                boolean linkedApiIdIsDifferent =
                    (company.getLinkedApiId() != null
                        && !company.getLinkedApiId().equals(linkedCompany));
                checkLinkedCompany(
                    company.getStage(),
                    linkedCompany,
                    isCreate,
                    linkedApiIdIsDifferent,
                    originalStage);
                company.setLinkedApiId(linkedCompany);
              },
              () -> checkLinkedCompany(company));
      command
          .getTaxonomyId()
          .ifPresent(
              t -> {
                validateTaxonomyTerm(t);
                company.setTaxonomyId(t);
              });
    }
    command.getDashboardHref().ifPresent(company::setDashboardHref);
    company.setName(command.getName());
    company.setDescription(command.getDescription());
    company.setLegalName(command.getLegalName());
    company.setNumber(command.getNumber());
    company.setHref(command.getHref().orElse(""));
    company.setHasPlatformAgreement(command.getHasPlatformAgreement().orElse(false));
    try {
      setValuesForCompanyIpMarketplace(company, command);
      return companyRepository.save(company);
    } catch (DataIntegrityViolationException e) {
      logger.warn("Unable to save company", e);
      if (e.getCause() instanceof ConstraintViolationException) {
        BuilderForException.buildInvalidFieldException(
            "number", Objects.toString(command.getNumber()), FieldErrorType.UNIQUE);
      }
      throw e;
    }
  }

  private boolean shouldSetupGFolder(CompanyCommand command) {
    var createGFolder = command.getCreateGFolder().orElse(true);
    if (!createGFolder) return false;

    return command
        .getStage()
        .map(stage -> !(stage.equals(CompanyStage.THEME) || stage.equals(CompanyStage.CONCEPT)))
        .orElse(true);
  }

  private boolean shouldChangeStage(CompanyCommand command, Company company) {
    if (command.isIpMarketPlace()) return true;
    if (command.getStage().isPresent() && !company.getStage().equals(command.getStage().get())) {
      return switch (company.getStage()) {
        case CONCEPT, THEME, OP_CO -> false;
        case NEW_CO -> (command.getStage().get().equals(CompanyStage.OP_CO));
      };
    }
    return true;
  }

  private void checkLinkedCompany(
      CompanyStage stage,
      CompanyRef companyLinkedRef,
      boolean isCreate,
      boolean linkedApiIdIsDifferent,
      CompanyStage originalStage) {
    if (stage.equals(CompanyStage.OP_CO) && isCreate)
      throw new LinkedCompanyException("OP_CO can't have a linked company upon creation.");
    if (stage.equals(CompanyStage.THEME))
      throw new LinkedCompanyException("THEME can't have linked company");
    if (!isCreate
        && stage == CompanyStage.OP_CO
        && originalStage == CompanyStage.OP_CO
        && linkedApiIdIsDifferent)
      throw new LinkedCompanyException("Can't change linkedApiId after being promoted to OP_CO");
    var companyLinked = get(companyLinkedRef);
    if ((stage.equals(CompanyStage.CONCEPT) && !companyLinked.getStage().equals(CompanyStage.THEME))
        || ((stage.equals(CompanyStage.NEW_CO) || stage.equals(CompanyStage.OP_CO))
            && !companyLinked.getStage().equals(CompanyStage.CONCEPT)))
      throw new LinkedCompanyException(
          "Violation of the rule: CONCEPT Linked to THEME or NEW_CO Linked to CONCEPT");
  }

  private void checkLinkedCompany(Company company) {
    if (company.getStage().equals(CompanyStage.NEW_CO))
      throw new LinkedCompanyException("NEW_CO must be linked to a CONCEPT");
    if ((company.getLinkedApiId() != null && company.getStage().equals(CompanyStage.OP_CO)))
      throw new LinkedCompanyException("OP_CO migrated from NEW_CO can't lose its history");
  }

  private CompanyMemberAudit upsertMember(Set<CompanyMember> members, CompanyMember companyMember) {
    var companyMemberAudit = new CompanyMemberAudit();
    var findMember =
        members.stream()
            .filter(
                member ->
                    member.getCompany().equals(companyMember.getCompany())
                        && member.getPerson().equals(companyMember.getPerson()))
            .findFirst()
            .orElse(null);
    if (findMember != null) {
      setCompanyMemberAudit(companyMemberAudit, findMember, CompanyMemberAuditOperation.UPDATE);
      members.remove(findMember);
      members.add(companyMember);
    } else {
      setCompanyMemberAudit(companyMemberAudit, companyMember, CompanyMemberAuditOperation.INSERT);
      members.add(companyMember);
    }
    return companyMemberAudit;
  }

  private void setCompanyMemberAudit(
      CompanyMemberAudit companyMemberAudit,
      CompanyMember companyMember,
      CompanyMemberAuditOperation operation) {
    companyMemberAudit.setMemberOfId(companyMember.getCompany().getName());
    companyMemberAudit.setMembersId(companyMember.getPerson().getEmail().getEmail());
    companyMemberAudit.setStatus(companyMember.getStatus());
    companyMemberAudit.setOperation(operation);
  }

  private boolean isPersonInConflictWithCompany(Company company, Person person) {
    var companiesApiRefWhereBelongs =
        person.getMemberOf().stream()
            .filter(y -> y.getStatus().equals(CompanyMemberStatus.ACTIVE))
            .map(x -> x.getCompany().getApiId())
            .toList();
    var companiesApiRefInConflict =
        new ArrayList<>(
            companyConflictRepository.findByMemberOfId(company).stream()
                .map(y -> y.getCompanyConflictsId().getApiId())
                .toList());
    companiesApiRefInConflict.addAll(
        companyConflictRepository.findByCompanyConflictsId(company).stream()
            .map(y -> y.getMemberOfId().getApiId())
            .toList());
    return companiesApiRefWhereBelongs.stream().anyMatch(companiesApiRefInConflict::contains);
  }

  private void companiesHaveMemberInCommon(CompanyRef apiId, List<CompanyRef> conflicts) {
    List<String> emails = getEmailsFromMembers(apiId);
    for (CompanyRef companyRef : conflicts) {
      List<String> emailsConflicts = getEmailsFromMembers(companyRef);
      if (emails.stream().anyMatch(emailsConflicts::contains))
        throw new ForbiddenAddConflictsException(
            String.format(
                "Company %s and Company %s have members in common and this is not permitted to set conflicts",
                apiId, companyRef));
    }
  }

  private List<String> getEmailsFromMembers(CompanyRef apiId) {
    return companyRepository.getMembers(apiId).stream()
        .filter(x -> x.getCompanyMember().getStatus().equals(CompanyMemberStatus.ACTIVE))
        .map(x -> x.getCompanyMember().getPerson().getEmail().getEmail())
        .toList();
  }

  private void validateTaxonomyTerm(TaxonomyRef t) {
    if (!companyTaxonomy.getTerms().containsKey(t)) {
      BuilderForException.buildInvalidFieldException(
          TAXONOMY_FIELD, t.value(), FieldErrorType.EXISTS);
    }
    if (companyTaxonomy.getTerms().get(t).getLevel() < LEAF_NODE_LEVEL) {
      BuilderForException.buildInvalidFieldException(
          TAXONOMY_FIELD, t.value(), "must be a level " + LEAF_NODE_LEVEL + " taxonomy term");
    }
  }

  private void removeConflicts(
      CompanyRef apiId, Company company, List<CompanyRef> removeConflicts) {
    // Calculating the difference into Conflicts existent and Conflicts sent - be removed the not
    // sent
    for (CompanyRef companyRef : removeConflicts) {
      if (!apiId.equals(companyRef)) {
        var companyInConflict = get(companyRef);
        var companyConflict =
            companyConflictRepository.findCompanyConflictsByMemberOfIdAndCompanyConflictsId(
                company, companyInConflict);
        companyConflictRepository.delete(companyConflict);
      }
    }
  }

  private void setValuesForCompanyIpMarketplace(Company company, CompanyCommand command) {
    if (command.isIpMarketPlace()) {
      var companyIpMarketplace =
          (company.getCompanyIpMarketplace() == null)
              ? new CompanyIpMarketplace()
              : company.getCompanyIpMarketplace();
      companyIpMarketplace.setActivityType(command.getActivityType().get());
      command.getOrganizationType().ifPresent(companyIpMarketplace::setOrganizationType);
      command.getRegion().ifPresent(companyIpMarketplace::setRegion);
      companyIpMarketplace.setCompany(company);
      company.setCompanyIpMarketplace(companyIpMarketplace);
      company.setFundraiseStatus(null);
      company.setStage(null);
      company.setDashboardHref(null);
      company.setLinkedApiId(null);
      company.setNumber(null);
    }
  }

  private void deleteBuyerRequestContactInfo(
      CompanyIpMarketplace companyIpMarketplace, Person buyer) {
    if (companyIpMarketplace != null
        && companyIpMarketplace
            .getActivityType()
            .equals(CompanyIPMarketplaceType.ENTERPRISE_BUYER)) {
      var requestContactInfoList =
          ipMarketplaceTrackRepository.findByBuyerCompanyIpMarketplaceAndBuyer(
              companyIpMarketplace, buyer);
      ipMarketplaceTrackRepository.deleteAll(requestContactInfoList);
    }
  }
}
