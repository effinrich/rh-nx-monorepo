import axios, { AxiosResponse } from 'axios'

export const parseRequest = async <TData = unknown, TError = unknown>(
  request: Promise<AxiosResponse<TData>>
) => {
  try {
    return { response: await request }
  } catch (error) {
    if (axios.isAxiosError<TError>(error)) return { error }

    throw error
  }
}
