import axios from "axios";
import ServiceError from "./errors/service-error";

/**
 * All requests go through the BFF proxy. Session is HttpOnly cookie;
 * BFF injects Bearer token for /proxy/private/*. No token in client.
 */
export const api = axios.create({
  baseURL: "/proxy",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

api.interceptors.response.use(
  (res) => res,
  (err) => Promise.reject(ServiceError.fromAxiosError(err))
);

/**
 * Axios client for BFF auth routes only. Sends/receives HttpOnly cookie;
 * no Authorization header. Use for login and logout.
 */
export const authApi = axios.create({
  baseURL: "",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

authApi.interceptors.response.use(
  (res) => res,
  (err) => Promise.reject(ServiceError.fromAxiosError(err))
);
