import Axios from 'axios'
import qs from 'qs'

import { nxCompanyApiHostname } from './config'
import { getUserToken } from './utils'

export const axiosApi = Axios.create({
  baseURL: nxCompanyApiHostname,
  // baseURL: '/',
  paramsSerializer: {
    serialize: params => {
      return qs.stringify(params, { arrayFormat: 'repeat' })
    }
  }
})

axiosApi.interceptors.request.use(config => {
  config.headers['Authorization'] = `Bearer ${getUserToken() ?? ''}`

  return config
})
