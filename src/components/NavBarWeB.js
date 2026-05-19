import React, { useState, useEffect } from 'react'
import { FaArrowRight, FaBars, FaTimes } from 'react-icons/fa'
import LOGO from '../images/LOGO.png'
import { useNavigate } from 'react-router-dom'

const staticNavLinks = [
  { id: 'home', label: 'Home' },
  { id: 'features', label: 'Features' },
  { id: 'how-it-works', label: 'How It Works' },
  { id: 'pricing', label: 'Pricing' },
  { id: 'about', label: 'About Us' },
]

export default function NavBarWeB() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 120; // Increased offset for better trigger

      // Check if we're at the bottom of the page to activate the last section
      const isAtBottom = (window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight - 50;

      if (isAtBottom) {
        setActiveSection(staticNavLinks[staticNavLinks.length - 1].id);
        return;
      }

      for (const section of staticNavLinks) {
        const element = document.getElementById(section.id);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section.id);
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigateToLogin = () => {
    setIsOpen(false)
    navigate('/login')
  }

  const handleNavClick = (e, id) => {
    e.preventDefault();
    setIsOpen(false);
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 70,
        behavior: 'smooth',
      });
    }
  }

  return (
    <header className="sticky top-0 z-50 h-[72px] w-full bg-white/90 shadow-[0_4px_18px_rgba(12,20,33,0.08)] backdrop-blur transition-all duration-300">
      <div className="flex items-center justify-between w-full h-full gap-6 px-4 sm:px-8 lg:px-10 xl:px-14 2xl:px-16">
        <div className="flex items-center gap-2.5">
           <img className="object-contain h-10 cursor-pointer" src={LOGO} alt="SlotGo logo" onClick={() => window.scrollTo(0, 0)} />
        </div>

        <nav className="hidden flex-1 items-center justify-center gap-7 text-[13px] font-bold text-[#121a2f] lg:flex" aria-label="Primary">
          {staticNavLinks.map(({ id, label }) => {
            const isActive = activeSection === id;
            return (
              <a
                key={id}
                className={`relative transition-colors hover:text-[#18a84b] py-2 cursor-pointer ${isActive ? 'text-[#18a84b]' : ''}`}
                onClick={(e) => handleNavClick(e, id)}
                href={`#${id}`}
              >
                <span className="relative">{label}</span>
                <span 
                  className={`absolute bottom-0 left-0 h-[3px] rounded-full bg-[#18a84b] transition-all duration-300 ease-out ${
                    isActive ? 'w-full opacity-100' : 'w-0 opacity-0'
                  }`}
                ></span>
              </a>
            );
          })}
        </nav>

        <div className="items-center hidden gap-3 lg:flex">
          <button className="h-10 rounded-lg border border-[#cfd6e6] bg-white px-5 text-sm font-bold text-[#1a2340] hover:bg-slate-50 hover:border-[#1a2340] transition-colors duration-200 active:translate-y-[1px]" type="button" onClick={navigateToLogin}>
            Login
          </button>
          <button className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-[#0c67d9] bg-[#0c67d9] px-5 text-sm font-bold text-white shadow-[0_8px_16px_rgba(12,103,217,0.24)] hover:bg-[#0a52ae] transition-colors duration-200 active:translate-y-[1px]" type="button">
            Get Started
            <FaArrowRight className="text-[12px]" aria-hidden="true" />
          </button>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <button
            className="h-10 rounded-lg border border-[#0c67d9] bg-white px-4 text-sm font-bold text-[#0c67d9] transition-transform duration-200 active:translate-y-[1px]"
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
        <nav className="absolute left-0 top-[72px] grid w-full gap-2 border-t border-[#edf1f7] bg-white px-4 py-4 text-sm font-bold text-[#121a2f] shadow-[0_14px_28px_rgba(12,20,33,0.12)] sm:px-8 lg:hidden animate-fade-in" aria-label="Mobile primary">
          {staticNavLinks.map(({ id, label }) => {
            const isActive = activeSection === id;
            return (
              <a
                key={id}
                className={`rounded-lg px-3 py-2.5 transition-colors hover:bg-[#f3f7fd] hover:text-[#18a84b] ${
                  isActive ? 'bg-[#e8f9ed] text-[#18a84b]' : ''
                }`}
                href={`#${id}`}
                onClick={(e) => handleNavClick(e, id)}
              >
                {label}
              </a>
            );
          })}
        </nav>
      ) : null}
    </header>
  )
}
