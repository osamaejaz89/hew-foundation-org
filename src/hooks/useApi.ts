import {
  useMutation,
  useQuery,
  UseMutationOptions,
  UseQueryOptions,
} from "@tanstack/react-query";
import axios, { AxiosError, AxiosResponse } from "axios";

// Get the base API URL from environment variables
const BASE_URL = "http://10.7.11.207:3300/api/";
// console.log("BASE_URL", BASE_URL);

// Utility to handle the API request
const apiRequest = async <T>(
  url: string,
  method: string,
  data?: any
): Promise<T> => {
  try {
    const response: AxiosResponse<T> = await axios({
      method,
      url: `${BASE_URL}${url}`,
      data,
    });
    return response.data;
  } catch (error: any) {
    // Handle error and throw it
    throw new Error(error?.response?.data?.message || "An error occurred");
  }
};

// API hook for querying data (GET requests)
export const useApiQuery = <T>(
  endpoint: string,
  options: UseQueryOptions<T, AxiosError> = {}
) => {
  return useQuery<T, AxiosError>(
    [endpoint],
    () => apiRequest<T>(endpoint, "GET"),
    options
  );
};

// API hook for mutations (POST, PUT, DELETE requests)
export const useApiMutation = <T>(
  endpoint: string,
  options: UseMutationOptions<T, AxiosError, any, unknown> = {}
) => {
  return useMutation<T, AxiosError, any>(
    (data) => apiRequest<T>(endpoint, "POST", data),
    options
  );
};
