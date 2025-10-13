package com.redesignhealth.company.api.controller;

import static org.hamcrest.Matchers.is;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.redesignhealth.company.api.entity.Person;
import com.redesignhealth.company.api.entity.ref.PersonRef;
import com.redesignhealth.company.api.entity.request.RoleAuthority;
import com.redesignhealth.company.api.repository.PersonRepository;
import com.redesignhealth.company.api.scaffolding.CommonTestConfig;
import com.redesignhealth.company.api.scaffolding.WithRedesignUser;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(UserInfoController.class)
@Import({CommonTestConfig.class})
public class UserInfoControllerTests {
  @Autowired private MockMvc mockMvc;

  @MockBean private PersonRepository personRepository;

  @Test
  public void test401() throws Exception {
    mockMvc.perform(get("/userInfo")).andExpect(status().isUnauthorized());
  }

  @Test
  @WithRedesignUser(
      email = "test@redesignhealth.com",
      role = RoleAuthority.ROLE_RH_ADMIN,
      picture = "https://example.com/picture.jpg")
  public void testUserInfo() throws Exception {
    PersonRef ref = PersonRef.of("test@redesignhealth.com");
    Person person = Person.from(ref);
    person.setGivenName("Brett");
    person.setFamilyName("Shaheen");
    person.setRole(RoleAuthority.ROLE_RH_ADMIN);

    when(personRepository.findByEmail(ref)).thenReturn(Optional.of(person));

    mockMvc
        .perform(get("/userinfo"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.email", is("test@redesignhealth.com")))
        .andExpect(jsonPath("$.picture", is("https://example.com/picture.jpg")))
        .andExpect(jsonPath("$.roles[0].authority", is("ROLE_RH_ADMIN")))
        .andExpect(jsonPath("$.roles[0].displayName", is("Admin")));
  }
}
