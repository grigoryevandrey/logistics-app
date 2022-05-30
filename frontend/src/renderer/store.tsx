import { configureStore } from '@reduxjs/toolkit';
import { globalReducer, loginFormReducer, addressesReducer } from './reducers';

export const store = configureStore({
  reducer: {
    loginForm: loginFormReducer,
    global: globalReducer,
    addresses: addressesReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
