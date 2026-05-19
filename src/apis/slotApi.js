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

export const getSlots = async () => {
  const response = await axiosInstance.get('/slots')
  return getDataList(response.data)
}

export const createSlot = async (payload) => {
  const response = await axiosInstance.post('/slots', payload)
  return response.data
}

export const updateSlot = async (id, payload) => {
  const response = await axiosInstance.patch(`/slots/${id}`, payload)
  return response.data
}

export const deleteSlot = async (id) => {
  const response = await axiosInstance.delete(`/slots/${id}`)
  return response.data
}
