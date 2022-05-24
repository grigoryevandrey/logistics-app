import { createSlice } from '@reduxjs/toolkit';
import { UserRole } from '../../enums';

const initialState = {
  user: {
    role: UserRole.none,
    login: '',
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
        role: UserRole.none,
        login: '',
      };
    },
  },
});

export const { setUser, resetUser } = globalSlice.actions;

export const globalReducer = globalSlice.reducer;
