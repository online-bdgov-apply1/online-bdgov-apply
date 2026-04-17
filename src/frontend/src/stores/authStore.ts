import { create } from "zustand";

interface AuthState {
  adminToken: string | null;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  adminToken: sessionStorage.getItem("adminToken"),
  isAuthenticated: !!sessionStorage.getItem("adminToken"),

  login: (token: string) => {
    sessionStorage.setItem("adminToken", token);
    set({ adminToken: token, isAuthenticated: true });
  },

  logout: () => {
    sessionStorage.removeItem("adminToken");
    set({ adminToken: null, isAuthenticated: false });
  },
}));
