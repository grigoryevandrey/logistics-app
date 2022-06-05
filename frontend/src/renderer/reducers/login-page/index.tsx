import { createSlice } from '@reduxjs/toolkit';
import { LoginStrategy } from '../../enums';

const initialState = {
  login: {
    data: 'test',
    error: false,
  },
  password: {
    data: '123456',
    error: false,
  },
  role: LoginStrategy.Manager,
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
        data: 'test',
        error: false,
      };

      state.password = {
        data: '123456',
        error: false,
      };

      state.role = LoginStrategy.Manager;
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
