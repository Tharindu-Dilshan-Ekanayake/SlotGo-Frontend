import React, { useEffect, useMemo, useState } from 'react'
import { FaCheckCircle, FaRedo, FaStopCircle } from 'react-icons/fa'
import {
  endParkingRecord,
  getActiveParkingRecords,
  getParkingPackages,
} from '../../apis/parkingApi'

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

const formatDateTime = (value) => {
  if (!value) {
    return '-'
  }

  return new Date(value).toLocaleString()
}

export default function CounterParking() {
  const [parkingRecords, setParkingRecords] = useState([])
  const [packages, setPackages] = useState([])
  const [selectedPackages, setSelectedPackages] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [endingId, setEndingId] = useState(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const packageById = useMemo(
    () =>
      packages.reduce((packageMap, feePackage) => {
        packageMap[String(feePackage.id)] = feePackage
        return packageMap
      }, {}),
    [packages]
  )

  const loadParkingData = async () => {
    setError('')
    setIsLoading(true)

    try {
      const [activeParkingRecords, activePackages] = await Promise.all([
        getActiveParkingRecords(),
        getParkingPackages(),
      ])

      setParkingRecords(activeParkingRecords)
      setPackages(activePackages)
    } catch (loadError) {
      setError(loadError?.response?.data?.message || loadError?.message || 'Unable to load parking records.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadParkingData()
  }, [])

  const handlePackageChange = (parkingId, packageId) => {
    setSelectedPackages((currentPackages) => ({
      ...currentPackages,
      [parkingId]: packageId,
    }))
  }

  const getTotalFee = (parking) => {
    const selectedPackage = packageById[String(selectedPackages[parking.id])]
    const baseFee = Number(parking.fullFees || getPackageFee(parking.feePackage))
    const additionalFee = getPackageFee(selectedPackage)

    return baseFee + additionalFee
  }

  const handleEndParking = async (parking) => {
    setError('')
    setSuccess('')
    setEndingId(parking.id)

    try {
      await endParkingRecord(parking.id, selectedPackages[parking.id])
      setParkingRecords((currentRecords) =>
        currentRecords.filter((currentParking) => currentParking.id !== parking.id)
      )
      setSuccess(`${parking.vehicleNumber} ended and moved to endparking log.`)
    } catch (endError) {
      setError(endError?.response?.data?.message || endError?.message || 'Unable to end parking record.')
    } finally {
      setEndingId(null)
    }
  }

  return (
    <section>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.08em] text-[#0c67d9]">Counter</p>
          <h1 className="mt-2 text-2xl font-extrabold text-[#071633] sm:text-3xl">Parking</h1>
        </div>

        <button
          className="inline-flex h-10 w-fit items-center justify-center gap-2 rounded-lg border border-[#b8d5f0] bg-white px-4 text-sm font-extrabold text-[#0c67d9] transition hover:border-[#0c67d9] active:translate-y-[1px]"
          onClick={loadParkingData}
          type="button"
        >
          <FaRedo className="text-[13px]" aria-hidden="true" />
          Refresh
        </button>
      </div>

      {error ? (
        <p className="mt-5 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-600">
          {error}
        </p>
      ) : null}

      {success ? (
        <p className="mt-5 inline-flex items-center gap-2 rounded-lg border border-[#bfe8ce] bg-[#e8f9ed] px-3 py-2 text-sm font-semibold text-[#12823a]">
          <FaCheckCircle className="text-[14px]" aria-hidden="true" />
          {success}
        </p>
      ) : null}

      <div className="mt-6 overflow-hidden rounded-lg border border-[#dce8f7] bg-white shadow-[0_12px_28px_rgba(15,23,42,0.08)]">
        <div className="overflow-x-auto">
          <table className="min-w-[900px] w-full border-collapse text-left">
            <thead className="bg-[#eef6ff] text-xs font-extrabold uppercase text-[#536582]">
              <tr>
                <th className="px-4 py-3">Vehicle</th>
                <th className="px-4 py-3">Owner</th>
                <th className="px-4 py-3">Slot</th>
                <th className="px-4 py-3">Parked Time</th>
                <th className="px-4 py-3">Package</th>
                <th className="px-4 py-3">Additional Time</th>
                <th className="px-4 py-3">Full Fee</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#edf1f7]">
              {isLoading ? (
                <tr>
                  <td className="px-4 py-6 text-sm font-semibold text-[#64748b]" colSpan="8">
                    Loading parking records...
                  </td>
                </tr>
              ) : parkingRecords.length === 0 ? (
                <tr>
                  <td className="px-4 py-6 text-sm font-semibold text-[#64748b]" colSpan="8">
                    No active parking records.
                  </td>
                </tr>
              ) : (
                parkingRecords.map((parking) => (
                  <tr key={parking.id} className="align-top">
                    <td className="px-4 py-4">
                      <span className="block text-sm font-extrabold text-[#10224a]">
                        {parking.vehicleNumber}
                      </span>
                      <span className="mt-1 block text-xs font-semibold text-[#7c8aa8]">
                        {parking.token || `#${parking.id}`}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="block text-sm font-bold text-[#10224a]">
                        {parking.vehicleOwnerName || '-'}
                      </span>
                      <span className="mt-1 block text-xs font-semibold text-[#7c8aa8]">
                        {parking.vehicleOwnerTelephone}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm font-bold text-[#10224a]">
                      {parking.parkingSlot?.name || parking.slotId}
                    </td>
                    <td className="px-4 py-4 text-sm font-semibold text-[#536582]">
                      {formatDateTime(parking.parkedTime)}
                    </td>
                    <td className="px-4 py-4">
                      <span className="block text-sm font-bold text-[#10224a]">
                        {parking.feePackage?.timeDuration || `Package ${parking.feePackageId}`}
                      </span>
                      <span className="mt-1 block text-xs font-semibold text-[#7c8aa8]">
                        {formatCurrency(parking.fullFees || getPackageFee(parking.feePackage))}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <select
                        className="h-10 w-full min-w-[190px] rounded-lg border border-[#b8d5f0] bg-white px-3 text-sm font-bold text-[#10224a] outline-none focus:border-[#18a84b] focus:ring-4 focus:ring-[#18a84b]/15"
                        onChange={(event) => handlePackageChange(parking.id, event.target.value)}
                        value={selectedPackages[parking.id] || ''}
                      >
                        <option value="">No additional time</option>
                        {packages.map((feePackage) => (
                          <option key={feePackage.id} value={feePackage.id}>
                            #{feePackage.id} {feePackage.timeDuration} - {formatCurrency(getPackageFee(feePackage))}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-4 text-sm font-extrabold text-[#18a84b]">
                      {formatCurrency(getTotalFee(parking))}
                    </td>
                    <td className="px-4 py-4">
                      <button
                        className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#18a84b] px-4 text-sm font-extrabold text-white shadow-[0_10px_18px_rgba(24,168,75,0.22)] transition hover:bg-[#139241] active:translate-y-[1px] disabled:cursor-not-allowed disabled:bg-[#8bcfa4]"
                        disabled={endingId === parking.id}
                        onClick={() => handleEndParking(parking)}
                        type="button"
                      >
                        <FaStopCircle className="text-[14px]" aria-hidden="true" />
                        {endingId === parking.id ? 'Ending...' : 'End'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
