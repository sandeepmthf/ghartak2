import { API_ENDPOINTS } from '../config/api';
import { post, get, patch } from './api';

export interface SignupData {
  name: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: {
      id: string;
      name: string;
      email: string;
      createdAt: string;
      updatedAt: string;
    };
    token: string;
  };
}

export interface ProfileResponse {
  success: boolean;
  data: {
    id: string;
    name: string;
    email: string;
    createdAt: string;
    updatedAt: string;
  };
}

export const authService = {
  // Signup
  signup: async (data: SignupData): Promise<AuthResponse> => {
    return post<AuthResponse>(API_ENDPOINTS.AUTH.SIGNUP, data);
  },

  // Login
  login: async (data: LoginData): Promise<AuthResponse> => {
    return post<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, data);
  },

  // Get Profile
  getProfile: async (): Promise<ProfileResponse> => {
    return get<ProfileResponse>(API_ENDPOINTS.AUTH.PROFILE);
  },

  // Update Profile
  updateProfile: async (data: { name?: string; email?: string }): Promise<ProfileResponse> => {
    return patch<ProfileResponse>(API_ENDPOINTS.AUTH.UPDATE_PROFILE, data);
  },

  // Save auth data to localStorage
  saveAuth: (token: string, user: any) => {
    localStorage.setItem('ghartak_access_token', token);
    localStorage.setItem('ghartak_user', JSON.stringify(user));
  },

  // Clear auth data from localStorage
  clearAuth: () => {
    localStorage.removeItem('ghartak_access_token');
    localStorage.removeItem('ghartak_user');
  },

  // Get current user from localStorage
  getCurrentUser: () => {
    const userStr = localStorage.getItem('ghartak_user');
    return userStr ? JSON.parse(userStr) : null;
  },
};
