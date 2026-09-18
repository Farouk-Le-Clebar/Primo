import axios from "axios";

const apiUrl = window?._env_?.API_URL || "http://localhost:3000";
const token = localStorage.getItem("token");

export const getDvfParcelle = async (idParcelle: string) => {
  try {
    const response = await axios.get(`${apiUrl}/dvf/parcelle/${idParcelle}`, {
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