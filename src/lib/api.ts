import axios from "axios";

export const API_ROOT = "http://localhost:9999";
export const API_BASE = `${API_ROOT}/api`;

export const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.response?.data ||
      error?.message ||
      "API 요청 중 오류가 발생했습니다.";

    return Promise.reject(new Error(String(message)));
  }
);

export default api;