import axios from "axios";
const apiUrl = window?._env_?.API_URL;

export function verifyEmail(token: string) {
    return axios.post(apiUrl + `/mail/verify`, { token })
        .then(response => response.data)
        .catch(error => {
            throw new Error(error.response?.data?.message);
        });
}

export function sendResetPasswordEmail(email: string) {
    return axios.post(apiUrl + `/user/send/reset-password`, { email })
        .then(response => response.data)
        .catch(error => {
            throw new Error(error.response?.data?.message);
        });
}

export function resetPassword(token: string, password: string) {
    return axios.post(apiUrl + `/user/reset-password`, { token, password })
        .then(response => response.data)
        .catch(error => {
            throw new Error(error.response?.data?.message);
        });
}

export function isValidRequestResetPassword(token: string) {
    return axios.post(apiUrl + `/user/reset-password/valid`, { token })
        .then(response => response.data)
        .catch(error => {
            throw new Error(error.response?.data?.message);
        });
}

export function sendVerificationEmail(email: string) {
    return axios.post(apiUrl + `/mail/send/verification`, { email }, {
    })
}