const API_PORT = '8000'

const getApiBaseUrl = () => {
  const envApiUrl = process.env.REACT_APP_API_URL

  if (envApiUrl) {
    return envApiUrl
  }

  if (typeof window === 'undefined') {
    return `http://localhost:${API_PORT}`
  }

  const { hostname } = window.location

  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return `http://localhost:${API_PORT}`
  }

  return `http://${hostname}:${API_PORT}`
}

const API_BASE_URL = getApiBaseUrl()

export default API_BASE_URL
