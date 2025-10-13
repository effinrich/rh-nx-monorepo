import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'

import { ApiError } from '../../types'
import { NewUserProps } from '../types'

import { createProxyCompanyMember } from './api'

export const usePostUserProxyMutation = () => {
  const queryClient = useQueryClient()

  const { mutateAsync, isError, isPending, isSuccess, error } = useMutation({
    mutationFn: (newUser: NewUserProps) => createProxyCompanyMember(newUser),
    onError: (error: AxiosError<ApiError>) => {
      return (error?.response?.status || 0) >= 500
    },
    async onSuccess(updated) {
      queryClient.removeQueries({ queryKey: ['person'] })
    }
  })

  return { mutateAsync, isError, error, isPending, isSuccess }
}
