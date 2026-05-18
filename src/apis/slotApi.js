import axiosInstance from './axiosInstance'

const getDataList = (responseData) => {
  if (Array.isArray(responseData)) {
    return responseData
  }

  return responseData?.data || []
}

export const getAvailableSlots = async () => {
  const response = await axiosInstance.get('/slots/available')
  return getDataList(response.data)
}
