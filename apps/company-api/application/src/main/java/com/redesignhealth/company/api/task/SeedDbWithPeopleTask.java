package com.redesignhealth.company.api.task;

import com.redesignhealth.company.api.entity.Person;
import com.redesignhealth.company.api.entity.request.RoleAuthority;
import com.redesignhealth.company.api.repository.PersonRepository;
import com.redesignhealth.company.api.repository.TaskRepository;
import java.util.List;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

/**
 * This task initializes the database with a set of people with access. This helps avoid the
 * chicken/egg problem of how to gain access to the system when no one has access.
 */
@Component
public class SeedDbWithPeopleTask extends TaskDefinition implements CommandLineRunner {

  private final PersonRepository personRepository;
  private final List<String> emailsToAdd;

  public SeedDbWithPeopleTask(
      TaskRepository taskRepository,
      PersonRepository personRepository,
      @Value("${db.seed.emails}") List<String> emailsToAdd) {
    super(taskRepository);
    this.personRepository = personRepository;
    this.emailsToAdd = emailsToAdd;
  }

  @Override
  public void run(String... args) {
    runTask(shouldRunTask());
  }

  @Override
  public void runTaskInternal() {
    var people = emailsToAdd.stream().map(Person::from).toList();
    for (var person : people) {
      if (!personRepository.existsByEmail(person.getEmail())) {
        person.setRole(RoleAuthority.ROLE_SUPER_ADMIN);
        personRepository.save(person);
      }
    }
  }
}
