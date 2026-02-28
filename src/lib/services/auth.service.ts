import apiClient, { initializeCsrf } from '../api-client';
import { User } from '@/types';

export interface LoginPayload {
  email?: string;
  username?: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password1: string;
  password2: string;
  username?: string;
  company?: string;
}

export interface LoginResponse {
  key: string;
  user: User;
}

export const authService = {
  /**
   * Login user with email/username and password
   */
  async login(payload: LoginPayload): Promise<LoginResponse> {
    await initializeCsrf();
    const response = await apiClient.post<LoginResponse>('/auth/login/', payload);
    if (response.data.key) {
      localStorage.setItem('token', response.data.key);
    }
    await initializeCsrf(); // Refresh CSRF after login
    return response.data;
  },

  /**
   * Register new user
   */
  async register(payload: RegisterPayload): Promise<LoginResponse> {
    await initializeCsrf();
    const response = await apiClient.post<LoginResponse>('/auth/registration/', payload);
    if (response.data.key) {
      localStorage.setItem('token', response.data.key);
    }
    await initializeCsrf(); // Refresh CSRF after registration
    return response.data;
  },

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout/');
    } finally {
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
    }
  },

  /**
   * Request password reset
   */
  async requestPasswordReset(email: string): Promise<{ detail: string }> {
    const response = await apiClient.post<{ detail: string }>('/auth/password-reset/request/', { email });
    return response.data;
  },

  /**
   * Confirm password reset with token
   */
  async resetPassword(token: string, newPassword: string): Promise<{ detail: string }> {
    const response = await apiClient.post<{ detail: string }>('/auth/password-reset/confirm/', {
      token,
      new_password: newPassword,
    });
    return response.data;
  },

  /**
   * Verify email with token
   */
  async verifyEmail(token: string): Promise<{ detail: string }> {
    const response = await apiClient.post<{ detail: string }>('/auth/verify-email/', { token });
    return response.data;
  },

  /**
   * Resend verification email
   */
  async resendVerificationEmail(email?: string): Promise<{ detail: string }> {
    const response = await apiClient.post<{ detail: string }>('/auth/resend-verification/', 
      email ? { email } : {}
    );
    return response.data;
  },

  /**
   * Exchange magic link token for authentication token
   */
  async exchangeMagicToken(token: string, redirectTo?: string): Promise<LoginResponse> {
    const params: any = { token };
    if (redirectTo) params.redirect_to = redirectTo;
    
    const response = await apiClient.get<LoginResponse>('/auth/exchange-magic-token/', { params });
    if (response.data.key) {
      localStorage.setItem('token', response.data.key);
    }
    await initializeCsrf(); // Refresh CSRF after magic link
    return response.data;
  },

  /**
   * Get current user profile
   */
  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<User>('/profile/me/');
    return response.data;
  },
};
