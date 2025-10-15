import axios from "axios";
const apiUrl = window?._env_?.API_URL;

export function addOkRequest(data: string) {
    return axios.get(apiUrl + `/addok/search?q=${data}`)
    .then(response => response.data)
    .catch(() => {
        throw new Error('Failed to fetch data from Addok API');
    });
}
