import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'

import { type ApiError } from '../../types'
import { type VendorFormProps } from '../types'
import { VENDORS_QUERY_KEY } from '../'

import { updateVendorById } from './api'

export const useUpdateVendorById = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, vendor }: { id?: string; vendor: VendorFormProps }) => {
      return updateVendorById(id, vendor)
    },
    onSuccess: async () => {
      queryClient.removeQueries({ queryKey: [VENDORS_QUERY_KEY] })
    },
    onError: (error: AxiosError<ApiError>) => error
  })
}
