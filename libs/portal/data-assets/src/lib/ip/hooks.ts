import {
  getCompanyMemberRole,
  sortFilterOptions
} from '@redesignhealth/portal/utils'
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient
} from '@tanstack/react-query'
import { AxiosError } from 'axios'

import { ApiError, Option, PagedResult, UserInfoSummary } from '../types'

import {
  getCustomers,
  getIPFilters,
  getIpListing,
  getIPs,
  postAddIP,
  putMeIpMarketplaceContactInfo
} from './api'
import { IpExpansion, IpMarketplaceSummary, IPSearchValues } from './types'

const IP_QUERY_KEY = 'ip-marketplace'
export const usePostIPMutation = () => {
  const queryClient = useQueryClient()

  const { mutateAsync, isError, isPending, isSuccess, error } = useMutation({
    mutationFn: (newIP: IpMarketplaceSummary) => postAddIP(newIP),
    onError: (error: AxiosError<ApiError>) => {
      return (error?.response?.status || 0) >= 500
    },
    async onSuccess(updated) {
      queryClient.removeQueries({ queryKey: ['company'] })
    }
  })

  return { mutateAsync, isError, error, isPending, isSuccess }
}

export const useGetIPsByCompany = (
  companyId: string,
  page: number,
  expand?: IpExpansion[]
) => {
  return useGetIPs(
    {
      companyIdFilter: [companyId],
      organizationTypeFilter: [],
      regionFilter: [],
      specialityFilter: [],
      organOfFocusFilter: [],
      technologyTypeFilter: []
    },
    page,
    expand
  )
}

export const useGetIPs = (
  search?: IPSearchValues,
  page?: number,
  expand?: IpExpansion[],
  isClientFilterIpListings?: boolean,
  userInfo?: UserInfoSummary,
  isMyRequests?: boolean
) => {
  const isEnterpriseSeller =
    getCompanyMemberRole(userInfo?.memberOf) === 'MARKETPLACE_SELLER'

  return useQuery({
    queryKey: [IP_QUERY_KEY, { search, page, expand }],
    queryFn: () => getIPs(search, page, expand),
    placeholderData: keepPreviousData,
    select: ips =>
      ipClientSideFilter(
        ips,
        isClientFilterIpListings,
        isMyRequests,
        isEnterpriseSeller,
        userInfo
      )
  })
}

const ipClientSideFilter = (
  ips: PagedResult<IpMarketplaceSummary>,
  isClientFilterIpListings?: boolean,
  isMyRequests?: boolean,
  isEnterpriseSeller?: boolean,
  userInfo?: UserInfoSummary
) => {
  if (isClientFilterIpListings) {
    if (!isMyRequests) {
      return isEnterpriseSeller
        ? hideOtherSellersInMyOrgIpListings(ips, userInfo?.email)
        : hideMyRequestedIpListings(ips)
    } else {
      return isEnterpriseSeller
        ? createMyRequestsSellerListings(ips, userInfo?.email)
        : showIpListingsWithRequestContactInfo(ips)
    }
  }
  return ips
}

const hideMyRequestedIpListings = (ips: PagedResult<IpMarketplaceSummary>) => {
  const filteredIpListings = ips.content?.filter(ip => {
    return !ip.requestContactInfo?.length
  })
  return {
    ...ips,
    page: {
      ...ips.page,
      totalElements: filteredIpListings.length,
      totalPages: filteredIpListings.length === 0 ? 0 : ips.page.totalPages
    },
    content: filteredIpListings
  }
}
const hideOtherSellersInMyOrgIpListings = (
  ips: PagedResult<IpMarketplaceSummary>,
  userEmail?: string
) => {
  const filteredIpListings = ips.content?.filter(ip => {
    return ip?.owner?.email === userEmail
  })
  return {
    ...ips,
    page: {
      ...ips.page,
      totalElements: filteredIpListings.length,
      totalPages: filteredIpListings.length === 0 ? 0 : ips.page.totalPages
    },
    content: filteredIpListings
  }
}

const showIpListingsWithRequestContactInfo = (
  ips: PagedResult<IpMarketplaceSummary>
) => {
  const filteredIpListings = ips.content?.filter(ip => {
    return ip.requestContactInfo?.length
  })
  return {
    ...ips,
    page: {
      ...ips.page,
      totalElements: filteredIpListings.length,
      totalPages: filteredIpListings.length === 0 ? 0 : ips.page.totalPages
    },
    content: filteredIpListings
  }
}

const createMyRequestsSellerListings = (
  ips: PagedResult<IpMarketplaceSummary>,
  userEmail?: string
) => {
  const myIpListings = hideOtherSellersInMyOrgIpListings(ips, userEmail)
  const buyerRequests = convertToBuyerRequestListings(myIpListings)
  return buyerRequests
}

const convertToBuyerRequestListings = (
  ips: PagedResult<IpMarketplaceSummary>
) => {
  const expandedIpsList: IpMarketplaceSummary[] = []
  ips.content.forEach(ip => {
    ip?.requestContactInfo?.forEach(contact => {
      expandedIpsList.push({
        ...ip,
        requestContactInfo: [contact]
      })
    })
  })

  return {
    ...ips,
    page: {
      ...ips.page,
      totalElements: expandedIpsList.length,
      totalPages: expandedIpsList.length === 0 ? 0 : ips.page.totalPages
    },
    content: expandedIpsList
  }
}

export const useGetCustomers = () =>
  useQuery({
    queryKey: ['customers', 'customer-list'],
    queryFn: () => getCustomers()
  })

export const useGetIpListing = (
  ipListingId?: string,
  expand?: IpExpansion[]
) => {
  return useQuery({
    queryKey: [IP_QUERY_KEY, ipListingId, expand],
    queryFn: () => getIpListing(ipListingId, expand),
    enabled: !!ipListingId
  })
}

export const useGetIPFilters = () => {
  return useQuery({
    queryKey: [IP_QUERY_KEY, 'filter-options'],
    queryFn: () => getIPFilters(),
    select: filterOptions =>
      filterOptions.reduce<Option[]>((filters, filter) => {
        return {
          ...filters,
          [filter.key]: sortFilterOptions(
            filter.options.map(option => ({
              value: option.keyword,
              label: option.displayName
            }))
          )
        }
      }, [])
  })
}

export const useRequestIpListingContactInfo = (
  ipListingId?: string,
  buyerEmail?: string
) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => putMeIpMarketplaceContactInfo(ipListingId, buyerEmail),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [IP_QUERY_KEY] })
  })
}
