import axios from 'axios'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Attach access token to every request automatically
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('accessToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

// Handle token expiry automatically
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // If 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        // Try to get a new access token using refresh token cookie
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        )

        const newToken = response.data.data.accessToken
        localStorage.setItem('accessToken', newToken)

        // Retry the original request with new token
        originalRequest.headers.Authorization = `Bearer ${newToken}`
        return api(originalRequest)
      } catch {
        // Refresh failed — clear token and redirect to login
        localStorage.removeItem('accessToken')
        window.location.href = '/login'
      }
    }

    return Promise.reject(error)
  }
)

export default api