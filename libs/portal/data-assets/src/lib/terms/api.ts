import { AxiosError } from 'axios'

import { axiosApi } from '../axios-api'
import { ApiError } from '../types'

import { ConsentSummary, ConsentType } from './types'

export const getMeConsent = async (consentType: ConsentType) => {
  try {
    const { data } = await axiosApi.get<ConsentSummary>(
      `/me/consent/${consentType}`
    )
    return data
  } catch (e) {
    if ((e as AxiosError<ApiError>).response?.status === 404) {
      return null
    }
    throw e
  }
}

export const putMeConsent = async (
  consentType: ConsentType | null,
  etag: string | undefined
) => {
  const accepted = new Date()

  const { data } = await axiosApi.put<ConsentSummary>(
    `/me/consent/${consentType}`,
    {
      accepted: accepted.toISOString(),
      version: etag
    }
  )
  return data
}
