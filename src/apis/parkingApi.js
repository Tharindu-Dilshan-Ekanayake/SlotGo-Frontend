import axiosInstance from './axiosInstance'

const getDataList = (responseData) => {
  if (Array.isArray(responseData)) {
    return responseData
  }

  return responseData?.data || []
}

export const getActiveParkingRecords = async () => {
  const response = await axiosInstance.get('/parking')
  const parkingRecords = getDataList(response.data)

  return parkingRecords.filter((parking) => parking.end === false || parking.ongoing !== false)
}

export const getAllParkingRecords = async () => {
  const response = await axiosInstance.get('/parking')
  return getDataList(response.data)
}

export const getEndedParkingRecords = async () => {
  try {
    const response = await axiosInstance.get('/parking/ended')
    return getDataList(response.data)
  } catch (error) {
    const response = await axiosInstance.get('/parking')
    const parkingRecords = getDataList(response.data)
    return parkingRecords.filter((parking) => parking.end === true || parking.ongoing === false)
  }
}

export const getParkingPackages = async () => {
  const response = await axiosInstance.get('/packages')
  const packages = getDataList(response.data)

  return packages.filter((feePackage) => feePackage.activeStatus !== false)
}

export const endParkingRecord = async (parkingId, additionalFeePackageId) => {
  const payload = additionalFeePackageId
    ? { additionalFeePackageId: Number(additionalFeePackageId) }
    : {}
  const response = await axiosInstance.patch(`/parking/${parkingId}/end`, payload)

  return response.data
}

export const createParkingRecord = async (payload) => {
  const response = await axiosInstance.post('/parking', payload)

  return response.data
}

export const getAdditionalParkingPackages = async () => {
  const candidateUrls = ['/aditionalparking', '/additionalparking', '/additional-parking']

  let lastError
  for (const url of candidateUrls) {
    try {
      const response = await axiosInstance.get(url)
      return getDataList(response.data)
    } catch (error) {
      lastError = error
    }
  }

  throw lastError || new Error('Unable to load additional parking packages.')
}

export const addAdditionalPackageToParking = async (parkingId, additionalPackageId) => {
  const normalizedParkingId = Number(parkingId)
  const normalizedPackageId = Number(additionalPackageId)

  if (!normalizedParkingId) {
    throw new Error('Missing parking id.')
  }
  if (!normalizedPackageId) {
    throw new Error('Missing additional package id.')
  }

  const candidatePayloads = [
    { additionalPackageId: normalizedPackageId },
    { additionalFeePackageId: normalizedPackageId },
    { additionalParkingPackageId: normalizedPackageId },
  ]

  let lastError
  for (const payload of candidatePayloads) {
    try {
      const response = await axiosInstance.patch(
        `/parking/${normalizedParkingId}/additional-package`,
        payload
      )
      return response.data
    } catch (error) {
      lastError = error
    }
  }

  throw lastError || new Error('Unable to add additional package.')
}
