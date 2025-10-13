export const ROLES = {
  superAdmin: {
    displayName: 'Super Admin',
    authority: 'ROLE_SUPER_ADMIN'
  },
  admin: {
    displayName: 'Admin',
    authority: 'ROLE_RH_ADMIN'
  },
  rhUser: {
    displayName: 'RH User',
    authority: 'ROLE_RH_USER'
  },
  coUser: {
    displayName: 'Company User',
    authority: 'ROLE_OP_CO_USER'
  }
}
export const PLATFORM_USERS = {
  superAdmin: {
    email: 'devops-test@redesignhealth.com',
    givenName: 'Paul',
    familyName: 'Simon',
    authority: ROLES.superAdmin.authority
  },
  admin: {
    email: 'RhDevOpsTest2@gmail.com',
    givenName: 'Rodney',
    familyName: 'Dangerisfun',
    authority: ROLES.admin.authority
  },
  rhUser: {
    email: 'RhDevOpsTest3@gmail.com',
    givenName: 'Renée-Noël',
    familyName: 'Núñez',
    authority: ROLES.rhUser.authority
  },
  coUser: {
    email: 'RhDevOpsTest4@gmail.com',
    givenName: 'Temperance',
    familyName: 'MagdalenaAndersonmacdontald-Smithjones',
    authority: ROLES.coUser.authority
  },
  // Represents a user in our system who has no role
  noRole: {
    email: 'noRole@example.com',
    givenName: 'Clarity',
    familyName: 'Lacking'
  },
  // Represents a user who does not exist in our system (Should result in 401s when attempting to access API)
  unRegistered: {
    email: 'RhDevOpsTest5@gmail.com',
    givenName: 'Moon-Unit',
    familyName: 'Zappa'
  }
}
