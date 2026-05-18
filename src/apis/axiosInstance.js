// src/api/axiosInstance.js
import axios from "axios";
import API_BASE_URL from "./apiBaseUrl";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL
});

// add token automatically
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default axiosInstance;
