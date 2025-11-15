import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface User {
  id: string;
  username: string;
  email?: string;
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  hasAcceptedTerms: boolean;
  imageData?: string;
  createdAt: string;
  updatedAt: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('authToken'),
  isAuthenticated: !!localStorage.getItem('authToken'),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      localStorage.setItem('authToken', action.payload.token);
      localStorage.setItem('currentUser', JSON.stringify(action.payload.user));
    },
    updateUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      localStorage.setItem('currentUser', JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('authToken');
      localStorage.removeItem('currentUser');
    },
    loadUserFromStorage: (state) => {
      const token = localStorage.getItem('authToken');
      const userStr = localStorage.getItem('currentUser');
      if (token && userStr) {
        try {
          state.user = JSON.parse(userStr);
          state.token = token;
          state.isAuthenticated = true;
        } catch (error) {
          console.error('Failed to load user from storage:', error);
          state.user = null;
          state.token = null;
          state.isAuthenticated = false;
        }
      }
    },
  },
});

export const { setCredentials, updateUser, logout, loadUserFromStorage } = authSlice.actions;
export default authSlice.reducer;
