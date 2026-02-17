import { useApiQuery, useApiMutation, apiRequest } from './useApi';
import { User } from '../types/user';
import { useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';

// Manual refresh only — no auto polling (saves bandwidth)
const USERS_STALE_MS = 5 * 60 * 1000;
const USERS_CACHE_MS = 15 * 60 * 1000;

interface ApiResponse {
  success: boolean;
  data: User[];
}

interface ErrorWithPreviousUsers extends AxiosError {
  previousUsers?: any;
}

export const useUserApi = () => {
  const queryClient = useQueryClient();

  const getUsers = useApiQuery<ApiResponse>('user/list-users', {
    refetchInterval: false,
    refetchOnWindowFocus: false,
    staleTime: USERS_STALE_MS,
    cacheTime: USERS_CACHE_MS,
  });
  
  const deleteUser = useApiMutation<ApiResponse>('users', {
    mutationFn: (id: string) => apiRequest(`users/${id}`, 'DELETE')
  });
  
  const addUser = useApiMutation<ApiResponse>('users', {
    mutationFn: (data: Partial<User>) => apiRequest('users', 'POST', data)
  });
  
  const updateUser = useApiMutation<ApiResponse>('users', {
    mutationFn: (data: { id: string; [key: string]: any }) => 
      apiRequest(`users/${data.id}`, 'PUT', data)
  });

  const verifyUser = useApiMutation<ApiResponse>('users', {
    mutationFn: (id: string) => {
      console.log("Making verify API call for ID:", id);
      return apiRequest(`user/verify/${id}`, 'PATCH', { 
        isApproved: true 
      });
    },
    onSuccess: (data) => {
      console.log("Verification success:", data);
      queryClient.invalidateQueries(['list-users']);
    },
    onError: (error: ErrorWithPreviousUsers) => {
      console.error("Error:", error);
      if (error?.previousUsers) {
        queryClient.setQueryData(['list-users'], error.previousUsers);
      }
    }
  });

  return {
    getUsers,
    deleteUser,
    addUser,
    updateUser,
    verifyUser,
  };
}; 