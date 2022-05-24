import { configureStore } from '@reduxjs/toolkit';
import { globalReducer, loginFormReducer } from './reducers';

export const store = configureStore({
  reducer: {
    loginForm: loginFormReducer,
    global: globalReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
