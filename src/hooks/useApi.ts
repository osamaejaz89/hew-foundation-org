import {
  useMutation,
  useQuery,
  UseMutationOptions,
  UseQueryOptions,
} from "@tanstack/react-query";
import axios, { AxiosError, AxiosResponse } from "axios";
import { env } from '../config/env.config';

// Get the base API URL from environment variables
const BASE_URL = env.API_URL;

// Utility to handle the API request
export const apiRequest = async <T>(
  endpoint: string,
  method: string,
  data?: any
): Promise<T> => {
  try {
    const token = localStorage.getItem("authToken");
    const fullUrl = endpoint.startsWith('http') 
      ? endpoint 
      : `${BASE_URL}/${endpoint}`;

    const response: AxiosResponse<T> = await axios({
      method,
      url: fullUrl,
      data,
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "An error occurred");
  }
};

// API hook for querying data (GET requests)
export const useApiQuery = <T>(
  endpoint: string,
  options: UseQueryOptions<T, AxiosError> = {}
) => {
  return useQuery<T, AxiosError>({
    queryKey: [endpoint],
    queryFn: () => apiRequest<T>(endpoint, "GET"),
    ...options
  });
};

// API hook for mutations (POST, PUT, DELETE requests)
export const useApiMutation = <T>(
  endpoint: string,
  options: UseMutationOptions<T, AxiosError, any> = {}
) => {
  return useMutation<T, AxiosError, any>({
    ...options,
    mutationFn: options.mutationFn || ((data) => apiRequest<T>(endpoint, options.method || "POST", data))
  });
};

export const useApiMutationPut = <T>(
  endpoint: string,
  options: UseMutationOptions<T, AxiosError, any, unknown> = {}
) => {
  return useMutation<T, AxiosError, any>(
    (data) => apiRequest<T>(endpoint, "PUT", data),
    options
  );
};

export const useApiMutationDelete = <T>(
  endpoint: string,
  options: UseMutationOptions<T, AxiosError, any, unknown> = {}
) => {
  return useMutation<T, AxiosError, any>(
    (data) => apiRequest<T>(endpoint, "DELETE", data),
    options
  );
};

export const useApiMutationPatch = <T>(
  endpoint: string,
  options: UseMutationOptions<T, AxiosError, any, unknown> = {}
) => {
  return useMutation<T, AxiosError, any>(
    (data) => apiRequest<T>(endpoint, "PATCH", data),
    options
  );
};
