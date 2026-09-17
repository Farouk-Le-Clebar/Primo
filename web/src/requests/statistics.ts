import axios from "axios";
const apiUrl = window?._env_?.API_URL;

export const getAllStatistics = async () => {
  const token = localStorage.getItem("token");
  const response = await axios.get(`${apiUrl}/statistics/all`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getMostUsedOs = async () => {
  const token = localStorage.getItem("token");
  const response = await axios.get(`${apiUrl}/statistics/os/most-used`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getUserStatistics = async (userId: string) => {
  const token = localStorage.getItem("token");
  const response = await axios.get(`${apiUrl}/statistics/user/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};