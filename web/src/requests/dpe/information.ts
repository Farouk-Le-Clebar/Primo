import axios from "axios";

const apiUrl = window?._env_?.API_URL || "http://localhost:3000";
const token = localStorage.getItem("token");

export const getDpeBan = async (identifiantBan: string) => {
  try {
    const response = await axios.get(`${apiUrl}/dpe/ban/${identifiantBan}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.status === 404) {
      return null;
    }
    throw error;
  }
};