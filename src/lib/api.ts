import axios from "axios";
import { getToken, removeToken } from "@/lib/token";

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 2000;

export const api = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      removeToken();
      window.dispatchEvent(new CustomEvent("service:ready"));
      window.dispatchEvent(new CustomEvent("auth:expired"));
      return Promise.reject(error);
    }

    const config = error.config;

    // Single retry on 500 — covers transient server errors
    if (error.response?.status === 500 && !config._retried500) {
      config._retried500 = true;
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return api(config);
    }

    // Retry on 503 — handles backend cold start
    if (error.response?.status === 503) {
      config._retries = (config._retries ?? 0) + 1;
      if (config._retries <= MAX_RETRIES) {
        if (config._retries === 1) {
          window.dispatchEvent(new CustomEvent("service:waking"));
        }
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
        try {
          const response = await api(config);
          window.dispatchEvent(new CustomEvent("service:ready"));
          return response;
        } catch (retryError) {
          return Promise.reject(retryError);
        }
      }
      // All retries exhausted
      window.dispatchEvent(new CustomEvent("service:failed"));
    }

    return Promise.reject(error);
  }
);
