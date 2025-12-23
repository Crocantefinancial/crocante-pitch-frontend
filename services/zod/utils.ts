import { api } from "@/services/api/utils";
import { ZodSchema } from "zod";

export async function getValidated<T>(
  url: string,
  schema: ZodSchema<T>
): Promise<T> {
  const { data } = await api.get<T>(url);
  return schema.parse(data);
}

export async function postValidated<T>(
  url: string,
  data: unknown,
  schema: ZodSchema<T>
): Promise<T> {
  const { data: responseData } = await api.post<T>(url, data);
  return schema.parse(responseData);
}

export async function putValidated<T>(
  url: string,
  data: unknown,
  schema: ZodSchema<T>
): Promise<T> {
  const { data: responseData } = await api.put<T>(url, data);
  return schema.parse(responseData);
}
