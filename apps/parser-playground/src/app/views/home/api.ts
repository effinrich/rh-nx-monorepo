import { axiosApi } from '../../store'

import { SearchProps, TopicProps } from './types'

export const getTopicById = async (id: string | TopicProps) => {
  const response = await axiosApi.get<TopicProps>(`/library-content/${id}`)
  return response.data
}

export const getTopicSearch = async (q: string) => {
  const response = await axiosApi.get<SearchProps>(
    `/library/topic/search?q=${q}`
  )
  return response.data
}
