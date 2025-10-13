import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'

import { ApiError } from '../../types'

import {
  type EditUserProps,
  createEditCompanyMember,
  getUserByEmail
} from './api'

export const useGetPersonByEmail = (email: EditUserProps['email']) =>
  useQuery({
    queryKey: ['person', email],
    queryFn: () => getUserByEmail(email)
  })

export const useCreateEditCompanyMember = () => {
  const queryClient = useQueryClient()

  const { mutateAsync, isError, isPending, isSuccess, error } = useMutation({
    mutationFn: (updatedUser: EditUserProps) =>
      createEditCompanyMember(updatedUser),
    onError: (error: AxiosError<ApiError>) => {
      return (error?.response?.status || 0) >= 500
    },
    onSuccess: async () => {
      queryClient.removeQueries({ queryKey: ['person'] })
    }
  })

  return { mutateAsync, isError, error, isPending, isSuccess }
}
