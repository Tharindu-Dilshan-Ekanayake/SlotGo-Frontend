import React, { useState } from 'react'
import { FaBars, FaTimes, FaChartPie, FaUsers, FaThList, FaParking, FaBox, FaEnvelope } from 'react-icons/fa'
import { NavLink } from 'react-router-dom'
import LOGO from '../images/LOGO.png'
import LogoutButton from './LogoutButton'

const adminLinks = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: FaChartPie },
  { to: '/admin/users', label: 'User Management', icon: FaUsers },
  { to: '/admin/slots', label: 'Slot', icon: FaThList },
  { to: '/admin/parking', label: 'Parking', icon: FaParking },
  { to: '/admin/packages', label: 'Package', icon: FaBox },
  { to: '/admin/messages', label: 'Messages', icon: FaEnvelope },
]

export default function AdminNav() {
  const [isOpen, setIsOpen] = useState(false)

  const navLinkClass = ({ isActive }) =>
    `flex h-11 items-center gap-3 rounded-lg px-3 text-sm font-extrabold transition-colors ${
      isActive
        ? 'bg-[#e8f9ed] text-[#18a84b]'
        : 'text-[#536582] hover:bg-[#eef6ff] hover:text-[#0c67d9]'
    }`

  const navContent = (
    <>
      <div className="flex h-[72px] items-center border-b border-[#dce8f7] px-5">
        <img className="object-contain w-auto h-10" src={LOGO} alt="SlotGo logo" />
      </div>

      <nav className="flex flex-col flex-1 gap-2 px-4 py-5" aria-label="Admin navigation">
        {adminLinks.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} className={navLinkClass} to={to} onClick={() => setIsOpen(false)}>
            <Icon className="text-[16px]" aria-hidden="true" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-[#dce8f7] p-4">
        <LogoutButton className="w-full" />
      </div>
    </>
  )

  return (
    <>
      <header className="sticky top-0 z-30 flex h-[64px] items-center justify-between border-b border-[#dce8f7] bg-white/95 px-4 shadow-[0_8px_22px_rgba(15,23,42,0.08)] backdrop-blur lg:hidden">
        <button
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[#d8e0ef] bg-white text-[#16264c]"
          type="button"
          aria-label="Open admin menu"
          aria-expanded={isOpen}
          onClick={() => setIsOpen(true)}
        >
          <FaBars className="text-[18px]" aria-hidden="true" />
        </button>

        <img className="object-contain w-auto h-9" src={LOGO} alt="SlotGo logo" />
        <span className="w-10 h-10" aria-hidden="true" />
      </header>

      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 flex-col border-r border-[#dce8f7] bg-white shadow-[8px_0_28px_rgba(15,23,42,0.08)] lg:flex">
        {navContent}
      </aside>

      <div
        className={`fixed inset-0 z-40 bg-[#071633]/45 transition-opacity duration-200 lg:hidden ${
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        aria-hidden="true"
        onClick={() => setIsOpen(false)}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[min(82vw,288px)] flex-col border-r border-[#dce8f7] bg-white shadow-[12px_0_32px_rgba(15,23,42,0.18)] transition-transform duration-300 lg:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <button
          className="absolute right-3 top-4 inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#d8e0ef] bg-white text-[#16264c]"
          type="button"
          aria-label="Close admin menu"
          onClick={() => setIsOpen(false)}
        >
          <FaTimes className="text-[16px]" aria-hidden="true" />
        </button>

        {navContent}
      </aside>
    </>
  )
}
