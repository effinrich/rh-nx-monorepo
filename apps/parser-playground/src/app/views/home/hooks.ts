import { useQuery } from '@tanstack/react-query'

import { getTopicById, getTopicSearch } from './api'
import { TopicProps } from './types'

export const useGetTopicByIdQuery = (id: string | TopicProps) =>
  useQuery({ queryKey: ['topic', id], queryFn: () => getTopicById(id) })

export const useGetTopicSearchQuery = (q: string) =>
  useQuery({ queryKey: ['topics', q], queryFn: () => getTopicSearch(q) })
