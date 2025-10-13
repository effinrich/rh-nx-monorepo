import { toast } from 'react-toastify'
import axios, { type AxiosError } from 'axios'
import createAuthRefreshInterceptor from 'axios-auth-refresh'
import { isEmpty, isObject } from 'lodash'

import { getAccessToken, getRefreshToken, setAccessToken } from './auth'

const API_DEFAULT_MESSAGE_REQUEST = 'The request is invalid'

const api = axios.create({
  //baseURL: 'http://localhost:3333'
})

api.defaults.headers.common['Content-Type'] = 'application/json'

const rToken = getRefreshToken()

const refreshAuthLogic = (failedRequest: AxiosError) =>
  api
    .post('/api/auth/google/refresh-token', { refreshToken: rToken })
    .then(tokenRefreshResponse => {
      const { token } = tokenRefreshResponse.data
      setAccessToken(token)

      if (failedRequest.response) {
        failedRequest.response.config.headers.Authorization = `Bearer ${token}`
      }
    })

createAuthRefreshInterceptor(api, refreshAuthLogic, {
  statusCodes: [401], // default: [ 401 ]
  pauseInstanceWhileRefreshing: true
})

const handleError = (serverError: unknown) => {
  if (isObject(serverError)) {
    Object.entries(serverError).forEach(([, value]) => {
      const errorMessage = isEmpty(value) ? API_DEFAULT_MESSAGE_REQUEST : value
      toast(`${errorMessage}`, { type: 'error' })
    })
  }
}

// Add a request interceptor
api.interceptors.request.use(
  config => {
    if (getAccessToken()) {
      config.headers.Authorization = `Bearer ${getAccessToken()}`
    }

    // config.headers['RH-Impersonation-Email'] = getImpersonatedEmail()

    return config
  },
  error => {
    handleError(error?.response?.data)

    Promise.reject(error).then(() => toast(error, { type: 'error' }))
  }
)

export default api
// // Add a response interceptor
// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config

//     // If the error status is 401 and there is no originalRequest._retry flag,
//     // it means the token has expired and we need to refresh it
//     if (error.response.status === 401 && !originalRequest.retry) {
//       originalRequest.retry = true

//       try {
//         const refreshToken = getRefreshToken()
//         const response = await axios.post('/api/auth/google/refresh-token', { refreshToken })
//         const { token } = response.data

//         setAccessToken(token)

//         // Retry the original request with the new token
//         originalRequest.headers.Authorization = `Bearer ${token}`
//         return await axios(originalRequest)
//       } catch {
//         // Handle refresh token error or redirect to login
//       }
//     }

//     throw error
//   }
// )
