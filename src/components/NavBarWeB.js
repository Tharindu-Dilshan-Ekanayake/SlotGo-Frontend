import React, { useState } from 'react'
import { FaArrowRight, FaBars, FaTimes } from 'react-icons/fa'
import LOGO from '../images/LOGO.png'
import { useNavigate } from 'react-router-dom'

const navLinks = [
  { href: '#home', label: 'Home', active: true },
  { href: '#features', label: 'Features' },
  { href: '#how', label: 'How It Works' },
  { href: '#pricing', label: 'Pricing' },
  { href: '#about', label: 'About Us' },
  { href: '#contact', label: 'Contact' },
]
export default function NavBarWeB() {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()

  const navigateToLogin = () => {
    setIsOpen(false)
    navigate('/login')
  }

  return (
    <header className="sticky top-0 z-20 h-[72px] w-full bg-white/90 shadow-[0_4px_18px_rgba(12,20,33,0.08)] backdrop-blur">
      <div className="flex items-center justify-between w-full h-full gap-6 px-4 sm:px-8 lg:px-10 xl:px-14 2xl:px-16">
        <div className="flex items-center gap-2.5">
          <img className="object-contain h-10" src={LOGO} alt="SlotGo logo" />
        
        </div>

        <nav className="hidden flex-1 items-center justify-center gap-7 text-[13px] font-bold text-[#121a2f] lg:flex" aria-label="Primary">
          {navLinks.map(({ href, label, active }) => (
            <a
              key={label}
              className={`relative transition-colors hover:text-[#18a84b] ${active ? 'text-[#18a84b]' : ''}`}
              href={href}
            >
              <span className="relative">{label}</span>
              {active ? <span className="absolute -bottom-3 left-0 h-[3px] w-full rounded-full bg-[#18a84b]"></span> : null}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <button className="h-10 rounded-lg border border-[#cfd6e6] bg-white px-5 text-sm font-bold text-[#1a2340] transition-transform duration-200 active:translate-y-[1px]" type="button" onClick={navigateToLogin}>
            Login
          </button>
          <button className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-[#f7bd13] bg-[#f7bd13] px-5 text-sm font-bold text-[#1b1400] shadow-[0_8px_16px_rgba(247,189,19,0.24)] transition-transform duration-200 active:translate-y-[1px]" type="button">
            Get Started
            <FaArrowRight className="text-[12px]" aria-hidden="true" />
          </button>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <button
            className="h-10 rounded-lg border border-[#18a84b] bg-white px-4 text-sm font-bold text-[#18a84b] transition-transform duration-200 active:translate-y-[1px]"
            type="button"
            onClick={navigateToLogin}
          >
            Login
          </button>

          <button
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[#d8e0ef] bg-white text-[#16264c]"
            type="button"
            aria-label="Open navigation"
            aria-expanded={isOpen}
            onClick={() => setIsOpen((open) => !open)}
          >
            {isOpen ? <FaTimes className="text-[18px]" aria-hidden="true" /> : <FaBars className="text-[18px]" aria-hidden="true" />}
          </button>
        </div>
      </div>

      {isOpen ? (
        <nav className="absolute left-0 top-[72px] grid w-full gap-2 border-t border-[#edf1f7] bg-white px-4 py-4 text-sm font-bold text-[#121a2f] shadow-[0_14px_28px_rgba(12,20,33,0.12)] sm:px-8 lg:hidden" aria-label="Mobile primary">
          {navLinks.map(({ href, label, active }) => (
            <a
              key={label}
              className={`rounded-lg px-3 py-2 transition-colors hover:bg-[#f3f7fd] hover:text-[#18a84b] ${
                active ? 'bg-[#e8f9ed] text-[#18a84b]' : ''
              }`}
              href={href}
              onClick={() => setIsOpen(false)}
            >
              {label}
            </a>
          ))}
        </nav>
      ) : null}
    </header>
  )
}
