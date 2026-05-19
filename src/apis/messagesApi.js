import axiosInstance from './axiosInstance';

export const createMessage = async (payload) => {
  const response = await axiosInstance.post('/messages', payload);
  return response.data;
};

export const getMessages = async () => {
  const response = await axiosInstance.get('/messages');
  return response.data;
};

export const deleteMessage = async (id) => {
  const response = await axiosInstance.delete(`/messages/${id}`);
  return response.data;
};
