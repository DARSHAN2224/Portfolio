import { create } from 'zustand';

/**
 * Authentication state management
 * Handles JWT tokens, user role, and login state
 */
export const useAuthStore = create((set) => ({
  // Auth state
  isAuthenticated: false,
  token: localStorage.getItem('auth_token') || null,
  adminRole: null,
  userEmail: null,

  // Actions
  login: (token, email, role) => {
    localStorage.setItem('auth_token', token);
    set({
      isAuthenticated: true,
      token,
      userEmail: email,
      adminRole: role,
    });
  },

  logout: () => {
    localStorage.removeItem('auth_token');
    set({
      isAuthenticated: false,
      token: null,
      adminRole: null,
      userEmail: null,
    });
  },

  setToken: (token) => {
    localStorage.setItem('auth_token', token);
    set({ token, isAuthenticated: !!token });
  },

  restoreSession: () => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      set({
        token,
        isAuthenticated: true,
      });
    }
  },

  isAdmin: () => {
    const state = get();
    return state.adminRole === 'admin' && state.isAuthenticated;
  },
}));

// Restore session on app initialization
useAuthStore.getState().restoreSession();

export default useAuthStore;
