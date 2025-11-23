import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Admin, LoginCredentials } from '@/types';
import { authApi } from '@/lib/api';

interface AuthState {
  user: Admin | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Actions
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  setUser: (user: Admin) => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      // Login function
      login: async (credentials) => {
        set({ isLoading: true });
        try {
          const tokenData = await authApi.login(credentials);
          
          // Store token
          localStorage.setItem('access_token', tokenData.access_token);
          
          // Get user data
          const user = await authApi.getCurrentAdmin();
          
          set({
            user,
            token: tokenData.access_token,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      // Logout function
      logout: () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },

      // Set user
      setUser: (user) => {
        set({ user, isAuthenticated: true });
      },

      // Check if user is authenticated (on app load)
      checkAuth: async () => {
        const token = localStorage.getItem('access_token');
        
        if (!token) {
          set({ isAuthenticated: false, user: null });
          return;
        }

        try {
          const user = await authApi.getCurrentAdmin();
          set({
            user,
            token,
            isAuthenticated: true,
          });
        } catch (error) {
          console.error(error);
          // Token is invalid
          localStorage.removeItem('access_token');
          set({
            user: null,
            token: null,
            isAuthenticated: false,
          });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);