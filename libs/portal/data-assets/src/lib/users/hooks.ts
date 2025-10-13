import { keepPreviousData, useQuery } from '@tanstack/react-query'

import { PersonSummary } from '../types'

import {
  getRoles,
  getUser,
  getUserInfo,
  getUsersByRole,
  getUsersList
} from './api'

export const useGetUserInfo = () => {
  return useQuery({
    queryKey: ['user-info'],
    queryFn: () => getUserInfo()
  })
}

const sortPeople = (a: PersonSummary, b: PersonSummary) => {
  const givenNameCompare = (a.givenName || '').localeCompare(b.givenName || '')
  const familyNameCompare = (a.familyName || '').localeCompare(
    b.familyName || ''
  )

  return givenNameCompare || familyNameCompare
}

export const useGetUsersByRole = (
  role: string,
  isInclusive: boolean,
  pageSize?: number
) =>
  useQuery({
    queryKey: ['person', role, isInclusive, pageSize],
    queryFn: () => getUsersByRole(role, isInclusive, pageSize),
    select: people => people.sort(sortPeople)
  })

export const useGetUsersList = (
  page: number,
  size: number,
  expand?: Array<'forms' | 'members' | 'memberOf'>
) => {
  return useQuery({
    queryKey: ['person', page, size, expand],
    queryFn: () => getUsersList(page, size, expand),
    select: people => ({
      ...people,
      content: people.content.sort(sortPeople)
    }),
    placeholderData: keepPreviousData
  })
}

export const useGetUser = (email?: string, expand?: Array<'memberOf'>) =>
  useQuery({
    queryKey: ['person', email, expand],
    queryFn: () => getUser(email, expand),
    enabled: !!email
  })

export const useGetRoles = () =>
  useQuery({
    queryKey: ['roles'],
    queryFn: () => getRoles()
  })
