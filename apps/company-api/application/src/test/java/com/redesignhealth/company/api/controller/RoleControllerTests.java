package com.redesignhealth.company.api.controller;

import static org.hamcrest.Matchers.is;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.redesignhealth.company.api.entity.request.RoleAuthority;
import com.redesignhealth.company.api.scaffolding.CommonTestConfig;
import com.redesignhealth.company.api.scaffolding.WithRedesignUser;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(RoleController.class)
@Import({CommonTestConfig.class})
public class RoleControllerTests {
  @Autowired private MockMvc mockMvc;

  @Test
  public void test401() throws Exception {
    mockMvc.perform(get("/role")).andExpect(status().isUnauthorized());
  }

  @Test
  @WithRedesignUser(role = RoleAuthority.ROLE_SUPER_ADMIN)
  public void testList_returnsAll() throws Exception {
    mockMvc
        .perform(get("/role"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.content[0].authority", is("ROLE_SUPER_ADMIN")))
        .andExpect(jsonPath("$.content[1].authority", is("ROLE_RH_ADMIN")))
        .andExpect(jsonPath("$.content[2].authority", is("ROLE_RH_USER")))
        .andExpect(jsonPath("$.content[3].authority", is("ROLE_OP_CO_USER")))
        .andExpect(jsonPath("$.content[4].authority", is("ROLE_OP_CO_CONTRACTOR")));
  }

  @Test
  @WithRedesignUser(role = RoleAuthority.ROLE_SUPER_ADMIN)
  public void testMeRoles_returnsAllForSuperMinusContractor() throws Exception {
    mockMvc
        .perform(get("/me/role"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.content[0].authority", is("ROLE_SUPER_ADMIN")))
        .andExpect(jsonPath("$.content[1].authority", is("ROLE_RH_ADMIN")))
        .andExpect(jsonPath("$.content[2].authority", is("ROLE_RH_USER")))
        .andExpect(jsonPath("$.content[3].authority", is("ROLE_OP_CO_USER")));
  }

  @Test
  @WithRedesignUser(role = RoleAuthority.ROLE_RH_ADMIN)
  public void testMeRoles_returnsSomeForAdmin() throws Exception {
    mockMvc
        .perform(get("/me/role"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.content[0].authority", is("ROLE_RH_ADMIN")))
        .andExpect(jsonPath("$.content[1].authority", is("ROLE_RH_USER")))
        .andExpect(jsonPath("$.content[2].authority", is("ROLE_OP_CO_USER")));
  }
}
