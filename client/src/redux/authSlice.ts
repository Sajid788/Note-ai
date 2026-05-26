import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { User } from "@/lib/types";

const STORAGE_KEY = "ai-notes-user";

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  loading: true,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      if (action.payload) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(action.payload));
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    loadUser: (state) => {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        state.user = raw ? JSON.parse(raw) : null;
      } catch {
        state.user = null;
      }
      state.loading = false;
    },
    logout: (state) => {
      localStorage.removeItem(STORAGE_KEY);
      state.user = null;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const { setUser, setLoading, setError, loadUser, logout, clearError } =
  authSlice.actions;
export default authSlice.reducer;
