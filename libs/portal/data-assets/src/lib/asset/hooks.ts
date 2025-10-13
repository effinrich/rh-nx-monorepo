import { useMutation } from '@tanstack/react-query'

import { createAsset, createAssets } from './api'

export const useCreateAssets = () => {
  return useMutation({
    mutationFn: (files: FileList) => {
      return createAssets([...files])
    }
  })
}

export const useCreateAsset = () => {
  return useMutation({
    mutationFn: (file: File) => {
      return createAsset(file)
    }
  })
}
