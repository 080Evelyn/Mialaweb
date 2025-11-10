import { BASE_URL } from "@/lib/Api";
import axios from "axios";

const api = axios.create({
  baseURL: BASE_URL,
});

// ✅ intercept ALL responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.data?.statusCode === 401) {
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = "/login"; // ✅ redirect to login
    }

    return Promise.reject(error);
  }
);

export default api;
