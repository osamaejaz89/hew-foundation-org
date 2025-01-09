import { useApiQuery, useApiMutation, apiRequest } from './useApi';
import { User } from '../types/user';
import { useQueryClient } from '@tanstack/react-query';

interface ApiResponse {
  success: boolean;
  data: User[];
}

export const useUserApi = () => {
  const queryClient = useQueryClient();

  const getUsers = useApiQuery<ApiResponse>('user/list-users');
  
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
    onError: (error, variables, context: any) => {
      console.error("Verification error:", error);
      if (context?.previousUsers) {
        queryClient.setQueryData(['list-users'], context.previousUsers);
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