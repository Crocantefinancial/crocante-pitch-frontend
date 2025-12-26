import { AxiosRequestConfig } from "axios";
import { api } from "./utils";

export const HttpService = {
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const res = await api.get<T>(url, config);
    return res.data;
  },
  async post<T>(
    url: string,
    body?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const res = await api.post<T>(url, body, config);
    return res.data;
  },
  async put<T>(
    url: string,
    body?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const res = await api.put<T>(url, body, config);
    return res.data;
  },
  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const res = await api.delete<T>(url, config);
    return res.data;
  },
};
