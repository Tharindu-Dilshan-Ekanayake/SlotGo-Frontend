import axiosInstance from './axiosInstance'

const getDataList = (responseData) => {
  if (Array.isArray(responseData)) {
    return responseData
  }
  return responseData?.data || []
}

// Standard Packages
export const getPackages = async () => {
  const response = await axiosInstance.get('/packages')
  return getDataList(response.data)
}

export const createPackage = async (payload) => {
  const response = await axiosInstance.post('/packages', payload)
  return response.data
}

export const updatePackage = async (id, payload) => {
  const response = await axiosInstance.patch(`/packages/${id}`, payload)
  return response.data
}

export const deletePackage = async (id) => {
  const response = await axiosInstance.delete(`/packages/${id}`)
  return response.data
}

// Additional Packages
export const getAdditionalPackages = async () => {
  const response = await axiosInstance.get('/aditionalparking')
  return getDataList(response.data)
}

export const createAdditionalPackage = async (payload) => {
  const response = await axiosInstance.post('/aditionalparking', payload)
  return response.data
}

export const updateAdditionalPackage = async (id, payload) => {
  const response = await axiosInstance.patch(`/aditionalparking/${id}`, payload)
  return response.data
}

export const deleteAdditionalPackage = async (id) => {
  const response = await axiosInstance.delete(`/aditionalparking/${id}`)
  return response.data
}
