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
