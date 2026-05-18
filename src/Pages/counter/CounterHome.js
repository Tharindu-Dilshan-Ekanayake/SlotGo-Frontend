import React, { useEffect, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import toast from 'react-hot-toast'
import CounterNav from '../../components/CounterNav'
import CounterParking from './CounterParking'
import { getParkingPackages } from '../../apis/parkingApi'
import { getAvailableSlots } from '../../apis/slotApi'

const getPackageFee = (feePackage) => {
  if (!feePackage) {
    return 0
  }

  const packagePrice = Number(feePackage.packagePrice || 0)
  const offer = Number(feePackage.offer || 0)

  return Number((packagePrice - packagePrice * (offer / 100)).toFixed(2))
}

const formatCurrency = (value) =>
  `Rs. ${Number(value || 0).toLocaleString('en-LK', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  })}`

function RegisterHome() {
  const [isMetaLoading, setIsMetaLoading] = useState(true)
  const [availableSlots, setAvailableSlots] = useState([])
  const [packages, setPackages] = useState([])

  const loadMetaData = async () => {
    setIsMetaLoading(true)

    try {
      const [slotsResponse, packageResponse] = await Promise.all([
        getAvailableSlots(),
        getParkingPackages(),
      ])

      setAvailableSlots(slotsResponse)
      setPackages(packageResponse)
    } catch (loadError) {
      toast.error(
        loadError?.response?.data?.message ||
          loadError?.message ||
          'Unable to load available slots/packages.'
      )
    } finally {
      setIsMetaLoading(false)
    }
  }

  useEffect(() => {
    loadMetaData()
  }, [])

  return (
    <section>
      <p className="text-xs font-extrabold uppercase tracking-[0.08em] text-[#18a84b]">Counter</p>
      <div className="flex flex-col gap-4 mt-2 sm:flex-row sm:items-end sm:justify-between">
        <h1 className="text-2xl font-extrabold text-[#071633] sm:text-3xl">Dashboard</h1>

        <button
          className="inline-flex h-10 w-fit items-center justify-center rounded-lg border border-[#b8d5f0] bg-white px-4 text-sm font-extrabold text-[#0c67d9] transition hover:border-[#0c67d9] active:translate-y-[1px]"
          onClick={loadMetaData}
          type="button"
        >
          Refresh
        </button>
      </div>

      <div className="grid gap-4 mt-6 lg:grid-cols-2">
        <div className="rounded-lg border border-[#dce8f7] bg-white p-5 shadow-[0_12px_28px_rgba(15,23,42,0.08)]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-extrabold text-[#10224a]">Available Slots</h2>
              <p className="mt-1 text-sm font-semibold text-[#64748b]">
                {isMetaLoading ? 'Loading...' : `${availableSlots.length} slots available`}
              </p>
            </div>
          </div>

          {availableSlots.length === 0 && !isMetaLoading ? (
            <p className="mt-4 text-sm font-semibold text-[#64748b]">No available slots.</p>
          ) : (
            <ul className="grid gap-2 mt-4">
              {availableSlots.slice(0, 12).map((slot) => (
                <li
                  key={slot.id}
                  className="flex items-center justify-between rounded-lg border border-[#edf1f7] bg-[#f8fbff] px-3 py-2"
                >
                  <span className="text-sm font-extrabold text-[#10224a]">
                     {slot.name || `Slot ${slot.id}`}
                  </span>
                </li>
              ))}
              {availableSlots.length > 12 ? (
                <li className="text-xs font-semibold text-[#64748b]">
                  Showing first 12 slots...
                </li>
              ) : null}
            </ul>
          )}
        </div>

        <div className="rounded-lg border border-[#dce8f7] bg-white p-5 shadow-[0_12px_28px_rgba(15,23,42,0.08)]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-extrabold text-[#10224a]">Parking Packages</h2>
              <p className="mt-1 text-sm font-semibold text-[#64748b]">
                {isMetaLoading ? 'Loading...' : `${packages.length} active packages`}
              </p>
            </div>
          </div>

          {packages.length === 0 && !isMetaLoading ? (
            <p className="mt-4 text-sm font-semibold text-[#64748b]">No active packages.</p>
          ) : (
            <ul className="grid gap-2 mt-4">
              {packages.map((feePackage) => (
                <li
                  key={feePackage.id}
                  className="rounded-lg border border-[#edf1f7] bg-[#f8fbff] px-3 py-2"
                >
                  <p className="text-sm font-extrabold text-[#10224a]">
                     {feePackage.timeDuration}
                  </p>
                  <p className="mt-1 text-xs font-semibold text-[#64748b]">
                    Price: {formatCurrency(getPackageFee(feePackage))}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  )
}

export default function CounterHome() {
  return (
    <div className="min-h-screen bg-[#f4f8ff] text-[#071633]">
      <CounterNav />

      <main className="px-5 py-6 sm:px-8 lg:ml-72 lg:px-10">
        <div className="max-w-6xl mx-auto">
          <Routes>
            <Route path="/" element={<Navigate replace to="register" />} />
            <Route path="register" element={<RegisterHome />} />
            <Route path="parking" element={<CounterParking />} />
          </Routes>
        </div>
      </main>
    </div>
  )
}
