import { axiosApi } from '../../axios-api'
import { NewSprintProps } from '../../types'

export const postResearchSprint = async (newSprint: NewSprintProps) => {
  const { data } = await axiosApi.post(`/research`, newSprint)
  return data
}
