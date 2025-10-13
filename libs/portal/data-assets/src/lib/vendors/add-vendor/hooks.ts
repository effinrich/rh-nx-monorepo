import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'

import { type ApiError } from '../../types'
import { type VendorFormProps } from '../types'
import { VENDORS_QUERY_KEY } from '../'

import { createVendor } from './api'

export const useCreateVendor = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (vendor: VendorFormProps) => {
      return createVendor(vendor)
    },
    onSuccess: async () => {
      queryClient.removeQueries({ queryKey: [VENDORS_QUERY_KEY] })
    },
    onError: (error: AxiosError<ApiError>) => {
      return (error.response?.status || 0) >= 500
    }
  })
}
