import axios from "axios";

const apiUrl = window?._env_?.API_URL || import.meta.env.VITE_API_URL;

export const computeProximite = async (
  geometry: unknown,
  types: string[],
  signal: AbortSignal,
): Promise<unknown> => {
  const response = await axios.post(
    `${apiUrl}/proximite/compute`,
    { geometry, types },
    {
      signal,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    },
  );
  return response.data;
};
