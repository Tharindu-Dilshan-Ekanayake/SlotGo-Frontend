import React from 'react'
import LogoutButton from '../../components/LogoutButton'

export default function AdminDash() {
  return (
    <div className="min-h-screen bg-[#f4f8ff] px-5 py-6 text-[#071633] sm:px-8">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 rounded-lg border border-[#dce8f7] bg-white p-4 shadow-[0_12px_28px_rgba(15,23,42,0.08)]">
        <h1 className="text-xl font-extrabold sm:text-2xl">Admin Dashboard</h1>
        <LogoutButton />
      </div>
    </div>
  )
}
