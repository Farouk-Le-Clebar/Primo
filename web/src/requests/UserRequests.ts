import axios from "axios";
const apiUrl = window?._env_?.API_URL;
const token = localStorage.getItem("token");

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
    .put(
      `${apiUrl}/user/map`,
      { mapPreference: mapType },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
    .then((response) => response.data)
  .catch((error) => {
    console.error("Error changing map preference:", error);
    throw error;
  });
}