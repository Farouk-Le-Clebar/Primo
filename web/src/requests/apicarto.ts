import axios from "axios";
const apiUrl = window?._env_?.API_URL;

export function apiCartoRequest(data: string) {
  return axios
    .get(apiUrl + `/apicarto/${data}`)
    .then((response) => response.data)
    .catch(() => {
      throw new Error("Failed to fetch data from ApiCarto API");
    });
}
