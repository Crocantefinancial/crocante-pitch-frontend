import { LocalStorageKeys, LocalStorageManager } from "@/config/localStorage";
import axios from "axios";
import ServiceError from "./errors/service-error";

export const api = axios.create({
  baseURL: "/proxy",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = LocalStorageManager.getItem(LocalStorageKeys.TOKEN);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => Promise.reject(ServiceError.fromAxiosError(err))
);
