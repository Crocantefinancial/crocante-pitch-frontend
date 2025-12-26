import { HttpService } from "@/services/api/http-service";
import { ZodSchema } from "zod";

export async function getValidated<T>(
  url: string,
  schema: ZodSchema<T>
): Promise<T> {
  const data = await HttpService.get<T>(url);
  return schema.parse(data);
}

export async function postValidated<T>(
  url: string,
  data: unknown,
  schema: ZodSchema<T>
): Promise<T> {
  const responseData = await HttpService.post<T>(url, data);
  return schema.parse(responseData);
}

export async function putValidated<T>(
  url: string,
  data: unknown,
  schema: ZodSchema<T>
): Promise<T> {
  const responseData = await HttpService.put<T>(url, data);
  return schema.parse(responseData);
}
