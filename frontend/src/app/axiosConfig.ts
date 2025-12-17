import axios from "axios";
import { toast } from "react-toastify";

const BASE_URL = import.meta.env.PROD
  ? import.meta.env.VITE_API_URL
  : "http://localhost:3000";

const axiosConfig = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

const refreshInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

const getFromLocalStorage = (key: string): string | null => {
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      return localStorage.getItem(key);
    }
  } catch (error) {
    console.warn("localStorage access failed:", error);
  }
  return null;
};

const setToLocalStorage = (key: string, value: string): void => {
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      localStorage.setItem(key, value);
    }
  } catch (error) {
    console.warn("localStorage write failed:", error);
  }
};

export const removeFromLocalStorage = (key: string): void => {
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      localStorage.removeItem(key);
    }
  } catch (error) {
    console.warn("localStorage remove failed:", error);
  }
};

axiosConfig.interceptors.request.use(
  (config) => {
    const user = getFromLocalStorage("user");
    if (user) {
      try {
        const { token } = JSON.parse(user);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.warn("Failed to parse user from localStorage:", error);
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosConfig.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      console.log("401 error detected, attempting refresh...");
      originalRequest._retry = true;

      try {
        const { data } = await refreshInstance.post("/api/v1/refresh-token");

        const userStr = getFromLocalStorage("user");
        if (userStr && data.token) {
          const user = JSON.parse(userStr);
          user.token = data.token;
          setToLocalStorage("user", JSON.stringify(user));

          axiosConfig.defaults.headers.common["Authorization"] =
            `Bearer ${data.token}`;
          originalRequest.headers.Authorization = `Bearer ${data.token}`;
          return axiosConfig(originalRequest);
        }
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        removeFromLocalStorage("user");
        removeFromLocalStorage("refreshToken");

        if (typeof toast !== "undefined") {
          toast.error("Session expired. Please log in again.");
        }
      }
    }

    return Promise.reject(error);
  }
);

export default axiosConfig;
