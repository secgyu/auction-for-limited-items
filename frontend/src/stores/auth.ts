'use client';

import { create } from 'zustand';
import type { User } from '@/types';

interface AuthState {
  user: Pick<User, 'id' | 'email' | 'name' | 'role'> | null;
  isAuthenticated: boolean;
  setAuth: (user: AuthState['user'], token: string) => void;
  logout: () => void;
  hydrate: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,

  setAuth: (user, token) => {
    localStorage.setItem('accessToken', token);
    localStorage.setItem('user', JSON.stringify(user));
    set({ user, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    set({ user: null, isAuthenticated: false });
  },

  hydrate: () => {
    const userStr = localStorage.getItem('user');
    const token = localStorage.getItem('accessToken');
    if (userStr && token) {
      set({ user: JSON.parse(userStr), isAuthenticated: true });
    }
  },
}));
