import { axiosApi } from '../../axios-api'
import { NewNotesProps } from '../../types'

export const postCallNotes = async (newNotes: NewNotesProps) => {
  const { data } = await axiosApi.post('/expert-note', newNotes)
  return data
}

const postAssets = async (newAssets: FormData) => {
  const { data } = await axiosApi.post('/asset', newAssets, {
    headers: {
      'Content-Type': 'multipart/form-data',
      accept: 'application/json'
    }
  })
  return data
}

export const postNotesWithAttachments = async (newNotes: NewNotesProps) => {
  if (newNotes['file']) {
    const resp = await postAssets(newNotes['file'])
    newNotes['attachments'] = resp.content
  }
  return await postCallNotes(newNotes)
}
