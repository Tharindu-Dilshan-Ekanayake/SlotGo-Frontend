import React from 'react'
import { FaSignOutAlt } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { logoutUser } from '../store/authStore'

export default function LogoutButton({ className = '' }) {
  const navigate = useNavigate()

  const handleLogout = () => {
    logoutUser()
    navigate('/login', { replace: true })
  }

  return (
    <button
      className={`inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#18a84b] px-4 text-sm font-extrabold text-white shadow-[0_10px_18px_rgba(24,168,75,0.22)] transition duration-200 hover:bg-[#139241] active:translate-y-[1px] ${className}`}
      onClick={handleLogout}
      type="button"
    >
      <FaSignOutAlt className="text-[14px]" aria-hidden="true" />
      Logout
    </button>
  )
}
