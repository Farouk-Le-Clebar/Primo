import axios from "axios";

export const checkUserByMail = async (email: string) => {
  const response = await axios.post("http://localhost:3000/user/check-email", { email });
  return response.data;
};

export const getUserByMail = async (email: string) => {
  const response = await axios.get(`http://localhost:3000/user/email/${encodeURIComponent(email)}`);
  return response.data;
};

export const checkUserByToken = async (token: string) => {
  const response = await axios.post("http://localhost:3000/user/check-email", { token });
  return response.data;
};

export const getUserByToken = async (token: string) => {
  const response = await axios.get(`http://localhost:3000/user/${encodeURIComponent(token)}`);
  return response.data;
};
