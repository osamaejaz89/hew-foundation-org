import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { apiRequest } from './useApi';

interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  refreshToken: string;
  user: {
    _id: string;
    email: string;
    name: string;
    type: string;
    status: string;
  };
}

export const useLogin = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const response = await apiRequest<LoginResponse>('/auth/login', 'POST', credentials);
      console.log('Login Response:', response);
      return response;
    },
    onSuccess: (response) => {
      try {
        // Store tokens
        localStorage.setItem('authToken', response.token);
        
        // Create user object with exact structure needed for navbar
        const userToStore = {
          name: response.user.name || 'Admin',
          role: response.user.type || 'Administrator'
        };
        
        // Store user data
        localStorage.setItem('user', JSON.stringify(userToStore));
        
        // Force a page reload to ensure all components update
        window.location.href = '/home';
        
        toast.success('Login successful!');
      } catch (error) {
        console.error('Storage error:', error);
        toast.error('Error storing user data');
      }
    },
    onError: (error: any) => {
      console.error('Login error:', error);
      toast.error(error.response?.data?.message || 'Login failed');
    },
  });
}; 