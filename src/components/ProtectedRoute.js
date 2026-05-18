import React, { useEffect } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { getDashboardPathByRole, getStoredAuth, logoutUser } from '../store/authStore'

export default function ProtectedRoute({ allowedRole, children }) {
  const location = useLocation()
  const navigate = useNavigate()
  const { accessToken, role } = getStoredAuth()
  const isAllowed = Boolean(accessToken) && role === allowedRole

  useEffect(() => {
    const checkAuth = () => {
      const currentAuth = getStoredAuth()

      if (!currentAuth.accessToken) {
        logoutUser()
        navigate('/login', { replace: true })
        return
      }

      if (!currentAuth.role) {
        logoutUser()
        navigate('/login', { replace: true })
        return
      }

      if (currentAuth.role !== allowedRole) {
        navigate(getDashboardPathByRole(currentAuth.role), { replace: true })
      }
    }

    const handleStorageChange = (event) => {
      if (event.key === 'token' || event.key === 'user' || event.key === 'decodedToken') {
        checkAuth()
      }
    }

    checkAuth()
    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('focus', checkAuth)
    const authCheckInterval = window.setInterval(checkAuth, 1000)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('focus', checkAuth)
      window.clearInterval(authCheckInterval)
    }
  }, [allowedRole, navigate])

  if (!accessToken || !role) {
    return <Navigate replace state={{ from: location }} to="/login" />
  }

  if (!isAllowed) {
    return <Navigate replace to={getDashboardPathByRole(role)} />
  }

  return children
}
