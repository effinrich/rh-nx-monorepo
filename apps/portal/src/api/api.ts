import {
  getImpersonatedEmail,
  getUserAccessToken
} from '@redesignhealth/portal/utils'
import axios from 'axios'

export const api = () =>
  axios.create({
    baseURL: import.meta.env.VITE_COMPANY_API_HOSTNAME,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getUserAccessToken() ?? ''}`,
      'RH-Impersonation-Email': getImpersonatedEmail() ?? null
    }
  })
