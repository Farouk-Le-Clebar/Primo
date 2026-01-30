import axios from "axios";
const apiUrl = window?._env_?.API_URL;

export const login = async (email: string, password: string) => {
  const response = await axios.post(apiUrl + "/auth/login", { email, password });
  return response.data;
};

export const register  = async (email: string, firstName: string, surName: string, password: string) => {
  const response = await axios.post(apiUrl + "/auth/register", { email, firstName, surName, password });
  return response.data;
};

export const verifyToken = async (token: string) => {
  const response = await axios.get(apiUrl + "/auth/verify", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
