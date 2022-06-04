import { createSlice } from '@reduxjs/toolkit';
import { UserRole } from '../../enums';

const initialState = {
  user: {
    role: UserRole.None,
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
  snackbar: {
    open: false,
    message: '',
    severity: 'success',
  },
  backdrop: {
    open: false,
  },
  dialog: {
    open: false,
    title: '',
    text: '',
    yesAction: () => {},
    noAction: () => {},
  },
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
        role: UserRole.None,
        login: '',
        firstName: '',
        lastName: '',
        patronymic: '',
      };
    },
    setCredentials: (state, action) => {
      state.credentials = action.payload;
    },
    deleteCredentials: (state) => {
      state.credentials = {
        accessToken: '',
        refreshToken: '',
      };
    },
    setIsLoggingOut: (state) => {
      state.isLoggingOut = true;
    },
    resetIsLoggingOut: (state) => {
      state.isLoggingOut = false;
    },
    openSnackbar: (state, action) => {
      state.snackbar = {
        ...action.payload,
        open: true,
      };
    },
    closeSnackbar: (state) => {
      state.snackbar = {
        ...state.snackbar,
        open: false,
      };
    },
    openBackdrop: (state) => {
      state.backdrop = {
        open: true,
      };
    },
    closeBackdrop: (state) => {
      state.backdrop = {
        open: false,
      };
    },
    setDialog: (state, action) => {
      state.dialog = { ...state.dialog, ...action.payload };
    },
    resetDialog: (state) => {
      state.dialog = {
        open: false,
        title: '',
        text: '',
        yesAction: () => {},
        noAction: () => {},
      };
    },
  },
});

export const {
  setUser,
  resetUser,
  setCredentials,
  deleteCredentials,
  setIsLoggingOut,
  resetIsLoggingOut,
  openSnackbar,
  closeSnackbar,
  openBackdrop,
  closeBackdrop,
  setDialog,
  resetDialog,
} = globalSlice.actions;

export const globalReducer = globalSlice.reducer;
