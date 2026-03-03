import axios from "axios";

const apiUrl = window?._env_?.API_URL;
const token = localStorage.getItem("token");

export const getUsers = async (from: number, to: number) => {
  return axios.get(`${apiUrl}/user/${from}/${to}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  .then((response) => response.data)
  .catch((error) => {
    console.error("Error getting users:", error);
    throw error;
  });
}
