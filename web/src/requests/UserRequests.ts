import axios from "axios";

const apiUrl = window?._env_?.API_URL;

const getHeaders = () => {
  return {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  };
};

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

export const updateUserProfile = async (token: string, profileData: any) => {
  const response = await axios.put(`${apiUrl}/user/profile`, profileData, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
}

export const changeMapPreference = async (mapType: string) => {
  return axios
    .put(`${apiUrl}/user/map`, { mapPreference: mapType }, getHeaders())
    .then((response) => response.data)
    .catch((error) => {
      console.error("Error changing map preference:", error);
      throw error;
    });
}

export const checkAdminStatus = async () => {
  return axios.get(`${apiUrl}/user/is-admin`, getHeaders())
    .then((response) => response.data)
    .catch((error) => {
      console.error("Error checking admin status:", error);
      throw error;
    });
}

export const getUserSearchHistory = async () => {
  const response = await axios.get(`${apiUrl}/user/search-history/all`, getHeaders());
  return response.data;
};

export const saveUserSearchHistory = async (label: string, lat: number, lng: number) => {
  const response = await axios.post(`${apiUrl}/user/search-history`, { label, lat, lng }, getHeaders());
  return response.data;
};