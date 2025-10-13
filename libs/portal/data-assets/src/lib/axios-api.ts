import {
  getImpersonatedEmail,
  getUserAccessToken
} from '@redesignhealth/portal/utils'
import axios from 'axios'
import qs from 'qs'

export const axiosApi = axios.create({
  baseURL: import.meta.env.VITE_COMPANY_API_HOSTNAME,
  paramsSerializer: {
    serialize: params => qs.stringify(params, { arrayFormat: 'repeat' })
  }
})

axiosApi.interceptors.request.use(config => {
  config.headers['Authorization'] = `Bearer ${getUserAccessToken()}`
  config.headers['RH-Impersonation-Email'] = getImpersonatedEmail()

  return config
})
