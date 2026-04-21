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

export const deleteUser = async (userId: string) => {
  return axios.post(`${apiUrl}/user/admin/delete`, { userId }, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
    .then((response) => response.data)
    .catch((error) => {
      console.error("Error deleting user:", error);
      throw error;
    });
}

export const searchUsers = async (query: string) => {
  return axios.get(`${apiUrl}/user/admin/search/${query}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
    .then((response) => response.data)
    .catch((error) => {
      console.error("Error searching users:", error);
      throw error;
    });
}

export const getAdmins = async () => {
  return axios.get(`${apiUrl}/user/admin`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
    .then((response) => response.data)
    .catch((error) => {
      console.error("Error getting admins:", error);
      throw error;
    });
}

export const removeAdminPermission = async (userId: string) => {
  return axios.delete(`${apiUrl}/user/admin/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
    .then((response) => response.data)
    .catch((error) => {
      console.error("Error removing admin permission:", error);
      throw error;
    });
}

export const addAdminPermission = async (email: string) => {
  return axios.put(`${apiUrl}/user/admin/${email}`, {}, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
    .then((response) => response.data)
    .catch((error) => {
      console.error("Error adding admin permission:", error);
      throw error;
    });
}