import React, { useEffect, useState } from 'react'
import { FaPlus, FaRedo, FaStopCircle, FaTimes } from 'react-icons/fa'
import toast from 'react-hot-toast'
import {
  addAdditionalPackageToParking,
  createParkingRecord,
  endParkingRecord,
  getAdditionalParkingPackages,
  getActiveParkingRecords,
  getParkingPackages,
} from '../../apis/parkingApi'
import { getAvailableSlots } from '../../apis/slotApi'

const getPackageFee = (feePackage) => {
  if (!feePackage) {
    return 0
  }

  const baseFee = Number(
    feePackage.fee ?? feePackage.packagePrice ?? feePackage.package_fee ?? feePackage.price ?? 0
  )
  const discountPercent = Number(
    feePackage.discount ?? feePackage.offer ?? feePackage.discountPercent ?? feePackage.offerPercent ?? 0
  )

  return Number((baseFee - baseFee * (discountPercent / 100)).toFixed(2))
}

const getPackageDurationLabel = (feePackage) => {
  if (!feePackage) {
    return ''
  }

  const hours = Number(feePackage.hours)
  if (!Number.isNaN(hours) && hours > 0) {
    return `${hours} hour${hours === 1 ? '' : 's'}`
  }

  return feePackage.timeDuration || feePackage.duration || ''
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

const getDurationMsFromPackage = (feePackage) => {
  const raw = String(feePackage?.timeDuration || '').trim().toLowerCase()
  if (!raw) {
    return null
  }

  const value = Number.parseFloat(raw)
  if (Number.isNaN(value) || value <= 0) {
    return null
  }

  if (raw.includes('min')) {
    return value * 60 * 1000
  }

  if (raw.includes('day')) {
    return value * 24 * 60 * 60 * 1000
  }

  // Default to hours (handles "hour", "hours")
  return value * 60 * 60 * 1000
}

const escapeHtml = (value) =>
  String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')

const openReceiptPrintWindow = (parking, qrDataUrl) => {
  if (!parking?.token || !qrDataUrl) {
    return
  }

  const receiptWindow = window.open('', '_blank', 'noopener,noreferrer,width=520,height=720')
  if (!receiptWindow) {
    return
  }

  const title = 'SlotGo Parking Receipt'
  const html = `<!doctype html>
  <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>${escapeHtml(title)}</title>
      <style>
        * { box-sizing: border-box; }
        body { font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; margin: 0; padding: 18px; color: #0f172a; }
        .card { border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; }
        h1 { font-size: 18px; margin: 0 0 10px; }
        .muted { color: #475569; font-size: 12px; margin-top: 2px; }
        .row { display: flex; gap: 14px; align-items: flex-start; }
        .qr { width: 180px; min-width: 180px; }
        .qr img { width: 180px; height: 180px; border: 1px solid #e2e8f0; border-radius: 10px; display: block; }
        dl { margin: 0; }
        dt { font-size: 11px; letter-spacing: .08em; text-transform: uppercase; color: #64748b; margin-top: 10px; }
        dd { margin: 3px 0 0; font-size: 14px; font-weight: 600; color: #0f172a; word-break: break-word; }
        .token { font-size: 13px; font-weight: 700; }
        @media print {
          body { padding: 0; }
          .card { border: 0; padding: 0; }
        }
      </style>
    </head>
    <body>
      <div class="card">
        <h1>${escapeHtml(title)}</h1>
        <div class="muted">Print this page or use “Save as PDF”.</div>
        <div style="height: 14px"></div>
        <div class="row">
          <div class="qr">
            <img src="${escapeHtml(qrDataUrl)}" alt="QR Code" />
            <div class="muted" style="margin-top: 8px">Token</div>
            <div class="token">${escapeHtml(parking.token)}</div>
          </div>
          <div style="flex: 1">
            <dl>
              <dt>Vehicle Number</dt>
              <dd>${escapeHtml(parking.vehicleNumber || '-')}</dd>

              <dt>Owner Name</dt>
              <dd>${escapeHtml(parking.vehicleOwnerName || '-')}</dd>

              <dt>Owner Telephone</dt>
              <dd>${escapeHtml(parking.vehicleOwnerTelephone || '-')}</dd>

              <dt>Slot</dt>
              <dd>${escapeHtml(parking.parkingSlot?.name || parking.slotId || '-')}</dd>

              <dt>Package</dt>
              <dd>${escapeHtml(parking.feePackage?.timeDuration || parking.feePackageId || '-')}</dd>

              <dt>Parked Time</dt>
              <dd>${escapeHtml(formatDateTime(parking.parkedTime))}</dd>

              <dt>Park End Time</dt>
              <dd>${escapeHtml(formatDateTime(parking.parkEndTime))}</dd>

              <dt>Full Fees</dt>
              <dd>${escapeHtml(formatCurrency(parking.fullFees || getPackageFee(parking.feePackage)))}</dd>
            </dl>
          </div>
        </div>
      </div>
      <script>
        window.onload = () => {
          setTimeout(() => {
            window.focus();
            window.print();
          }, 50);
        };
      </script>
    </body>
  </html>`

  receiptWindow.document.open()
  receiptWindow.document.write(html)
  receiptWindow.document.close()
}

export default function CounterParking() {
  const [parkingRecords, setParkingRecords] = useState([])
  const [packages, setPackages] = useState([])
  const [availableSlots, setAvailableSlots] = useState([])
  const [additionalPackages, setAdditionalPackages] = useState([])
  const [selectedAdditionalPackages, setSelectedAdditionalPackages] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [endingId, setEndingId] = useState(null)
  const [updatingAdditionalId, setUpdatingAdditionalId] = useState(null)

  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isMetaLoading, setIsMetaLoading] = useState(false)
  const [createFormData, setCreateFormData] = useState({
    vehicleNumber: '',
    vehicleOwnerName: '',
    vehicleOwnerTelephone: '',
    slotId: '',
    feePackageId: '',
  })
  const [isCreating, setIsCreating] = useState(false)
  const [createdParking, setCreatedParking] = useState(null)
  const [qrDataUrl, setQrDataUrl] = useState('')

  const loadParkingData = async () => {
    setIsLoading(true)

    try {
      const [activeParkingRecords, activePackages, activeAdditionalPackages] = await Promise.all([
        getActiveParkingRecords(),
        getParkingPackages(),
        getAdditionalParkingPackages(),
      ])

      setParkingRecords(activeParkingRecords)
      setPackages(activePackages)
      setAdditionalPackages(Array.isArray(activeAdditionalPackages) ? activeAdditionalPackages : [])
    } catch (loadError) {
      toast.error(
        loadError?.response?.data?.message || loadError?.message || 'Unable to load parking records.'
      )
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadParkingData()
  }, [])

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

  const openCreateModal = async () => {
    setIsCreateOpen(true)
    setCreatedParking(null)
    setQrDataUrl('')
    setCreateFormData({
      vehicleNumber: '',
      vehicleOwnerName: '',
      vehicleOwnerTelephone: '',
      slotId: '',
      feePackageId: '',
    })
    await loadMetaData()
  }

  const closeCreateModal = () => {
    setIsCreateOpen(false)
    setCreatedParking(null)
    setQrDataUrl('')
    setIsCreating(false)
  }

  const handleCreateChange = (event) => {
    const { name, value } = event.target
    setCreateFormData((current) => ({ ...current, [name]: value }))
  }

  const handleCreateSubmit = async (event) => {
    event.preventDefault()
    setCreatedParking(null)
    setQrDataUrl('')

    if (!createFormData.vehicleNumber || !createFormData.slotId || !createFormData.feePackageId) {
      toast.error('Vehicle number, slot, and package are required.')
      return
    }

    const selectedPackage = packages.find(
      (feePackage) => String(feePackage.id) === String(createFormData.feePackageId)
    )
    const durationMs = getDurationMsFromPackage(selectedPackage)
    if (!durationMs) {
      toast.error('Selected package time duration is invalid.')
      return
    }

    const parkedTime = new Date()
    const parkEndTime = new Date(parkedTime.getTime() + durationMs)

    const payload = {
      vehicleNumber: createFormData.vehicleNumber.trim(),
      vehicleOwnerName: createFormData.vehicleOwnerName.trim(),
      vehicleOwnerTelephone: createFormData.vehicleOwnerTelephone.trim(),
      slotId: Number(createFormData.slotId),
      parkedTime: parkedTime.toISOString(),
      parkEndTime: parkEndTime.toISOString(),
      feePackageId: Number(createFormData.feePackageId),
    }

    setIsCreating(true)
    try {
      const parkingResponse = await createParkingRecord(payload)
      setCreatedParking(parkingResponse)

      if (parkingResponse?.token) {
        const publicWebBaseUrl = String(
          process.env.REACT_APP_PUBLIC_WEB_URL || window.location.origin || ''
        ).replace(/\/$/, '')
        const ticketUrl = `${publicWebBaseUrl}/ticket/${encodeURIComponent(parkingResponse.token)}`
        const qrcodeModule = await import('qrcode')
        const QRCode = qrcodeModule.default || qrcodeModule
        const dataUrl = await QRCode.toDataURL(ticketUrl, {
          margin: 1,
          width: 240,
        })
        setQrDataUrl(dataUrl)
      }

      toast.success('Parking record created.')
      await loadParkingData()
    } catch (submitError) {
      toast.error(
        submitError?.response?.data?.message ||
          submitError?.message ||
          'Unable to create parking record.'
      )
    } finally {
      setIsCreating(false)
    }
  }

  const handleAdditionalPackageChange = async (parking, packageId) => {
    const value = String(packageId || '')

    setSelectedAdditionalPackages((current) => ({
      ...current,
      [parking.id]: value,
    }))

    if (!value) {
      return
    }

    setUpdatingAdditionalId(parking.id)
    try {
      const updated = await addAdditionalPackageToParking(parking.id, value)

      if (updated && typeof updated === 'object' && updated.id) {
        setParkingRecords((currentRecords) =>
          currentRecords.map((record) => (record.id === updated.id ? updated : record))
        )
      } else {
        await loadParkingData()
      }

      toast.success('Additional package added.')
    } catch (error) {
      toast.error(
        error?.response?.data?.message || error?.message || 'Unable to add additional package.'
      )
    } finally {
      setUpdatingAdditionalId(null)
      setSelectedAdditionalPackages((current) => ({
        ...current,
        [parking.id]: '',
      }))
    }
  }

  const handleEndParking = async (parking) => {
    setEndingId(parking.id)

    try {
      await endParkingRecord(parking.id)
      setParkingRecords((currentRecords) =>
        currentRecords.filter((currentParking) => currentParking.id !== parking.id)
      )
      toast.success(`${parking.vehicleNumber} ended successfully.`)
    } catch (endError) {
      toast.error(
        endError?.response?.data?.message || endError?.message || 'Unable to end parking record.'
      )
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

        <div className="flex flex-wrap gap-3">
          <button
            className="inline-flex h-10 w-fit items-center justify-center gap-2 rounded-lg bg-[#18a84b] px-4 text-sm font-extrabold text-white shadow-[0_10px_18px_rgba(24,168,75,0.22)] transition hover:bg-[#139241] active:translate-y-[1px]"
            onClick={openCreateModal}
            type="button"
          >
            <FaPlus className="text-[13px]" aria-hidden="true" />
            New Park
          </button>

          <button
            className="inline-flex h-10 w-fit items-center justify-center gap-2 rounded-lg border border-[#b8d5f0] bg-white px-4 text-sm font-extrabold text-[#0c67d9] transition hover:border-[#0c67d9] active:translate-y-[1px]"
            onClick={loadParkingData}
            type="button"
          >
            <FaRedo className="text-[13px]" aria-hidden="true" />
            Refresh
          </button>
        </div>
      </div>

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
                        disabled={updatingAdditionalId === parking.id}
                        onChange={(event) => handleAdditionalPackageChange(parking, event.target.value)}
                        value={selectedAdditionalPackages[parking.id] || ''}
                      >
                        <option value="">
                          {updatingAdditionalId === parking.id ? 'Adding...' : 'Select additional time'}
                        </option>
                        {additionalPackages.map((additionalPackage) => (
                          <option key={additionalPackage.id} value={additionalPackage.id}>
                            #{additionalPackage.id} {getPackageDurationLabel(additionalPackage)} - {formatCurrency(getPackageFee(additionalPackage))}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-4 text-sm font-extrabold text-[#18a84b]">
                      {formatCurrency(parking.fullFees || getPackageFee(parking.feePackage))}
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

      {isCreateOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6 bg-black/40">
          <div className="w-full max-w-2xl overflow-hidden rounded-xl border border-[#dce8f7] bg-white shadow-[0_18px_40px_rgba(15,23,42,0.28)]">
            <div className="flex items-start justify-between gap-4 border-b border-[#edf1f7] bg-[#f8fbff] px-5 py-4">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.08em] text-[#18a84b]">New Park</p>
                <p className="mt-1 text-lg font-extrabold text-[#071633]">Create Parking</p>
                <p className="mt-1 text-xs font-semibold text-[#64748b]">
                  Fill details, save, then print QR ticket.
                </p>
              </div>

              <button
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[#b8d5f0] bg-white text-[#0c67d9] transition hover:border-[#0c67d9]"
                onClick={closeCreateModal}
                type="button"
              >
                <FaTimes aria-hidden="true" />
              </button>
            </div>

            <div className="px-5 py-5">
              {createdParking?.token ? (
                <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-start">
                  <div>
                    <p className="text-xs font-extrabold uppercase tracking-[0.08em] text-[#0c67d9]">QR Ticket</p>
                    <p className="mt-2 text-sm font-extrabold text-[#10224a]">Token</p>
                    <p className="mt-1 break-all text-sm font-semibold text-[#10224a]">
                      {createdParking.token}
                    </p>
                    <p className="mt-3 text-xs font-semibold text-[#64748b]">
                      Vehicle: {createdParking.vehicleNumber}
                    </p>
                    <p className="mt-1 text-xs font-semibold text-[#64748b]">
                      Slot: {createdParking.parkingSlot?.name || createdParking.slotId}
                    </p>
                    <p className="mt-1 text-xs font-semibold text-[#64748b]">
                      Package: {createdParking.feePackage?.timeDuration || createdParking.feePackageId}
                    </p>
                  </div>

                  <div className="flex flex-col items-start gap-3">
                    {qrDataUrl ? (
                      <img
                        alt="QR Code"
                        className="h-[180px] w-[180px] rounded-lg border border-[#cfd8ea] bg-white p-2"
                        src={qrDataUrl}
                      />
                    ) : (
                      <div className="flex h-[180px] w-[180px] items-center justify-center rounded-lg border border-[#cfd8ea] bg-white p-2">
                        <span className="text-xs font-semibold text-[#64748b]">Generating QR...</span>
                      </div>
                    )}

                    <button
                      className="inline-flex h-10 items-center justify-center rounded-lg border border-[#b8d5f0] bg-white px-5 text-sm font-extrabold text-[#0c67d9] transition hover:border-[#0c67d9] active:translate-y-[1px] disabled:cursor-not-allowed disabled:bg-[#f2f5fb]"
                      disabled={!qrDataUrl}
                      onClick={() => openReceiptPrintWindow(createdParking, qrDataUrl)}
                      type="button"
                    >
                      Print / Save as PDF
                    </button>

                    <button
                      className="inline-flex h-10 items-center justify-center rounded-lg bg-[#18a84b] px-5 text-sm font-extrabold text-white shadow-[0_10px_18px_rgba(24,168,75,0.22)] transition hover:bg-[#139241] active:translate-y-[1px]"
                      onClick={closeCreateModal}
                      type="button"
                    >
                      Close
                    </button>
                  </div>
                </div>
              ) : (
                <form className="grid gap-4 sm:grid-cols-2" onSubmit={handleCreateSubmit}>
                  <label className="grid gap-2 text-sm font-semibold text-[#1b2a4a]">
                    Vehicle Number
                    <input
                      className="h-10 rounded-lg border border-[#cfd8ea] px-3 text-sm font-medium text-[#10224a] focus:border-[#18a84b] focus:outline-none"
                      name="vehicleNumber"
                      onChange={handleCreateChange}
                      placeholder="CAB-1234"
                      required
                      value={createFormData.vehicleNumber}
                    />
                  </label>

                  <label className="grid gap-2 text-sm font-semibold text-[#1b2a4a]">
                    Owner Name
                    <input
                      className="h-10 rounded-lg border border-[#cfd8ea] px-3 text-sm font-medium text-[#10224a] focus:border-[#18a84b] focus:outline-none"
                      name="vehicleOwnerName"
                      onChange={handleCreateChange}
                      placeholder="Nimal Perera"
                      value={createFormData.vehicleOwnerName}
                    />
                  </label>

                  <label className="grid gap-2 text-sm font-semibold text-[#1b2a4a]">
                    Owner Telephone
                    <input
                      className="h-10 rounded-lg border border-[#cfd8ea] px-3 text-sm font-medium text-[#10224a] focus:border-[#18a84b] focus:outline-none"
                      name="vehicleOwnerTelephone"
                      onChange={handleCreateChange}
                      placeholder="0771234567"
                      value={createFormData.vehicleOwnerTelephone}
                    />
                  </label>

                  <label className="grid gap-2 text-sm font-semibold text-[#1b2a4a]">
                    Slot
                    <select
                      className="h-10 rounded-lg border border-[#cfd8ea] bg-white px-3 text-sm font-medium text-[#10224a] focus:border-[#18a84b] focus:outline-none disabled:bg-[#f2f5fb]"
                      disabled={isMetaLoading || availableSlots.length === 0}
                      name="slotId"
                      onChange={handleCreateChange}
                      required
                      value={createFormData.slotId}
                    >
                      <option value="">{isMetaLoading ? 'Loading slots...' : 'Select a slot'}</option>
                      {availableSlots.map((slot) => (
                        <option key={slot.id} value={slot.id}>
                          #{slot.id} {slot.name || `Slot ${slot.id}`}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="grid gap-2 text-sm font-semibold text-[#1b2a4a]">
                    Package
                    <select
                      className="h-10 rounded-lg border border-[#cfd8ea] bg-white px-3 text-sm font-medium text-[#10224a] focus:border-[#18a84b] focus:outline-none disabled:bg-[#f2f5fb]"
                      disabled={isMetaLoading || packages.length === 0}
                      name="feePackageId"
                      onChange={handleCreateChange}
                      required
                      value={createFormData.feePackageId}
                    >
                      <option value="">{isMetaLoading ? 'Loading packages...' : 'Select a package'}</option>
                      {packages.map((feePackage) => (
                        <option key={feePackage.id} value={feePackage.id}>
                          #{feePackage.id} {feePackage.timeDuration} - {formatCurrency(getPackageFee(feePackage))}
                        </option>
                      ))}
                    </select>
                  </label>

                  <div className="flex flex-wrap gap-3 sm:col-span-2">
                    <button
                      className="inline-flex h-10 items-center justify-center rounded-lg bg-[#18a84b] px-5 text-sm font-extrabold text-white shadow-[0_10px_18px_rgba(24,168,75,0.22)] transition hover:bg-[#139241] disabled:cursor-not-allowed disabled:bg-[#8bcfa4]"
                      disabled={isCreating}
                      type="submit"
                    >
                      {isCreating ? 'Saving...' : 'Save Parking'}
                    </button>

                    <button
                      className="inline-flex h-10 items-center justify-center rounded-lg border border-[#b8d5f0] bg-white px-5 text-sm font-extrabold text-[#0c67d9] transition hover:border-[#0c67d9]"
                      onClick={closeCreateModal}
                      type="button"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </section>
  )
}
