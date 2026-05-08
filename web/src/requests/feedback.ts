import axios from "axios";
const apiUrl = window?._env_?.API_URL;

export interface FeedbackPayload {
  title: string;
  description: string;
}

export const sendFeedback = async (data: FeedbackPayload) => {
  const token = localStorage.getItem("token");
  
  const response = await axios.post(`${apiUrl}/feedback`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  
  return response.data;
};

export const getAllFeedbacks = async () => {
  const token = localStorage.getItem("token");
  const response = await axios.get(`${apiUrl}/feedback/all`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const deleteFeedback = async (id: string) => {
  const token = localStorage.getItem("token");
  const response = await axios.delete(`${apiUrl}/feedback/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};