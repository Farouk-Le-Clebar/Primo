import axios from "axios";
const apiUrl = window?._env_?.API_URL;
const token = localStorage.getItem('token');

export function addOkRequest(data: string) {
    return axios
        .get(apiUrl + "/addok/search", {
            headers: {
                Authorization: `Bearer ${token}`
            },
            params: {
                q: data
            }
        })
        .then(response => response.data)
        .catch(() => {
            throw new Error('Failed to fetch data from Addok API');
        });
}

export async function addOkReverseRequest(lon: number, lat: number) {
    return axios
        .get(`${apiUrl}/addok/reverse?lon=${lon}&lat=${lat}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(response => response.data)
        .catch(() => {
            throw new Error('Failed to fetch reverse geocoding from Addok API');
        });
}