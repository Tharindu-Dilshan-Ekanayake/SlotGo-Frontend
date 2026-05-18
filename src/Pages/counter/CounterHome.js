import React, { useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import CounterNav from '../../components/CounterNav'
import CounterParking from './CounterParking'
import { createParkingRecord } from '../../apis/parkingApi'

function RegisterHome() {
  const [formData, setFormData] = useState({
    vehicleNumber: '',
    vehicleOwnerName: '',
    vehicleOwnerTelephone: '',
    slotId: '',
    parkedTime: '',
    parkEndTime: '',
    feePackageId: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value }))
  }

  const toIsoString = (value) => {
    if (!value) {
      return null
    }

    const parsed = new Date(value)
    if (Number.isNaN(parsed.getTime())) {
      return null
    }

    return parsed.toISOString()
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setSuccess('')

    if (!formData.vehicleNumber || !formData.slotId || !formData.feePackageId) {
      setError('Vehicle number, slot ID, and fee package are required.')
      return
    }

    const payload = {
      vehicleNumber: formData.vehicleNumber.trim(),
      vehicleOwnerName: formData.vehicleOwnerName.trim(),
      vehicleOwnerTelephone: formData.vehicleOwnerTelephone.trim(),
      slotId: Number(formData.slotId),
      parkedTime: toIsoString(formData.parkedTime),
      parkEndTime: toIsoString(formData.parkEndTime),
      feePackageId: Number(formData.feePackageId),
    }

    setIsSubmitting(true)
    try {
      await createParkingRecord(payload)
      setSuccess('Parking record created.')
      setFormData({
        vehicleNumber: '',
        vehicleOwnerName: '',
        vehicleOwnerTelephone: '',
        slotId: '',
        parkedTime: '',
        parkEndTime: '',
        feePackageId: '',
      })
    } catch (submitError) {
      setError(submitError?.response?.data?.message || submitError?.message || 'Unable to create parking record.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section>
      <p className="text-xs font-extrabold uppercase tracking-[0.08em] text-[#18a84b]">Counter</p>
      <h1 className="mt-2 text-2xl font-extrabold text-[#071633] sm:text-3xl">Home Register</h1>

      <div className="mt-6 rounded-lg border border-[#dce8f7] bg-white p-5 shadow-[0_12px_28px_rgba(15,23,42,0.08)]">
        <h2 className="text-lg font-extrabold text-[#10224a]">Vehicle Register</h2>
        <p className="mt-2 text-sm font-medium leading-6 text-[#64748b]">
          Create a parking record using the /parking API.
        </p>

        {error ? (
          <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-600">
            {error}
          </p>
        ) : null}

        {success ? (
          <p className="mt-4 rounded-lg border border-[#bfe8ce] bg-[#e8f9ed] px-3 py-2 text-sm font-semibold text-[#12823a]">
            {success}
          </p>
        ) : null}

        <form className="mt-5 grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit}>
          <label className="grid gap-2 text-sm font-semibold text-[#1b2a4a]">
            Vehicle Number
            <input
              className="h-10 rounded-lg border border-[#cfd8ea] px-3 text-sm font-medium text-[#10224a] focus:border-[#18a84b] focus:outline-none"
              name="vehicleNumber"
              onChange={handleChange}
              placeholder="CAB-1234"
              required
              value={formData.vehicleNumber}
            />
          </label>

          <label className="grid gap-2 text-sm font-semibold text-[#1b2a4a]">
            Owner Name
            <input
              className="h-10 rounded-lg border border-[#cfd8ea] px-3 text-sm font-medium text-[#10224a] focus:border-[#18a84b] focus:outline-none"
              name="vehicleOwnerName"
              onChange={handleChange}
              placeholder="Nimal Perera"
              value={formData.vehicleOwnerName}
            />
          </label>

          <label className="grid gap-2 text-sm font-semibold text-[#1b2a4a]">
            Owner Telephone
            <input
              className="h-10 rounded-lg border border-[#cfd8ea] px-3 text-sm font-medium text-[#10224a] focus:border-[#18a84b] focus:outline-none"
              name="vehicleOwnerTelephone"
              onChange={handleChange}
              placeholder="0771234567"
              value={formData.vehicleOwnerTelephone}
            />
          </label>

          <label className="grid gap-2 text-sm font-semibold text-[#1b2a4a]">
            Slot ID
            <input
              className="h-10 rounded-lg border border-[#cfd8ea] px-3 text-sm font-medium text-[#10224a] focus:border-[#18a84b] focus:outline-none"
              name="slotId"
              onChange={handleChange}
              placeholder="1"
              required
              type="number"
              value={formData.slotId}
            />
          </label>

          <label className="grid gap-2 text-sm font-semibold text-[#1b2a4a]">
            Parked Time
            <input
              className="h-10 rounded-lg border border-[#cfd8ea] px-3 text-sm font-medium text-[#10224a] focus:border-[#18a84b] focus:outline-none"
              name="parkedTime"
              onChange={handleChange}
              type="datetime-local"
              value={formData.parkedTime}
            />
          </label>

          <label className="grid gap-2 text-sm font-semibold text-[#1b2a4a]">
            Park End Time
            <input
              className="h-10 rounded-lg border border-[#cfd8ea] px-3 text-sm font-medium text-[#10224a] focus:border-[#18a84b] focus:outline-none"
              name="parkEndTime"
              onChange={handleChange}
              type="datetime-local"
              value={formData.parkEndTime}
            />
          </label>

          <label className="grid gap-2 text-sm font-semibold text-[#1b2a4a]">
            Fee Package ID
            <input
              className="h-10 rounded-lg border border-[#cfd8ea] px-3 text-sm font-medium text-[#10224a] focus:border-[#18a84b] focus:outline-none"
              name="feePackageId"
              onChange={handleChange}
              placeholder="1"
              required
              type="number"
              value={formData.feePackageId}
            />
          </label>

          <div className="sm:col-span-2">
            <button
              className="inline-flex h-10 items-center justify-center rounded-lg bg-[#18a84b] px-5 text-sm font-extrabold text-white shadow-[0_10px_18px_rgba(24,168,75,0.2)] transition hover:bg-[#139241] disabled:cursor-not-allowed disabled:bg-[#8bcfa4]"
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ? 'Saving...' : 'Create Parking'}
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}

export default function CounterHome() {
  return (
    <div className="min-h-screen bg-[#f4f8ff] text-[#071633]">
      <CounterNav />

      <main className="px-5 py-6 sm:px-8 lg:ml-72 lg:px-10">
        <div className="mx-auto max-w-6xl">
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
