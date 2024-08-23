import axios from 'axios'

const apiBaseUrl = process.env.NEXT_PUBLIC_API

const api = axios.create({
  baseURL: apiBaseUrl,
  timeout: 15000,
})

export default api
