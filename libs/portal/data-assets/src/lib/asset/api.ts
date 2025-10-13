import { axiosApi } from '../axios-api'

import { Asset } from './types'

export const createAsset = async (file: File): Promise<Asset> => {
  return (await createAssets([file]))[0]
}

export const createAssets = async (files: File[]) => {
  const requestBody = new FormData()
  for (const file of files) {
    requestBody.append('file', file)
  }

  const { data } = await axiosApi.post<{ content: Asset[] }>(
    `/asset`,
    requestBody,
    {
      headers: {
        'Content-type': 'multipart/form-data',
        accept: 'application/json'
      }
    }
  )
  return data.content
}
