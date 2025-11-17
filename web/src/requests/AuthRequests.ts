import axios from "axios";

export const login = async (email: string, password: string) => {
  const response = await axios.post("http://localhost:3000/auth/login", { email, password });
  return response.data;
};

export const register  = async (email: string, password: string) => {
  const response = await axios.post("http://localhost:3000/auth/register", { email, password });
  return response.data;
};

export const verifyToken = async (token: string) => {
  console.log("Token envoyé :", token);
  const response = await axios.get("http://localhost:3000/auth/verify", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  console.log("AuthRequests: Token verification result:", response.data);
  
  return response.data;
};
