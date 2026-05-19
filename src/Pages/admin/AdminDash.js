import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import AdminNav from '../../components/AdminNav'
import Dashboard from './Dashboard'
import UserManagement from './UserManagement'
import Slot from './Slot'
import Parking from './Parking'
import Package from './Package'

export default function AdminDash() {
  return (
    <div className="min-h-screen bg-[#f4f8ff] text-[#071633]">
      <AdminNav />

      <main className="px-5 py-6 sm:px-8 lg:ml-72 lg:px-10">
        <div className="max-w-6xl mx-auto">
          <Routes>
            <Route path="/" element={<Navigate replace to="dashboard" />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="slots" element={<Slot />} />
            <Route path="parking" element={<Parking />} />
            <Route path="packages" element={<Package />} />
          </Routes>
        </div>
      </main>
    </div>
  )
}
