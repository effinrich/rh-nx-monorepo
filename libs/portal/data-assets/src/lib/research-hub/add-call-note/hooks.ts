import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'

import { ApiError, NewNotesProps } from '../../types'

import { postCallNotes, postNotesWithAttachments } from './api'

export const usePostCallNotes = () => {
  const queryClient = useQueryClient()

  const { mutateAsync, isError, isPending, isSuccess, error } = useMutation({
    mutationFn: (newNotes: NewNotesProps) => postCallNotes(newNotes),
    onError: (error: AxiosError<ApiError>) => {
      return (error?.response?.status || 0) >= 500
    },
    async onSuccess(updated) {
      queryClient.clear()
    }
  })

  return { mutateAsync, isError, error, isPending, isSuccess }
}

export const usePostNotesWithAttachments = () => {
  const queryClient = useQueryClient()

  const { mutateAsync, isError, isPending, isSuccess, error } = useMutation({
    mutationFn: (newNotes: NewNotesProps) => postNotesWithAttachments(newNotes),
    onError: (error: AxiosError<ApiError>) => {
      return (error?.response?.status || 0) >= 500
    },
    async onSuccess() {
      queryClient.removeQueries({ queryKey: ['note'] })
    }
  })

  return { mutateAsync, isError, error, isPending, isSuccess }
}
