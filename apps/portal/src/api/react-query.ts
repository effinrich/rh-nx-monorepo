import { createQueryKeyStore } from '@lukemorales/query-key-factory'
import { QueryClient, QueryFunction, QueryKey } from '@tanstack/react-query'

import {
  getCompanyById,
  getCompanyList,
  getCompanyMembers
} from './company/get'
import { getInfraRequest } from './infra-request/get'
import { getPerson, getPersonList } from './person/get'
import { getPersonRequest } from './person-request/get'
import { getRoles } from './role/get'
import { getUserInfo } from './user-info/get'

const queryClientHolder = {
  queryClient: new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false, // default: true
        staleTime: 1000 * 10
      }
    }
  })
}

/**
 * This should be the only place to get a QueryClient instance in the whole portal!!!
 */
export const directQueryClient = () => queryClientHolder.queryClient

/**
 * @deprecated
 */
export const queries = createQueryKeyStore({
  role: {
    roles: {
      queryKey: null,
      queryFn: getRoles
    }
  },
  'user-info': {
    'user-info': {
      queryKey: null,
      queryFn: getUserInfo
    }
  },
  person: {
    person: (...args: Parameters<typeof getPerson>) => ({
      queryKey: [{ ...args }],
      queryFn: () => getPerson(...args)
    }),
    'person-list': (...args: Parameters<typeof getPersonList>) => ({
      queryKey: [{ ...args }],
      queryFn: () => getPersonList(...args)
    })
  },
  company: {
    company: (...args: Parameters<typeof getCompanyById>) => ({
      queryKey: [{ ...args }],
      queryFn: () => getCompanyById(...args)
    }),
    'company-list': (...args: Parameters<typeof getCompanyList>) => ({
      queryKey: [{ ...args }],
      queryFn: () => getCompanyList(...args)
    }),
    'company-members': (...args: Parameters<typeof getCompanyMembers>) => ({
      queryKey: [{ ...args }],
      queryFn: () => getCompanyMembers(...args)
    })
  },
  'infra-request': {
    'infra-request': (...args: Parameters<typeof getInfraRequest>) => ({
      queryKey: [{ ...args }],
      queryFn: () => getInfraRequest(...args)
    })
  },
  'person-request': {
    'person-request': (...args: Parameters<typeof getPersonRequest>) => ({
      queryKey: [{ ...args }],
      queryFn: () => getPersonRequest(...args)
    })
  }
})

/**
 * @deprecated
 */
export const getQueryData = async <TQueryKey extends QueryKey, TData = unknown>(
  queryClient: QueryClient,
  query: {
    queryKey: TQueryKey
    queryFn: QueryFunction<TData, TQueryKey>
  }
): Promise<TData> => {
  return (queryClient.getQueryData<TData>(query.queryKey) ??
    queryClient.fetchQuery({
      queryKey: query.queryKey,
      queryFn: query.queryFn
    })) as Promise<TData>
}
