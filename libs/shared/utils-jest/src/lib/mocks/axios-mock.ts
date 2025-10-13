import axios from 'axios'

export const axiosMock = axios.create({
  baseURL: 'https://reqres.in/api',
  headers: {
    'Content-Type': 'application/json'
  }
})

export default axiosMock
