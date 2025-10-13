import qs from 'qs'

import { axiosApi } from '../axios-api'
import { PagedResult, PersonSummary, Roles, UserInfoSummary } from '../types'

export interface NewUserProps {
  givenName?: string
  familyName?: string
  email?: string
  memberOf?: string[]
  role?: string
}

export const putCompanyMember = async (
  email: NewUserProps['email'],
  companyId: string | undefined
) => {
  const { data } = await axiosApi.put(`/company/${companyId}/member/${email}`, {
    status: 'ACTIVE'
  })
  return data
}

export const getUserInfo = async () => {
  const { data } = await axiosApi.get<UserInfoSummary>('/userinfo')
  return data
}

/**
 * This call will filter based on the role you pass in.
 * The `inclusive` parameter is meant to determine whether
 * we return only users who match the given role; if the
 * arg is false, then we return only roles that DO NOT match
 */
export const getUsersByRole = async (
  role: string,
  isInclusive: boolean,
  pageSize?: number | 20
) => {
  const { data } = await axiosApi.get<{ content: PersonSummary[] }>(
    `/person?page=0&size=${pageSize}`
  )

  if (isInclusive) {
    return data.content.filter((user) => user?.role?.authority === role)
  } else {
    return data.content.filter((user) => user?.role?.authority !== role)
  }
}

export const getUsersList = async (
  page: number,
  size: number,
  expand?: Array<'forms' | 'members' | 'memberOf'>
) => {
  const queryString = qs.stringify({
    page,
    size,
    expand
  })

  const { data } = await axiosApi.get<PagedResult<PersonSummary>>(
    `/person?${queryString}`
  )

  return data
}


export const getUser = async (email?: string, expand?: string[]) => {
  const queryParamsBuilder: [string, string][] = []
  if (expand) {
    expand.forEach(e => queryParamsBuilder.push(['expand', e]))
  }

  const queryParams = new URLSearchParams(queryParamsBuilder)
  const { data } = await axiosApi.get<PersonSummary>(
    `/person/${email}?${queryParams}`
  )

  return data
}
export const getRoles = async () => {
  const { data } = await axiosApi.get<Roles>('/me/role')

  return data
}
