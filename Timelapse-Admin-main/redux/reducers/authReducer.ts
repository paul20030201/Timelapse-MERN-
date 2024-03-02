"use client"
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  isAuthenticated: boolean;
  user: any;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ user: any }>) => {
      sessionStorage.setItem('_token', action.payload.user.accessToken);
      state.isAuthenticated = true;
      state.user = action.payload.user;
    },
    logout: (state) => {
      sessionStorage.removeItem('_token');
      state.isAuthenticated = false;
      state.user = null;
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;