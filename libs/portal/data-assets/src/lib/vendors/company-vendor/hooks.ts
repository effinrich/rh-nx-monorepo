import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'

import { ApiError } from '../../types'
import { VENDORS_QUERY_KEY } from '../hooks'
import { CompanyVendorProps } from '../types'

import { postCompanyVendor, putCompanyVendor } from './api'

export const usePostCompanyVendor = (companyId: string) => {
  const queryClient = useQueryClient()
  const { mutateAsync, isError, isPending, isSuccess, error } = useMutation({
    mutationFn: (newVendor: CompanyVendorProps) =>
      postCompanyVendor(companyId, newVendor),
    throwOnError: (error: AxiosError<ApiError>) =>
      (error?.response?.status ?? 0) >= 500,
    onSuccess: async () => {
      queryClient.removeQueries({ queryKey: [VENDORS_QUERY_KEY] })
    }
  })

  return { mutateAsync, isError, error, isPending, isSuccess }
}

export const usePutCompanyVendor = (
  companyId: string,
  companyVendorId: string
) => {
  const queryClient = useQueryClient()
  const { mutateAsync, isError, isPending, isSuccess, error } = useMutation({
    mutationFn: (updatedVendor: CompanyVendorProps) =>
      putCompanyVendor(companyId, companyVendorId, updatedVendor),
    throwOnError: (error: AxiosError<ApiError>) =>
      (error?.response?.status ?? 0) >= 500,
    onSuccess: async () => {
      queryClient.removeQueries({ queryKey: [VENDORS_QUERY_KEY] })
    }
  })

  return { mutateAsync, isError, error, isPending, isSuccess }
}
