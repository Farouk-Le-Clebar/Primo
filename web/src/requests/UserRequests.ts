import axios from "axios";
const apiUrl = window?._env_?.API_URL;

export const checkUserByMail = async (email: string) => {
  const response = await axios.post(apiUrl + "/user/check-email", { email });
  return response.data;
};

export const getUserByMail = async (email: string) => {
  const response = await axios.get(apiUrl + `/user/email/${encodeURIComponent(email)}`);
  return response.data;
};

export const checkUserByToken = async (token: string) => {
  const response = await axios.post(apiUrl + "/user/check-email", { token });
  return response.data;
};

export const getUserByToken = async (token: string) => {
  const response = await axios.get(apiUrl + `/user/${encodeURIComponent(token)}`);
  return response.data;
};
