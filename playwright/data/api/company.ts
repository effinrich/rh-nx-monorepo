export function expectedResponseGetCompany(
  id: string,
  name: string,
  number: number,
  desc: string,
  legalName: string,
  baseURL?: string
): Partial<CompanySummary> {
  return {
    id,
    name,
    number,
    description: desc,
    legalName,
    links: [
      {
        rel: 'self',
        href: `${baseURL}/company/${id}`
      },
      {
        rel: 'members',
        href: `${baseURL}/company/${id}/members`
      },
      {
        rel: 'companies',
        href: `${baseURL}/company`
      }
    ]
  }
}

export function expectedResponsePutCompany(
  id: string,
  timestamp: number,
  baseURL?: string
) {
  return {
    id,
    name: `New Name ${timestamp}`,
    number: timestamp,
    description: `New Desc ${timestamp}`,
    legalName: `New Legal Name ${timestamp}`,
    links: [
      {
        rel: 'self',
        href: `${baseURL}/company/${id}`
      },
      {
        rel: 'members',
        href: `${baseURL}/company/${id}/members`
      }
    ]
  }
}

export function expectedResponsePostCompany(
  id: string,
  timestamp: number,
  baseURL?: string
): Partial<CompanySummary> {
  return {
    name: `Test Company ${timestamp}`,
    number: timestamp,
    description: `Test Company ${timestamp}`,
    legalName: `Test Company Legal Name ${timestamp}`,
    members: [],
    links: [
      {
        rel: 'self',
        href: `${baseURL}/company/${id}`
      },
      {
        rel: 'members',
        href: `${baseURL}/company/${id}/members`
      }
    ]
  }
}

export function expectedResponseGetCompanyMember({
  email,
  givenName,
  familyName,
  baseURL
}): Partial<PersonSummary> {
  return {
    email,
    givenName,
    familyName,
    links: [
      {
        rel: 'self',
        href: `${baseURL}/person/${email}`
      }
    ]
  }
}

export function expectedResponsePutCompanyMember(id: string, baseURL?: string) {
  return {
    links: [
      {
        href: `${baseURL}/company/${id}/members`,
        rel: 'members'
      },
      {
        href: `${baseURL}/company/${id}`,
        rel: 'company'
      }
    ]
  }
}
