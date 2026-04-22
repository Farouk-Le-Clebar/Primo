import axios from "axios";
const apiUrl = window?._env_?.API_URL;

export function addOkRequest(data: string) {
    return axios.get(apiUrl + `/addok/search?q=${data}`)
    .then(response => response.data)
    .catch(() => {
        throw new Error('Failed to fetch data from Addok API');
    });
}

export async function addOkReverseRequest(lon: number, lat: number) {
    try {
        const response = await axios.get(`${apiUrl}/addok/reverse?lon=${lon}&lat=${lat}`);
        return response.data;
    } catch (error) {
        console.error('❌ [Addok] Failed to fetch reverse geocoding from internal API', error);
        return null;
    }
}