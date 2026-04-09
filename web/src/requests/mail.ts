import axios from "axios";
const apiUrl = window?._env_?.API_URL;

export function verifyEmail(token: string) {
    return axios.post(apiUrl + `/mail/verify`, { token })
    .then(response => response.data)
    .catch(error => {
        throw new Error(error.response?.data?.message);
    });
}

export function sendVerificationEmail(email: string) {
    return axios.post(apiUrl + `/mail/send/verification`, {email}, {
    })
}