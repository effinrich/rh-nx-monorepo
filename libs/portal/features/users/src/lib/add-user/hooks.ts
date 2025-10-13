import { ApiError } from '@redesignhealth/portal/data-assets'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'

import { type NewUserProps, createPretendProxyCompanyMember } from './api'

export const usePostUserProxyMutation = () => {
  const queryClient = useQueryClient()

  const { mutateAsync, isError, isPending, isSuccess, error } = useMutation({
    mutationFn: (newUser: NewUserProps) =>
      createPretendProxyCompanyMember(newUser),
    onError: (error: AxiosError<ApiError>) => {
      return (error?.response?.status || 0) >= 500
    },
    async onSuccess(updated) {
      queryClient.removeQueries({ queryKey: ['person'] })
    }
  })

  return { mutateAsync, isError, error, isPending, isSuccess }
}
