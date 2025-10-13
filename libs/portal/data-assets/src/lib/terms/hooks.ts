import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { UserInfoSummary } from '../types'
import { useGetUserInfo } from '../users'

import { getMeConsent, putMeConsent } from './api'
import { config } from './data'
import { ConsentSummary, ConsentType } from './types'

const CONSENT_QUERY_KEY = 'consent'

export const useGetMeConsent = () => {
  const { data: currentUser } = useGetUserInfo()
  const consentType = inferConsentType(currentUser)
  return useQuery({
    queryKey: [CONSENT_QUERY_KEY, consentType],
    queryFn: () => getMeConsent(consentType),
    enabled: consentType !== 'UNKNOWN'
  })
}

export const useHasUserConsented = () => {
  const { data: consent, isFetched } = useGetMeConsent()
  return { data: hasUserConsented(consent), isFetched }
}

export const useAcceptConsent = () => {
  const { data: currentUser } = useGetUserInfo()
  const consentType = inferConsentType(currentUser)
  const consentConfig = config[consentType]
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => putMeConsent(consentType, consentConfig?.etag),
    onSuccess: () =>
      queryClient.setQueryData([CONSENT_QUERY_KEY, consentType], true)
  })
}

export const useGetTermsHtml = () => {
  const { data: currentUser } = useGetUserInfo()
  const consentType = inferConsentType(currentUser)
  return config[consentType].html
}

export const inferConsentType = (
  currentUser?: UserInfoSummary
): ConsentType => {
  if (!currentUser) return 'UNKNOWN'

  if (currentUser.memberOf) {
    for (const company of currentUser.memberOf) {
      if (company.activityType?.value === 'ENTERPRISE_BUYER') {
        return 'BUYER_TERMS_OF_SERVICE'
      }
      if (company.activityType?.value === 'ENTERPRISE_SELLER') {
        return 'SELLER_TERMS_OF_SERVICE'
      }
    }
  }

  return 'TERMS_OF_SERVICE'
}

export const hasUserConsented = (consent?: ConsentSummary | null) => {
  const consentType = consent?.type.value
  if (consentType) {
    const { etag } = config[consentType]
    return consent.version === etag
  }
  return false
}
