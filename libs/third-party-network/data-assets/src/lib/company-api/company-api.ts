import { getUserAccessToken } from '@redesignhealth/third-party-network/utils'
import axios, { AxiosRequestHeaders } from 'axios'
import qs from 'qs'

export const companyAPI = axios.create({
  baseURL: import.meta.env.VITE_COMPANY_API_HOSTNAME,
  paramsSerializer: {
    serialize: params => qs.stringify(params, { arrayFormat: 'repeat' })
  }
})

companyAPI.interceptors.request.use(config => {
  const headersWithToken = {
    ...config.headers,
    Authorization: `Bearer ${getUserAccessToken()}`
  }

  return { ...config, headers: headersWithToken as AxiosRequestHeaders }
})
