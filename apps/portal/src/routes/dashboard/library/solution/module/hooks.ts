import { useMutation, useQuery } from '@tanstack/react-query'

import { getArticleLinkMap, getModuleById, postCopyTemplate } from './api'

export const useGetModuleByIdQuery = (id: string | undefined) =>
  useQuery({
    queryKey: ['modules', id],
    queryFn: () => getModuleById(id)
  })

export const useGetArticleLinkMap = (
  libraryId: string | undefined,
  libraryRoute: string | undefined
) =>
  useQuery({
    queryKey: ['linkmap', libraryId, libraryRoute],
    queryFn: () => getArticleLinkMap(libraryId, libraryRoute)
  })

export const usePostCopyTemplateMutation = () =>
  useMutation({
    mutationFn: (args: { id?: string; token?: string }) =>
      postCopyTemplate(args.id, args.token),
    onSuccess: data =>
      window.open(
        data?.links?.find((link: { rel: string }) => link?.rel === 'googleDocs')
          ?.href,
        '_blank'
      )
  })
