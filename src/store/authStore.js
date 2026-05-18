import { login } from '../apis/authApi'

const TOKEN_KEY = 'token'
const USER_KEY = 'user'
const DECODED_TOKEN_KEY = 'decodedToken'

export const decodeJwtToken = (token) => {
  if (!token) {
    return null
  }

  try {
    const [, payload] = token.split('.')

    if (!payload) {
      return null
    }

    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/')
    const paddedBase64 = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=')
    const decodedPayload = decodeURIComponent(
      atob(paddedBase64)
        .split('')
        .map((char) => `%${`00${char.charCodeAt(0).toString(16)}`.slice(-2)}`)
        .join('')
    )

    return JSON.parse(decodedPayload)
  } catch (error) {
    console.error('Invalid JWT token', error)
    return null
  }
}

export const getRoleFromToken = (token) => {
  const decodedToken = decodeJwtToken(token)
  return decodedToken?.role || decodedToken?.user?.role || null
}

export const getDashboardPathByRole = (role) => {
  if (role === 'admin') {
    return '/admin'
  }

  if (role === 'counter') {
    return '/counter'
  }

  return '/'
}

export const saveAuthData = ({ accessToken, user }) => {
  const decodedToken = decodeJwtToken(accessToken)
  const role = decodedToken?.role || decodedToken?.user?.role || user?.role || null
  const authUser = { ...user, role }

  localStorage.setItem(TOKEN_KEY, accessToken)
  localStorage.setItem(USER_KEY, JSON.stringify(authUser))
  localStorage.setItem(DECODED_TOKEN_KEY, JSON.stringify(decodedToken))

  return {
    accessToken,
    decodedToken,
    role,
    user: authUser,
  }
}

export const loginUser = async (email, password) => {
  const data = await login(email, password)

  if (!data?.accessToken) {
    throw new Error('Login response does not include an access token.')
  }

  return saveAuthData(data)
}

export const getStoredAuth = () => {
  const accessToken = localStorage.getItem(TOKEN_KEY)
  const userValue = localStorage.getItem(USER_KEY)
  const decodedToken = decodeJwtToken(accessToken)
  const user = userValue ? JSON.parse(userValue) : null
  const role = decodedToken?.role || decodedToken?.user?.role || user?.role || null

  return {
    accessToken,
    decodedToken,
    role,
    user: user ? { ...user, role } : null,
  }
}

export const logoutUser = () => {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
  localStorage.removeItem(DECODED_TOKEN_KEY)
}
