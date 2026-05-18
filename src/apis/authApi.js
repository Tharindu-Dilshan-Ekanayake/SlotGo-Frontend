import publicApi from "./publicApi";

//login api
export const login = async (email, password) => {
  try {
    const response = await publicApi.post("/auth/login", { email, password });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Network Error");
  }
};