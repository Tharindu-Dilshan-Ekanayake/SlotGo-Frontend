import React, { useEffect, useState } from 'react'
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import CounterNav from '../../components/CounterNav'
import CounterParking from './CounterParking'
import { getParkingPackages, getActiveParkingRecords } from '../../apis/parkingApi'
import { getAvailableSlots } from '../../apis/slotApi'
import { FaCar, FaMapMarkerAlt, FaTags, FaArrowRight } from 'react-icons/fa'

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
  const [ongoingParkings, setOngoingParkings] = useState(0)
  const navigate = useNavigate()

  const loadMetaData = async () => {
    setIsMetaLoading(true)

    try {
      const [slotsResponse, packageResponse, activeParking] = await Promise.all([
        getAvailableSlots(),
        getParkingPackages(),
        getActiveParkingRecords()
      ])

      setAvailableSlots(slotsResponse)
      setPackages(packageResponse)
      setOngoingParkings(activeParking.length)
    } catch (loadError) {
      toast.error(
        loadError?.response?.data?.message ||
          loadError?.message ||
          'Unable to load dashboard data.'
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
      <div className="flex flex-col gap-4 mt-2 sm:flex-row sm:items-end sm:justify-between mb-6">
        <h1 className="text-2xl font-extrabold text-[#071633] sm:text-3xl">Dashboard Workspace</h1>

        <button
          className="inline-flex h-10 w-fit items-center justify-center rounded-lg border border-[#b8d5f0] bg-white px-4 text-sm font-extrabold text-[#0c67d9] transition hover:border-[#0c67d9] active:translate-y-[1px]"
          onClick={loadMetaData}
          type="button"
        >
          Refresh Data
        </button>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-[#dce8f7] p-6 flex items-center justify-between hover:shadow-md transition">
          <div>
            <p className="text-sm font-bold text-[#64748b] uppercase tracking-wider mb-1">Available Slots</p>
            <h3 className="text-3xl font-black text-[#10224a]">{isMetaLoading ? '-' : availableSlots.length}</h3>
          </div>
          <div className="p-3 bg-green-50 text-green-600 rounded-lg">
            <FaMapMarkerAlt size={28} />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-[#dce8f7] p-6 flex items-center justify-between hover:shadow-md transition">
          <div>
            <p className="text-sm font-bold text-[#64748b] uppercase tracking-wider mb-1">Ongoing Parkings</p>
            <h3 className="text-3xl font-black text-[#10224a]">{isMetaLoading ? '-' : ongoingParkings}</h3>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
            <FaCar size={28} />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-[#dce8f7] p-6 flex items-center justify-between hover:shadow-md transition">
          <div>
            <p className="text-sm font-bold text-[#64748b] uppercase tracking-wider mb-1">Active Packages</p>
            <h3 className="text-3xl font-black text-[#10224a]">{isMetaLoading ? '-' : packages.length}</h3>
          </div>
          <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
            <FaTags size={28} />
          </div>
        </div>
      </div>

      {/* DETAILED WIDGETS */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-[#dce8f7] bg-white overflow-hidden shadow-sm flex flex-col">
          <div className="px-6 py-4 border-b border-[#dce8f7] flex justify-between items-center bg-[#f8fbff]">
            <h2 className="text-lg font-extrabold text-[#10224a]">Slot Availability Map</h2>
          </div>
          <div className="p-6 flex-1">
            {availableSlots.length === 0 && !isMetaLoading ? (
              <p className="text-sm font-semibold text-[#64748b] text-center py-4">No available slots.</p>
            ) : (
              <div className="flex flex-wrap gap-3">
                {availableSlots.map((slot) => (
                  <div
                    key={slot.id}
                    className="flex flex-col items-center justify-center rounded-lg border-2 border-green-200 bg-green-50 px-4 py-3 min-w-[80px]"
                  >
                    <span className="text-xs font-bold text-green-600 uppercase tracking-widest mb-1">SLOT</span>
                    <span className="text-base font-black text-green-800">
                       {slot.name || slot.id}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-[#dce8f7] bg-white overflow-hidden shadow-sm flex flex-col">
          <div className="px-6 py-4 border-b border-[#dce8f7] bg-[#f8fbff]">
            <h2 className="text-lg font-extrabold text-[#10224a]">Standard Pricing Packages</h2>
          </div>
          <div className="p-6 flex-1 max-h-[300px] overflow-y-auto">
            {packages.length === 0 && !isMetaLoading ? (
              <p className="text-sm font-semibold text-[#64748b] text-center py-4">No active packages.</p>
            ) : (
              <ul className="grid gap-3">
                {packages.map((feePackage) => (
                  <li
                    key={feePackage.id}
                    className="flex items-center justify-between rounded-xl border border-[#edf1f7] bg-[#f8fbff] px-5 py-3 hover:shadow-md transition"
                  >
                    <p className="text-base font-extrabold text-[#10224a]">
                       {feePackage.timeDuration}
                    </p>
                    <div className="text-right">
                       <p className="text-sm font-black text-[#0c67d9]">
                         {formatCurrency(getPackageFee(feePackage))}
                       </p>
                       {feePackage.offer > 0 && (
                         <span className="text-[10px] bg-red-100 text-red-600 font-bold px-2 py-0.5 rounded-full inline-block mt-1">
                           {feePackage.offer}% OFF
                         </span>
                       )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="p-6 border-t border-[#dce8f7] bg-slate-50">
             <button onClick={() => navigate('/counter/parking')} className="w-full flex items-center justify-center gap-2 bg-[#18a84b] hover:bg-[#139241] text-white font-bold py-3 rounded-xl transition shadow-[0_10px_18px_rgba(24,168,75,0.22)]">
               Go to Parking Management <FaArrowRight />
             </button>
          </div>
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
