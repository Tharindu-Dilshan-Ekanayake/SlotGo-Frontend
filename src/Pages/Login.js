import React, { useState } from 'react'
import { FaArrowRight, FaEnvelope, FaLock, FaParking, FaShieldAlt } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import InputCompo from '../components/InputCompo'
import BGHOME from '../images/BGHome.png'
import LOGO from '../images/LOGO.png'
import { getDashboardPathByRole, loginUser } from '../store/authStore'

export default function Login() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setIsLoading(true)

    try {
      const { role } = await loginUser(formData.email, formData.password)
      toast.success('Login successful.')
      navigate(getDashboardPathByRole(role), { replace: true })
    } catch (loginError) {
      toast.error(
        typeof loginError === 'string'
          ? loginError
          : loginError?.message || loginError?.error || 'Login failed. Please check your email and password.'
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f4f8ff] text-[#071633]">
      <img
        className="pointer-events-none absolute bottom-0 right-[-120px] hidden w-[min(58vw,760px)] opacity-10 lg:block"
        src={BGHOME}
        alt=""
        aria-hidden="true"
      />
      <section className="grid min-h-screen lg:grid-cols-[0.95fr_1.05fr]">
        <aside className="relative hidden overflow-hidden bg-[linear-gradient(135deg,#064ac2_0%,#075ad8_54%,#18a84b_100%)] px-10 py-8 text-white lg:flex lg:flex-col lg:justify-between xl:px-14">
          <img
            className="pointer-events-none absolute bottom-[-28px] right-[-110px] w-[88%] max-w-[690px] opacity-25"
            src={BGHOME}
            alt=""
            aria-hidden="true"
          />
          <Link className="inline-flex w-fit items-center" to="/">
            <img className="h-12 w-auto rounded-lg bg-white px-3 py-2" src={LOGO} alt="SlotGo logo" />
          </Link>

          <div className="relative z-[1] max-w-[520px]">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-white/15 text-white ring-1 ring-white/25">
              <FaParking className="text-[22px]" aria-hidden="true" />
            </span>
            <h1 className="mt-6 text-balance text-[42px] font-extrabold leading-tight xl:text-[52px]">
              Manage every parking session with confidence.
            </h1>
            <p className="mt-5 max-w-[460px] text-pretty text-base font-medium leading-7 text-white/85">
              Sign in to monitor slots, tickets, payments, and live parking activity from one clean dashboard.
            </p>
          </div>

          <div className="relative z-[1] grid max-w-[520px] gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-white/20 bg-white/10 p-4 backdrop-blur">
              <span className="text-2xl font-extrabold">500+</span>
              <p className="mt-1 text-sm font-semibold text-white/80">Parking slots</p>
            </div>
            <div className="rounded-lg border border-white/20 bg-white/10 p-4 backdrop-blur">
              <span className="text-2xl font-extrabold">98%</span>
              <p className="mt-1 text-sm font-semibold text-white/80">User satisfaction</p>
            </div>
          </div>
        </aside>

        <div className="relative flex min-h-screen items-center justify-center px-5 py-8 sm:px-8 lg:min-h-0 lg:px-10 xl:px-16">
          <img
            className="pointer-events-none absolute bottom-0 right-[-150px] w-[560px] max-w-none opacity-10 lg:hidden"
            src={BGHOME}
            alt=""
            aria-hidden="true"
          />

          <div className="relative z-[1] w-full max-w-[440px] rounded-lg border border-[#dce8f7] bg-white/95 p-5 shadow-[0_22px_55px_rgba(10,36,88,0.12)] backdrop-blur sm:p-8">
            <Link className="mb-8 inline-flex lg:hidden" to="/">
              <img className="h-11 w-auto" src={LOGO} alt="SlotGo logo" />
            </Link>

            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.08em] text-[#18a84b]">Welcome back</p>
                <h2 className="mt-2 text-3xl font-extrabold text-[#071633] sm:text-[34px]">Login</h2>
              </div>
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#e8f9ed] text-[#18a84b]">
                <FaShieldAlt className="text-[18px]" aria-hidden="true" />
              </span>
            </div>

            <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
              <InputCompo
                icon={FaEnvelope}
                label="Email address"
                name="email"
                onChange={handleChange}
                placeholder="name@example.com"
                required
                type="email"
                value={formData.email}
              />

              <InputCompo
                icon={FaLock}
                label="Password"
                name="password"
                onChange={handleChange}
                placeholder="Enter your password"
                required
                type="password"
                value={formData.password}
              />

              <button
                className="inline-flex h-12 w-full items-center justify-center gap-3 rounded-lg bg-[#18a84b] px-5 text-sm font-extrabold text-white shadow-[0_14px_26px_rgba(24,168,75,0.24)] transition duration-200 hover:bg-[#139241] active:translate-y-[1px] disabled:cursor-not-allowed disabled:bg-[#8bcfa4]"
                disabled={isLoading}
                type="submit"
              >
                {isLoading ? 'Logging in...' : 'Login'}
                <FaArrowRight className="text-[13px]" aria-hidden="true" />
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  )
}
