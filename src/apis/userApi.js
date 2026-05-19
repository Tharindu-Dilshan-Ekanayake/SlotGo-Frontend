import axiosInstance from './axiosInstance'

export const getUsers = async () => {
  const response = await axiosInstance.get('/users')
  return response.data?.data || response.data || []
}

export const createUser = async (payload) => {
  const response = await axiosInstance.post('/users', payload)
  return response.data
}

export const updateUser = async (id, payload) => {
  const response = await axiosInstance.patch(`/users/${id}`, payload)
  return response.data
}

export const deleteUser = async (id) => {
  const response = await axiosInstance.delete(`/users/${id}`)
  return response.data
}
