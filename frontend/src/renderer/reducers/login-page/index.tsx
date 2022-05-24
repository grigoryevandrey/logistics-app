import { createSlice } from '@reduxjs/toolkit';
import { LoginStrategy } from '../../enums';

const initialState = {
  login: {
    data: '',
    error: false,
  },
  password: {
    data: '',
    error: false,
  },
  role: LoginStrategy.manager,
  redirect: false,
};

const loginFormSlice = createSlice({
  name: 'loginForm',
  initialState,
  reducers: {
    setLoginData: (state, action) => {
      state.login.error = false;
      state.login.data = action.payload;
    },
    setPasswordData: (state, action) => {
      state.password.error = false;
      state.password.data = action.payload;
    },
    setRoleData: (state, action) => {
      state.role = action.payload;
    },
    setLoginError: (state, action) => {
      state.login.error = action.payload;
    },
    setPasswordError: (state, action) => {
      state.password.error = action.payload;
    },
    resetLoginFormState: (state) => {
      state.login = {
        data: '',
        error: false,
      };

      state.password = {
        data: '',
        error: false,
      };

      state.role = LoginStrategy.manager;
      state.redirect = false;
    },
    setRedirect: (state) => {
      state.redirect = true;
    },
  },
});

export const {
  setLoginData,
  setPasswordData,
  setRoleData,
  setLoginError,
  setPasswordError,
  resetLoginFormState,
  setRedirect,
} = loginFormSlice.actions;

export const loginFormReducer = loginFormSlice.reducer;
