const now = Date.now()
const now2 = now + 2

export const PERSON_COMMAND1: PersonCommand = {
  email: `seed1_${now}@redesignhealth.com`,
  familyName: `SeedFamilyName_${now}`,
  givenName: `SeedGivenName_${now}`
}
export const PERSON_COMMAND2: PersonCommand = {
  email: `seed2_${now}@redesignhealth.com`,
  familyName: `SeedFamilyName_${now}`,
  givenName: `SeedGivenName_${now}`
}

export const COMPANY_COMMAND1: CompanyCommand = {
  name: `Test: add member to company1 ${now}`,
  number: now,
  legalName: `Seed Company Legal Name ${now}`,
  description: `Seed Company Desc ${now}`
}

export const COMPANY_COMMAND2: CompanyCommand = {
  name: `Test: add member to company2 ${now2}`,
  number: now2,
  legalName: `Seed Company Legal Name ${now2}`,
  description: `Seed Company Desc ${now2}`
}
