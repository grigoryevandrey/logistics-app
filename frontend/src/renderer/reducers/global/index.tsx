import { createSlice } from '@reduxjs/toolkit';
import { UserRole } from '../../enums';

const initialState = {
  user: {
    role: UserRole.none,
    login: '',
    firstName: '',
    lastName: '',
    patronymic: '',
  },
  credentials: {
    accessToken: '',
    refreshToken: '',
  },
  isLoggingOut: false,
};

const globalSlice = createSlice({
  name: 'global',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    resetUser: (state) => {
      state.user = {
        role: UserRole.none,
        login: '',
        firstName: '',
        lastName: '',
        patronymic: '',
      };
    },
    setCredentials: (state, action) => {
      state.credentials = action.payload;
      console.log('🚀 ~ file: index.tsx ~ line 31 ~ state.credentials', state.credentials);
    },
    deleteCredentials: (state) => {
      state.credentials = {
        accessToken: '',
        refreshToken: '',
      };
      console.log('🚀 ~ file: index.tsx ~ line 40 ~ state.credentials', state.credentials);
    },
    setIsLoggingOut: (state) => {
      state.isLoggingOut = true;
    },
    resetIsLoggingOut: (state) => {
      state.isLoggingOut = false;
    },
  },
});

export const { setUser, resetUser, setCredentials, deleteCredentials, setIsLoggingOut, resetIsLoggingOut } =
  globalSlice.actions;

export const globalReducer = globalSlice.reducer;
