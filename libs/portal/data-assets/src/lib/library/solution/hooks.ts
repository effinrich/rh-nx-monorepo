import { useMutation, useQuery } from '@tanstack/react-query'

import { getSolutionById, postCopyTemplate } from './api'

export const useGetSolutionByIdQuery = (id: string | undefined) =>
  useQuery({
    queryKey: ['solutions', id],
    queryFn: () => getSolutionById(id)
  })

export const usePostCopyTemplateMutation = () =>
  useMutation({
    mutationFn: (args: { id?: string; token?: string }) =>
      postCopyTemplate(args.id, args.token),
    onSuccess: data =>
      window.open(
        data?.links?.find((link) => link?.rel === 'googleDocs')?.href,
        '_blank'
      )
  })
