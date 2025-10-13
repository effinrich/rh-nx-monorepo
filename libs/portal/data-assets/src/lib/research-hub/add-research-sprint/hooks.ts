import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'

import { ApiError, NewSprintProps } from '../../types'

import { postResearchSprint } from './api'

export const usePostResearchSprint = () => {
  const queryClient = useQueryClient()

  const { mutateAsync, isError, isPending, isSuccess, error } = useMutation({
    mutationFn: (newSprint: NewSprintProps) => postResearchSprint(newSprint),
    onError: (error: AxiosError<ApiError>) => {
      return (error?.response?.status || 0) >= 500
    },
    async onSuccess(updated) {
      queryClient.clear()
    }
  })

  return { mutateAsync, isError, error, isPending, isSuccess }
}
